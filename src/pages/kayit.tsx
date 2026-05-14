import React, { useState } from "react";
import { Link } from "wouter";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function KayitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/ybk/hesabim?verified=true",
      });
      if (result.error) {
        setError(result.error.message ?? "Hesap oluşturulamadı. Lütfen tekrar deneyin.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-5">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-bold text-2xl text-foreground mb-2">Gelen kutunuzu kontrol edin</h1>
          <p className="text-sm text-muted-foreground mb-2">Doğrulama bağlantısı gönderildi:</p>
          <p className="text-sm font-semibold text-foreground mb-6">{email}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            E-postadaki bağlantıya tıklayarak hesabınızı etkinleştirin. Bağlantı 24 saat geçerlidir.
          </p>
          <div className="space-y-3">
            <ResendButton email={email} />
            <p className="text-xs text-muted-foreground">
              Zaten doğruladınız mı?{" "}
              <Link href="/giris" className="text-primary font-semibold hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <h1 className="font-bold text-2xl text-foreground mb-1">Hesap Oluştur</h1>
        <p className="text-sm text-muted-foreground mb-8">YBK ailesine katılın.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Ad Soyad
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="siz@ornek.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="En az 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold text-sm py-3 rounded-full hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Hesap Oluştur
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-primary font-semibold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

function ResendButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function resend() {
    setStatus("loading");
    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/ybk/hesabim?verified=true",
      });
      setStatus(result.error ? "error" : "sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
        <CheckCircle2 className="w-4 h-4" /> Doğrulama e-postası yeniden gönderildi.
      </p>
    );
  }

  return (
    <button
      onClick={resend}
      disabled={status === "loading"}
      className="w-full border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground py-2.5 transition-colors disabled:opacity-60"
    >
      {status === "loading" ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Gönderiliyor…
        </span>
      ) : status === "error" ? (
        "Başarısız — tekrar deneyin"
      ) : (
        "Doğrulama e-postasını yeniden gönder"
      )}
    </button>
  );
}
