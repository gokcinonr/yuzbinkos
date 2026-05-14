import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePageSeo } from "@/hooks/usePageSeo";
import { CalendarDays, MapPin, Clock, Loader2 } from "lucide-react";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
};

const categoryColors: Record<string, string> = {
  Yarış: "bg-primary text-white",
  Kamp: "bg-emerald-600 text-white",
  Seminer: "bg-blue-600 text-white",
  Antrenman: "bg-amber-500 text-black",
  Sosyal: "bg-purple-600 text-white",
  Diğer: "bg-muted text-foreground",
};

export default function EtkinliklerPage() {
  usePageSeo("etkinlikler", "Etkinlikler | YBK — Triatlon Kulübü");

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ybk/events")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Event[]) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-card pt-28 pb-14">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-semibold text-sm block mb-3">Takvim</span>
            <h1 className="font-bold text-5xl text-foreground">Etkinlikler</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Yarışlar, kamplar, seminerler ve grup antrenmanları. YBK ile her hafta yeni bir deneyim.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events list */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Yükleniyor…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Yaklaşan etkinlik bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {events.map((etkinlik, index) => (
                <motion.div
                  key={etkinlik.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Date block */}
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary mb-1" />
                      <span className="text-xs font-bold text-primary leading-tight text-center px-1">
                        {etkinlik.date ? etkinlik.date.split(" ").slice(0, 2).join(" ") : "—"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {etkinlik.category && (
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[etkinlik.category] ?? "bg-muted text-foreground"}`}>
                            {etkinlik.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{etkinlik.title}</h3>
                      {etkinlik.description && (
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{etkinlik.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {etkinlik.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {etkinlik.location}
                          </span>
                        )}
                        {etkinlik.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {etkinlik.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
