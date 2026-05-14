import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Target, Shield, Zap } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";

export default function AboutPage() {
  const { heroImageUrl, heroImageAlt } = usePageSeo("about", "Hakkımızda | YBK — Triatlon Kulübü");

  const { data: page, isLoading } = useQuery({
    queryKey: ["ybk-page", "hakkimizda"],
    queryFn: () => api.pages.get("hakkimizda").catch(() => null),
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: heroImageUrl ? `url('${heroImageUrl}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: !heroImageUrl ? "#0f1f10" : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block bg-primary/25 text-primary border border-primary/40 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              Biz Kimiz?
            </span>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              YBK
            </h1>
            <p className="text-xl text-white/75 leading-relaxed">
              Tutkuyla antrenman yapan, pes etmeyi reddeden sporcuların adresi. Biz bir kulüpten daha fazlasıyız; biz bir aileyiz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: <Target className="w-8 h-8 text-primary" />,
                title: "Odak",
                desc: "Hedefsiz antrenman sadece terlemektir. Biz hedeflere odaklanır, sonuçlara ulaşmak için planlı ilerleriz.",
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "Enerji",
                desc: "Sınırlar sadece zihindedir. Yüksek enerji ve sarsılmaz bir iradeyle her antrenmanda limitleri aşarız.",
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Birlik",
                desc: "Triatlon bireysel bir spor olsa da, başarı takımın gücünden doğar. Biz birlikte ter döker, birlikte kazanırız.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center bg-background rounded-2xl p-8 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-7 bg-card animate-pulse rounded-lg w-1/3" />
                <div className="h-4 bg-card animate-pulse rounded-lg w-full" />
                <div className="h-4 bg-card animate-pulse rounded-lg w-full" />
                <div className="h-4 bg-card animate-pulse rounded-lg w-5/6" />
                <div className="h-40 bg-card animate-pulse rounded-lg w-full mt-6" />
              </div>
            ) : page ? (
              <div
                className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-foreground/80 prose-p:leading-relaxed prose-img:rounded-xl prose-blockquote:border-primary prose-blockquote:text-muted-foreground max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-blockquote:border-primary prose-blockquote:text-muted-foreground max-w-none">
                <h2>Hikayemiz</h2>
                <p>
                  YBK, triatlon sporuna gönül vermiş, sınırlarını zorlamaktan çekinmeyen sporcuları bir araya getirmek amacıyla kurulmuştur. Adımız, sporun üç temel disiplinini simgelerken, aynı zamanda uzun mesafelere olan tutkumuzu yansıtır.
                </p>
                <p>
                  Sıradan bir spor kulübünden öte, aynı hedeflere koşan, birbirini motive eden ve omuz omuza yarışan bir aileyiz. İster ilk triatlon deneyimine hazırlanan bir acemi, ister Ironman mesafelerini hedefleyen tecrübeli bir atlet ol; YBK'da senin için bir yer var.
                </p>
                <h3>Misyonumuz</h3>
                <p>
                  Türkiye'de triatlon sporunu yaygınlaştırmak, bilimsel ve sistemli antrenman yöntemleriyle sporcularımızın potansiyellerini en üst seviyeye çıkarmalarını sağlamak ve yarışlarda kulübümüzü gururla temsil etmektir.
                </p>
                <blockquote>
                  "Yarış çizgisini geçmek sadece bir sonuçtur. Asıl başarı, o çizgiye gelene kadar gösterilen sarsılmaz iradedir."
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
