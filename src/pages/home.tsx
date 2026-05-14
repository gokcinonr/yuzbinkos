import { useQuery } from "@tanstack/react-query";
import { api, resolveImageUrl } from "@/lib/api";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Activity, CalendarDays, Users, Trophy, Laptop, Medal, PersonStanding, Bike, Waves } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";

const PROGRAMS = [
  {
    slug: "online-coaching",
    title: "Online Coaching",
    icon: Laptop,
    description: "Nerede olursan ol, sana özel hazırlanmış antrenman planları ve birebir koçluk desteğiyle hedeflerine ulaş.",
  },
  {
    slug: "triatlon",
    title: "Triatlon",
    icon: Medal,
    description: "Yüzme, bisiklet ve koşu disiplinlerini bir arada geliştir. Yarışa hazır bir triatlet ol.",
  },
  {
    slug: "atletizm",
    title: "Atletizm",
    icon: PersonStanding,
    description: "Koşu tekniğini ve dayanıklılığını geliştir. Şampiyonluk kadromuzla yeni kişisel rekorlar kır.",
  },
  {
    slug: "bisiklet",
    title: "Bisiklet",
    icon: Bike,
    description: "Yol ve parkur bisikletinde güç, teknik ve strateji geliştir. Pedalı daha verimli çevir.",
  },
  {
    slug: "yuzme",
    title: "Yüzme",
    icon: Waves,
    description: "Serbest stilde teknik mükemmelliyet ve açık su performansı için uzman eğitim programları.",
  },
];

export default function HomePage() {
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ["ybk-blog-posts"],
    queryFn: api.blogPosts.list,
  });

  const { data: homeCards = [] } = useQuery({
    queryKey: ["ybk-home-cards"],
    queryFn: api.homeCards.list,
  });

  const { data: nedenYbkSeo } = useQuery({
    queryKey: ["ybk-seo", "neden-ybk"],
    queryFn: () => api.seo.get("neden-ybk"),
  });

  const nedenPill = nedenYbkSeo?.contentPill || "Neden YBK?";
  const nedenTitle = nedenYbkSeo?.contentTitle || "Dünyadaki bir ilkin parçası ol.";
  const nedenBody = nedenYbkSeo?.contentBody || "Online olarak organize olan, yarışlara hazırlanan ve 4 branşta federe olup ayrıca altyapısı dolan dünyadaki ilk spor kulübüyüz. YüzBinKoş Spor Kulübü'nde size sadece antrenman programı yazıp uygulamanızı beklemiyoruz. Şampiyonlukları olan eğitmen kadromuzun tüm bilgi ve birikimlerinden faydalanabileceğiniz eğitimler ve kamplar düzenleyerek sizi katılacağınız yarışlara eksiksiz olarak hazırlıyoruz.";

  const { data: homeSeo } = useQuery({
    queryKey: ["ybk-seo", "home"],
    queryFn: () => api.seo.get("home"),
  });

  const heroContent = (() => {
    try { return homeSeo?.contentJson ? JSON.parse(homeSeo.contentJson) : {}; }
    catch { return {}; }
  })();
  const heroTitle = heroContent.title || "Sınırlarını Zorlamaya Hazır mısın?";
  const heroSubtitle = heroContent.subtitle || "YBK ile antrenman yap, potansiyelini keşfet. Türkiye'nin en iddialı triatlon kulübünde yerini al.";
  const heroCta1Label = heroContent.cta1Label || "Antrenmana Başla";
  const heroCta1Href = heroContent.cta1Href || "/egitimler";
  const heroCta2Label = heroContent.cta2Label || "Bizi Tanı";
  const heroCta2Href = heroContent.cta2Href || "/hakkimizda";

  const { heroImageUrl, heroImageAlt } = usePageSeo("home", "YBK — Anasayfa | Türkiye Triatlon Kulübü");

  const recentPosts = posts.slice(0, 3);
  const nedenYbkImage = resolveImageUrl(nedenYbkSeo?.heroImageUrl);

  return (
    <div className="flex flex-col">
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[65dvh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: heroImageUrl ? `url('${heroImageUrl}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: !heroImageUrl ? "#0f1f10" : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-start pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white mb-6">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-xl leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={heroCta1Href}
                className="bg-primary hover:bg-primary/90 text-white font-semibold text-base px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:shadow-lg"
                data-testid="hero-cta"
              >
                {heroCta1Label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={heroCta2Href}
                className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white font-semibold text-base px-6 py-3 rounded-full transition-all"
              >
                {heroCta2Label}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Dörtlü İkonlu Kartlar ────────────────────────────────────────── */}
      <section className="bg-background py-2">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/40">
            {[
              { icon: <Activity className="w-7 h-7 text-primary" />, title: "Profesyonel Programlar", desc: "Seviyene özel eğitimler" },
              { icon: <Users className="w-7 h-7 text-primary" />, title: "Uzman Kadro", desc: "Deneyimli antrenörler" },
              { icon: <CalendarDays className="w-7 h-7 text-primary" />, title: "Düzenli Antrenman", desc: "Haftalık planlı çalışma" },
              { icon: <Trophy className="w-7 h-7 text-primary" />, title: "Yarış Odaklı", desc: "Hedef yarışlara hazırlık" },
            ].map((item, i) => (
              <div key={i} className="py-10 px-6 flex flex-col items-center text-center gap-4">
                {item.icon}
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-bold text-base md:text-lg text-foreground leading-snug">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Neden YBK ────────────────────────────────────────────────────── */}
      <section className="bg-primary overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          <div className="flex items-center py-20 md:py-28 px-6 md:px-12 lg:px-16 relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10 max-w-xl"
            >
              <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                {nedenPill}
              </span>
              <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-8">
                {nedenTitle}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">{nedenBody}</p>
            </motion.div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-0">
            {nedenYbkImage ? (
              <img src={nedenYbkImage} alt="Neden YBK" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                <span className="text-white/30 text-sm">Görsel admin panelinden yüklenebilir</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Blog ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-primary font-semibold text-sm block mb-2">Haberler &amp; Makaleler</span>
              <h2 className="font-bold text-4xl text-foreground">Blog</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-muted-foreground hover:text-primary font-medium text-sm transition-colors">
              Tüm Yazılar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-72 bg-card animate-pulse rounded-2xl" />)}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex flex-col bg-card rounded-2xl overflow-hidden">
                  {post.coverImage && (
                    <div className="h-44 overflow-hidden">
                      <img src={resolveImageUrl(post.coverImage) ?? ""} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-primary font-semibold text-xs mb-3 block">{post.category}</span>
                    <h3 className="font-bold text-base text-foreground mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span className="font-medium">{post.author}</span>
                      {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl">
              <p className="text-muted-foreground">Henüz blog yazısı yok.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Eğitimler ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="font-bold text-4xl text-foreground">Eğitimler</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PROGRAMS.map((program, index) => (
              <motion.div
                key={program.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  href={`/egitimler/${program.slug}`}
                  className="group aspect-square flex flex-col bg-background rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                >
                  <div className="flex-[2] flex items-center justify-center border-b border-border/40">
                    <program.icon className="w-10 h-10 text-primary" strokeWidth={1.25} />
                  </div>
                  <div className="flex-[3] p-4 md:p-5 flex flex-col">
                    <h3 className="font-bold text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1 line-clamp-3">
                      {program.description}
                    </p>
                    <div className="pt-3 flex justify-end">
                      <span className="flex items-center gap-1 text-primary font-semibold text-xs md:text-sm group-hover:translate-x-1 transition-transform">
                        İncele <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Üçlü Kart Bölümü ─────────────────────────────────────────────── */}
      {homeCards.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeCards.slice(0, 3).map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="flex flex-col bg-background rounded-2xl overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    {card.imageUrl ? (
                      <img
                        src={resolveImageUrl(card.imageUrl) ?? ""}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Activity className="w-10 h-10 text-muted-foreground opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    <h3 className="font-bold text-lg text-foreground leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {card.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
