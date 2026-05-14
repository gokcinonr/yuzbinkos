import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";

export default function TeamPage() {
  usePageSeo("team", "Ekip | YBK — Triatlon Kulübü");

  const { data: team = [], isLoading } = useQuery({
    queryKey: ["ybk-team"],
    queryFn: api.team.list,
  });

  const activeCoaches = team
    .filter((t) => t.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
            <span className="text-primary font-semibold text-sm block mb-3">YBK Kadrosu</span>
            <h1 className="font-bold text-5xl text-foreground">Antrenörler</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Seni hedeflerine ulaştıracak, tecrübeli ve tutkulu eğitmen kadromuzla tanış.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[460px] bg-card animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : activeCoaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCoaches.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Users className="w-16 h-16 text-muted-foreground opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold text-sm mb-4">{member.role}</p>
                    <div className="pt-4">
                      <p className="text-muted-foreground text-xs font-semibold mb-1">Uzmanlık Alanı</p>
                      <p className="text-foreground text-sm font-medium">{member.speciality}</p>
                    </div>
                    {member.bio && (
                      <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card rounded-2xl">
              <p className="text-muted-foreground text-lg font-medium">Kadro bilgisi yakında eklenecektir.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
