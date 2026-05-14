import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function GirisPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        const msg = result.error.message ?? "";
        if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("verif")) {
          setNeedsVerification(true);
        } else {
          setError(msg || "Geçersiz e-posta veya şifre");
        }
      } else {
        navigate("/hesabim");
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email) { setError("Önce e-posta adresinizi girin."); return; }
    setResendStatus("loading");
    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/hesabim?verified=true",
      });
      setResendStatus(result.error ? "error" : "sent");
    } catch {
      setResendStatus("error");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <h1 className="font-bold text-2xl text-foreground mb-1">Giriş Yap</h1>
        <p className="text-sm text-muted-foreground mb-8">YBK hesabınıza hoş geldiniz.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setNeedsVerification(false); }}
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
                autoComplete="current-password"
                className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
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

          {needsVerification && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-400 mb-1">E-posta doğrulanmamış</p>
              <p className="text-amber-700 dark:text-amber-500 text-xs mb-3">
                Giriş yapmadan önce lütfen e-postanızı doğrulayın.
              </p>
              {resendStatus === "sent" ? (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Doğrulama e-postası gönderildi — gelen kutunuzu kontrol edin.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendVerification}
                  disabled={resendStatus === "loading"}
                  className="text-xs font-semibold text-primary hover:underline disabled:opacity-60"
                >
                  {resendStatus === "loading" ? "Gönderiliyor…" : resendStatus === "error" ? "Başarısız — tekrar deneyin" : "Doğrulama e-postasını yeniden gönder →"}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold text-sm py-3 rounded-full hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Giriş Yap
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="text-primary font-semibold hover:underline">
            Üye Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
