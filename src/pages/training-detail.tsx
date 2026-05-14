import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, resolveImageUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Activity, Target } from "lucide-react";

export default function TrainingDetailPage() {
  const { slug } = useParams();

  const { data: training, isLoading } = useQuery({
    queryKey: ["ybk-training", slug],
    queryFn: () => api.trainings.get(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-3xl text-foreground">Eğitim bulunamadı</h1>
        <Link href="/egitimler" className="text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Eğitimlere Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col bg-background pb-24">
      {/* Hero */}
      {training.coverImage && (
        <div className="relative h-[50vh] min-h-[360px] mt-18">
          <img
            src={resolveImageUrl(training.coverImage) ?? ""}
            alt={training.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl"
        >
          <Link
            href="/egitimler"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Tüm Eğitimler
          </Link>

          <h1 className="font-bold text-3xl md:text-5xl text-foreground leading-tight mb-4">
            {training.title}
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl mb-8 leading-relaxed">
            {training.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12 pb-8">
            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">Seviye</p>
                <p className="text-foreground font-semibold text-sm">{training.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">Süre</p>
                <p className="text-foreground font-semibold text-sm">{training.duration}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-foreground/80 prose-p:leading-relaxed prose-img:rounded-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: training.content }}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Programa Katıl</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Bu eğitime katılarak sınırlarını zorla ve hedeflerine ulaş. Detaylı bilgi ve kayıt için bizimle iletişime geç.
              </p>
              <button
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                data-testid="join-training-btn"
                onClick={() => {
                  alert("İletişim formuna yönlendirilecek");
                }}
              >
                Hemen Başvur
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
