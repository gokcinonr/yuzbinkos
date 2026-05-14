import { useState } from "react";
import { motion } from "framer-motion";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Mail, MapPin, Instagram, Send, CheckCircle } from "lucide-react";

export default function IletisimPage() {
  usePageSeo("iletisim", "İletişim | YBK — Triatlon Kulübü");

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  }

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
            <span className="text-primary font-semibold text-sm block mb-3">Ulaşın</span>
            <h1 className="font-bold text-5xl text-foreground">İletişim</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Sorularınız, üyelik başvurularınız veya işbirliği teklifleri için bize ulaşabilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-bold text-2xl text-foreground mb-6">Bize Ulaşın</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-0.5">E-posta</p>
                      <a href="mailto:info@yuzbinkos.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        info@yuzbinkos.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-0.5">Konum</p>
                      <p className="text-muted-foreground text-sm">İstanbul, Türkiye</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-0.5">Instagram</p>
                      <a
                        href="https://instagram.com/ybk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        @ybk
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-foreground mb-2">YBK'ya Katılmak İstiyor musunuz?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Üyelik başvurusu ve antrenman programları hakkında bilgi almak için form aracılığıyla bize ulaşın. Ekibimiz en kısa sürede dönüş yapar.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16 bg-card rounded-2xl shadow-sm"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-3">Mesajınız Alındı!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    En kısa sürede size dönüş yapacağız. Takipte kalın!
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-sm text-primary font-medium hover:underline"
                  >
                    Yeni mesaj gönder
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Adınız Soyadınız"
                        className="w-full px-4 py-3 bg-card rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">E-posta</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="ornek@mail.com"
                        className="w-full px-4 py-3 bg-card rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Konu</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="ör. Üyelik Başvurusu, Antrenman Programı..."
                      className="w-full px-4 py-3 bg-card rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Mesajınız</label>
                    <textarea
                      rows={6}
                      required
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Mesajınızı buraya yazın..."
                      className="w-full px-4 py-3 bg-card rounded-xl text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors disabled:opacity-60"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
