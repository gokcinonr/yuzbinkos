import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import {
  CheckCircle2, AlertCircle, Loader2, LogOut, CreditCard,
  Calendar, ExternalLink, Trophy,
} from "lucide-react";

function SubscriptionCard({ userId }: { userId: string }) {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.stripe.subscription();
        if (data.error) { setError(data.error); setLoading(false); return; }
        setSub(data.subscription);
        setLoading(false);
      } catch {
        setError("Bağlantı hatası — lütfen tekrar deneyin");
        setLoading(false);
      }
    })();
  }, [userId]);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const data = await api.stripe.portal();
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message ?? "Bir hata oluştu");
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-secondary/30 rounded-2xl p-8 flex items-center gap-3 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Abonelik yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-destructive/20 bg-destructive/10 rounded-2xl p-6 flex items-start gap-2 text-destructive text-sm">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="bg-secondary/30 rounded-2xl p-8 text-center">
        <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-bold text-foreground mb-2">Aktif abonelik yok</h3>
        <p className="text-sm text-muted-foreground mb-6">
          YBK üyeliği ile antrenman içeriklerine erişin.
        </p>
        <Link href="/uye-ol">
          <button className="bg-primary text-white font-bold text-sm py-2.5 px-8 rounded-full hover:bg-primary/90 transition-all">
            Üyelik Planlarını Gör →
          </button>
        </Link>
      </div>
    );
  }

  const stripeProduct = sub.items?.data?.[0]?.price?.product;
  const productName = typeof stripeProduct === "object" && stripeProduct !== null
    ? (stripeProduct as any).name as string | undefined
    : undefined;
  const priceNickname = sub.items?.data?.[0]?.price?.nickname as string | undefined;
  const planName = productName ?? priceNickname ?? "YBK Üyelik";
  const status = sub.status as string;
  const currentPeriodEnd = sub.current_period_end
    ? new Date(Number(sub.current_period_end) * 1000).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;
  const isActive = status === "active" || status === "trialing";
  const statusLabel: Record<string, string> = {
    active: "Aktif", trialing: "Deneme", canceled: "İptal", past_due: "Ödeme Bekliyor",
  };

  return (
    <div className="bg-secondary/30 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-foreground">{planName}</span>
          </div>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isActive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
          }`}>
            {statusLabel[status] ?? status}
          </span>
        </div>
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="flex items-center gap-2 text-sm bg-background hover:bg-secondary rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
        >
          {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Faturalama
          <ExternalLink className="w-3 h-3 opacity-50" />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentPeriodEnd && (
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {status === "canceled" ? "Erişim bitiş tarihi" : "Sonraki fatura"}
              </p>
              <p className="text-sm text-foreground">{currentPeriodEnd}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kapsam</p>
            <p className="text-sm text-foreground">Tüm antrenman içerikleri</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HesabimPage() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const isLoaded = !session.isPending;
  const [, navigate] = useLocation();

  const firstName = user?.name?.split(" ")[0] ?? "";
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const checkoutSuccess = params.get("checkout") === "success";

  useEffect(() => {
    if (isLoaded && !user) navigate("/giris");
  }, [isLoaded, user]);

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/");
  }

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="bg-primary text-white py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">Hesabım</p>
          <h1 className="text-3xl font-bold">
            Hoş geldin{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-white/70 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pt-8 pb-24 space-y-6">
        {checkoutSuccess && (
          <div className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Ödeme başarılı! Üyeliğiniz aktif edildi. YBK ailesine hoş geldiniz.</span>
          </div>
        )}

        {user ? (
          <SubscriptionCard userId={user.id} />
        ) : (
          <div className="bg-secondary/30 rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">Hesabınızı görüntülemek için giriş yapın.</p>
            <Link href="/giris">
              <button className="bg-primary text-white font-bold text-sm py-2.5 px-8 rounded-full hover:bg-primary/90">
                Giriş Yap →
              </button>
            </Link>
          </div>
        )}

        <div className="bg-secondary/30 rounded-2xl p-6">
          <h2 className="font-bold text-foreground text-sm mb-4 uppercase tracking-wider">Hızlı Bağlantılar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/egitimler/online-coaching">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer py-2 border-b border-border/50">
                Online Coaching →
              </div>
            </Link>
            <Link href="/egitimler/triatlon">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer py-2 border-b border-border/50">
                Triatlon Programı →
              </div>
            </Link>
            <Link href="/etkinlikler">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer py-2 border-b border-border/50">
                Etkinlikler →
              </div>
            </Link>
            <Link href="/iletisim">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer py-2 border-b border-border/50">
                İletişim →
              </div>
            </Link>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
