import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api, resolveImageUrl } from "@/lib/api";
import { Send, CheckCircle2 } from "lucide-react";

const sayfaLinks = [
  { href: "/egitimler", label: "Eğitimler" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

const hakkimizdaLinks = [
  { href: "/hakkimizda", label: "Kurumsal" },
  { href: "/ekip", label: "Eğitmenler" },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Kaydınız alındı! Haberdar edeceğiz.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e-posta@adresin.com"
        className="flex-1 bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-60 shrink-0"
      >
        {status === "loading" ? "Kaydediliyor…" : <><Send className="w-3.5 h-3.5" /> Abone Ol</>}
      </button>
    </form>
  );
}

export function Footer() {
  const { data: logoSeo } = useQuery({
    queryKey: ["ybk-seo", "logo"],
    queryFn: () => api.seo.get("logo"),
    staleTime: 1000 * 60 * 10,
  });
  const logoUrl = resolveImageUrl(logoSeo?.heroImageUrl);

  return (
    <footer className="bg-white border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-8">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="YBK"
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-bold text-2xl tracking-tight text-foreground">YBK</span>
              )}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Antrenman yap, yarış, sınırlarını zorla. Türkiye'nin triatlon kulübü. Acemiden Ironman'e kadar herkese açık.
            </p>
          </div>

          {/* Sayfalar */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Sayfalar</h4>
            <ul className="space-y-3">
              {sayfaLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hakkımızda */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Hakkımızda</h4>
            <ul className="space-y-3">
              {hakkimizdaLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@yuzbinkos.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@yuzbinkos.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ybk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  @ybk (Instagram)
                </a>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  İletişim Formu
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-border/40">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">
                Haberdar Ol
              </h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Antrenman ipuçları, etkinlik duyuruları ve kulüp haberleri — doğrudan gelen kutuna. Spam yok.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} YBK — Yüzbin Koşu. Tüm hakları saklıdır.</p>
          <Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </footer>
  );
}
