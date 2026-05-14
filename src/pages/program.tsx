import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, resolveImageUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Send, Laptop, Medal, PersonStanding, Bike, Waves, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Program = {
  slug: string;
  title: string;
  icon: LucideIcon;
};

const PROGRAMS: Program[] = [
  { slug: "online-coaching", title: "Online Coaching", icon: Laptop },
  { slug: "triatlon",        title: "Triatlon",        icon: Medal },
  { slug: "atletizm",        title: "Atletizm",        icon: PersonStanding },
  { slug: "bisiklet",        title: "Bisiklet",        icon: Bike },
  { slug: "yuzme",           title: "Yüzme",           icon: Waves },
];

function ApplicationForm({ programSlug }: { programSlug: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.programs.apply(programSlug, form),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <p className="font-bold text-foreground text-xl">Başvurunuz alındı!</p>
        <p className="text-muted-foreground text-sm">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ad Soyad *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Adınız ve soyadınız"
          className="w-full px-4 py-2.5 bg-background rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">E-posta *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="ornek@email.com"
          className="w-full px-4 py-2.5 bg-background rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Telefon</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="+90 5xx xxx xx xx"
          className="w-full px-4 py-2.5 bg-background rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Mesaj</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Kendinizden ve hedeflerinizden bahsedebilirsiniz..."
          rows={4}
          className="w-full px-4 py-2.5 bg-background rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
        />
      </div>
      {mutation.isError && (
        <p className="text-xs text-red-500">Başvuru gönderilemedi, lütfen tekrar deneyin.</p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-60"
      >
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Hemen Başvur
      </button>
    </form>
  );
}

export default function ProgramPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = PROGRAMS.find((p) => p.slug === slug) ?? { slug: slug ?? "", title: slug ?? "", icon: Laptop };
  const formRef = useRef<HTMLDivElement>(null);

  const { data: program, isLoading } = useQuery({
    queryKey: ["ybk-program", slug],
    queryFn: () => api.programs.get(slug ?? ""),
    enabled: !!slug,
  });

  const pageTitle    = program?.title ?? meta.title;
  const heroTitle    = program?.heroTitle ?? pageTitle;
  const heroSubtitle = program?.heroSubtitle ?? null;

  useEffect(() => {
    if (!pageTitle) return;
    document.title = `${pageTitle} | YBK`;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      program?.metaDescription ??
      (heroSubtitle
        ? `${pageTitle} — ${heroSubtitle}`
        : `YBK ${pageTitle} eğitim programı hakkında bilgi alın ve başvurun.`);

    return () => {
      document.title = "YBK — Yüzbin Koşu";
      if (metaDesc) metaDesc.content = "";
    };
  }, [pageTitle, heroSubtitle, program?.metaDescription]);

  const scrollToForm = () => {
    if (!formRef.current) return;
    const headerHeight = window.scrollY > 60 ? 64 : 80;
    const top = formRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <article className="flex flex-col bg-background pb-24">
      {/* ── Hero: 2-sütun tam genişlik ── */}
      <div className="w-full flex flex-col lg:flex-row min-h-[65dvh]">
        {/* Sol %55 — metin */}
        <div
          className="flex-[55] flex items-center bg-[#0a1f4a]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="pt-7 px-4 pb-8 md:px-12 md:py-16 lg:px-16 lg:py-24 w-full"
          >
            <span className="inline-block bg-white/10 text-white/80 text-[11px] md:text-xs font-semibold px-3 py-1 rounded-full mb-3 md:mb-6 tracking-wide capitalize">
              {pageTitle}
            </span>
            <h1
              className="font-bold text-white leading-tight mb-5"
              style={{ fontSize: "clamp(1.375rem, 3.5vw + 0.75rem, 3.5rem)" }}
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-white/70 text-base md:text-xl leading-relaxed mb-4 md:mb-8">
                {heroSubtitle}
              </p>
            )}
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-white text-[#0a1f4a] hover:bg-white/90 font-semibold px-6 py-3 rounded-full transition-colors text-xs md:text-sm"
            >
              Hemen Başvur
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Sağ %45 — görsel */}
        <div
          className="flex-[45] min-h-[300px] lg:min-h-0 bg-[#0f2a5a]"
          style={{
            backgroundImage: program?.heroImageUrl ? `url('${resolveImageUrl(program.heroImageUrl)}')` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* ── İçerik + Sidebar ── */}
      <div className="container mx-auto px-4 md:px-8 pt-7 pb-14 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol: makale içeriği */}
          <div className="lg:col-span-2">
            {program?.content ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-sm md:prose-lg prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-p:text-foreground/80 prose-p:leading-relaxed prose-img:rounded-2xl max-w-none"
                dangerouslySetInnerHTML={{ __html: program.content }}
              />
            ) : (
              <div className="text-muted-foreground text-lg py-8">
                Bu program için içerik yakında eklenecek.
              </div>
            )}
          </div>

          {/* Sağ: sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Program navigasyonu */}
              <div className="bg-card rounded-2xl overflow-hidden border border-border/40">
                <div className="px-5 py-4 border-b border-border/40">
                  <p className="font-bold text-sm text-foreground uppercase tracking-wider">Eğitimler</p>
                </div>
                <div className="divide-y divide-border/40">
                  {PROGRAMS.map((p) => {
                    const isActive = p.slug === slug;
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.slug}
                        href={`/egitimler/${p.slug}`}
                        className={`flex items-center gap-3 px-5 py-3.5 transition-colors group ${
                          isActive
                            ? "bg-primary/8 text-primary"
                            : "hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors ${
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          }`}
                          strokeWidth={1.25}
                        />
                        <span className={`text-sm font-semibold ${isActive ? "text-primary" : ""}`}>
                          {p.title}
                        </span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Başvuru Formu (sayfa sonu) ── */}
      <div ref={formRef} className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border/40">
            <h2 className="font-bold text-2xl text-foreground mb-2">Hemen Başvur</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {meta.title} programına başvurmak için formu doldurun, sizinle iletişime geçelim.
            </p>
            <ApplicationForm programSlug={slug ?? ""} />
          </div>
        </div>
      </div>
    </article>
  );
}
