import React, { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { authClient } from "@/lib/auth-client";
import { api, type SubscriptionPlan } from "@/lib/api";
import {
  CheckCircle2, AlertCircle, Loader2, ArrowDown,
  Zap, Target, Trophy, BookOpen, BarChart2, Calendar,
  Users, Video, Award, Star, Heart, Shield, Globe,
  Bike, Activity, Waves, Timer, TrendingUp, Rocket,
  Flag, Mountain, Dumbbell, Medal, Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Target, Trophy, BookOpen, BarChart2, Calendar,
  Users, Video, Award, Star, Heart, Shield, Globe,
  Bike, Activity, Waves, Timer, TrendingUp, Rocket,
  Flag, Mountain, Dumbbell, Medal, Clock, CheckCircle2,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Zap;
  return <Icon className={className} />;
}

type BillingPeriod = "yillik" | "aylik";

type LandingItem = { icon: string; title: string; description: string };
type LandingSection = {
  section: string;
  title: string;
  subtitle: string | null;
  items: LandingItem[];
};

function PricingDisplay({ plan, billing }: { plan: SubscriptionPlan; billing: BillingPeriod }) {
  const isAnnualOnly = plan.annualOnly === 1;

  if (billing === "aylik" && isAnnualOnly) {
    return <div className="text-sm text-muted-foreground italic">Bu plan yalnızca yıllık faturalandırılır</div>;
  }

  if (billing === "yillik") {
    const monthlyRate = plan.yearlyPrice;
    const annualTotal = plan.discountedYearlyPrice;
    const regularMonthly = plan.monthlyPrice;
    if (!monthlyRate) return null;
    return (
      <div>
        {regularMonthly && (
          <p className="text-xs text-muted-foreground line-through mb-1">₺{regularMonthly} / ay</p>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-foreground">₺{monthlyRate}</span>
          <span className="text-sm text-muted-foreground">/ ay</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {annualTotal ? `₺${annualTotal} yıllık faturalandırılır` : (plan.yearlySub ?? "yıllık faturalandırılır")}
        </p>
      </div>
    );
  }

  const original = plan.monthlyPrice;
  const discounted = plan.discountedMonthlyPrice;
  const displayPrice = discounted ?? original;
  if (!displayPrice) return null;
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">₺{displayPrice}</span>
        {discounted && original && (
          <span className="text-base text-muted-foreground line-through">₺{original}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">aylık</p>
    </div>
  );
}

export default function UyeOlPage() {
  const session = authClient.useSession();
  const isSignedIn = !!session.data?.user;

  const [billing, setBilling] = useState<BillingPeriod>("yillik");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.subscriptionPlans.list()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setPlansLoading(false));

    fetch("/api/ybk-landing")
      .then((r) => r.json())
      .then((data: LandingSection[]) => setSections(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    const pendingId = sessionStorage.getItem("ybk_selected_plan_id");
    const pendingBilling = sessionStorage.getItem("ybk_selected_billing") as BillingPeriod | null;
    if (pendingId) {
      sessionStorage.removeItem("ybk_selected_plan_id");
      sessionStorage.removeItem("ybk_selected_billing");
      const planId = Number(pendingId);
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        if (pendingBilling) setBilling(pendingBilling);
        handleCheckout(plan, pendingBilling ?? billing);
      }
    }
  }, [isSignedIn, plans]);

  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function getSection(key: string) {
    return sections.find((s) => s.section === key);
  }

  async function handleCheckout(plan: SubscriptionPlan, billingPeriod: BillingPeriod) {
    setCheckoutLoading(plan.id);
    setCheckoutError("");
    try {
      const isMonthly = billingPeriod === "aylik";
      const priceId = isMonthly ? plan.stripeMonthlyPriceId : plan.stripeYearlyPriceId;

      if (!priceId) {
        if (plan.annualOnly && billingPeriod === "yillik" && plan.stripeYearlyPriceId) {
          // handled below
        } else {
          setCheckoutError("Bu plan henüz aktif değil. Lütfen daha sonra tekrar deneyin.");
          setCheckoutLoading(null);
          return;
        }
      }

      const data = await api.stripe.checkout(priceId!);
      window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Ödeme başlatılamadı");
      setCheckoutLoading(null);
    }
  }

  function handleSelect(plan: SubscriptionPlan) {
    sessionStorage.setItem("ybk_selected_plan_id", String(plan.id));
    sessionStorage.setItem("ybk_selected_billing", billing);
    if (!isSignedIn) {
      window.location.href = `/giris?redirect=/uye-ol`;
      return;
    }
    handleCheckout(plan, billing);
  }

  function planIsAvailable(plan: SubscriptionPlan, billingPeriod: BillingPeriod) {
    if (billingPeriod === "aylik" && plan.annualOnly) return false;
    if (billingPeriod === "aylik") return !!plan.stripeMonthlyPriceId;
    return !!plan.stripeYearlyPriceId;
  }

  const avantajlar = getSection("avantajlar");
  const ozellikler = getSection("ozellikler");
  const gecis = getSection("gecis");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="bg-primary text-white py-24 px-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            YBK Üyelik
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Antrenmanını Bir<br className="hidden md:block" /> Üst Seviyeye Taşı.
          </h1>
          <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-4 leading-snug font-medium">
            Tek abonelik. Uzman koçluk. YBK topluluğuna tam erişim.
          </p>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Seviyenize ve hedeflerinize özel hazırlanmış antrenman programları, haftalık koç desteği ve
            binlerce motive sporcu ile yan yana antrenman yapma fırsatı. İster başlangıç ister elit — YBK üyeliği sizi hedefinize taşır.
          </p>
          <button
            onClick={scrollToPricing}
            className="inline-flex items-center gap-2.5 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 active:scale-[0.98] transition-all text-sm"
          >
            Planları Gör <ArrowDown className="w-4 h-4" />
          </button>
        </section>

        {/* ── Avantajlar (Bölüm 1) ─────────────────────────────────── */}
        {avantajlar && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {avantajlar.title}
                </h2>
                {avantajlar.subtitle && (
                  <p className="text-muted-foreground text-base max-w-xl mx-auto">
                    {avantajlar.subtitle}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {avantajlar.items.map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-7 bg-primary/[0.06] rounded-[24px]">
                    <div className="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-[16px] mb-5">
                      <DynamicIcon name={item.icon} className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Özellikler (Bölüm 2) ─────────────────────────────────── */}
        {ozellikler && (
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {ozellikler.title}
                </h2>
                {ozellikler.subtitle && (
                  <p className="text-muted-foreground text-base max-w-xl mx-auto">
                    {ozellikler.subtitle}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ozellikler.items.map((item, i) => (
                  <div key={i} className="bg-primary/[0.06] rounded-[24px] p-6 flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-primary/10 rounded-[12px]">
                      <DynamicIcon name={item.icon} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Geçiş (Bölüm 3) ──────────────────────────────────────── */}
        {gecis && (
          <section className="py-16 bg-primary text-white text-center px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{gecis.title}</h2>
              {gecis.subtitle && (
                <p className="text-white/70 text-base leading-relaxed">{gecis.subtitle}</p>
              )}
            </div>
          </section>
        )}

        {/* ── Fiyatlandırma ─────────────────────────────────────────── */}
        <section ref={pricingRef} id="planlar" className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">

            {/* Fatura periyodu seçici */}
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">Planınızı Seçin</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Tüm planlar esneklik ve iptal garantisi içerir.
              </p>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold bg-amber-400 text-amber-900 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                  Yıllıkta %30'a kadar indirim
                </span>
                <div
                  className="relative inline-flex bg-secondary rounded-full p-1"
                  style={{ width: 240 }}
                >
                  <div
                    className="absolute top-1 bottom-1 bg-primary rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: "calc(50% - 4px)",
                      left: billing === "yillik" ? "4px" : "calc(50%)",
                    }}
                  />
                  <button
                    onClick={() => setBilling("yillik")}
                    className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                      billing === "yillik" ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Yıllık
                  </button>
                  <button
                    onClick={() => setBilling("aylik")}
                    className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                      billing === "aylik" ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Aylık
                  </button>
                </div>
              </div>
            </div>

            {checkoutError && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 mb-6 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {checkoutError}
              </div>
            )}

            {plansLoading ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-24">
                <Loader2 className="w-5 h-5 animate-spin" /> Planlar yükleniyor…
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground text-sm">
                Üyelik planları yakında eklenecek.{" "}
                <Link href="/iletisim" className="text-primary font-semibold hover:underline">Bize ulaşın →</Link>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  plans.length === 1
                    ? "grid-cols-1 max-w-sm mx-auto"
                    : plans.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {plans.map((plan, pi) => {
                  const isAnnualOnly = plan.annualOnly === 1;
                  const isUnavailable = billing === "aylik" && isAnnualOnly;
                  const isAvailable = planIsAvailable(plan, billing);
                  const isDiscounted =
                    billing === "aylik"
                      ? !!plan.discountedMonthlyPrice
                      : !!plan.discountedYearlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`relative bg-white rounded-[24px] flex flex-col border transition-all ${
                        plan.badge
                          ? "border-primary shadow-lg shadow-primary/10"
                          : "border-border"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-3 py-1 whitespace-nowrap rounded-full">
                          {plan.badge}
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-xl">{plan.name}</h3>
                          {isDiscounted && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                              İndirim
                            </span>
                          )}
                        </div>
                        {plan.tagline && (
                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{plan.tagline}</p>
                        )}
                        {isUnavailable ? (
                          <div className="text-sm text-muted-foreground italic">Yalnızca yıllık</div>
                        ) : (
                          <PricingDisplay plan={plan} billing={billing} />
                        )}
                      </div>

                      <div className="p-6 flex-1 space-y-2">
                        {(plan.features ?? []).map((f) => (
                          <div key={f} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {f}
                          </div>
                        ))}
                        {(plan.limitations ?? []).length > 0 && (
                          <>
                            <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Kısıtlamalar
                            </div>
                            {(plan.limitations ?? []).map((l) => (
                              <div key={l} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
                                  <div className="w-3 h-px bg-muted-foreground/40" />
                                </div>
                                {l}
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      <div className="p-6 pt-0">
                        <button
                          onClick={() => !isUnavailable && isAvailable && handleSelect(plan)}
                          disabled={isUnavailable || !isAvailable || checkoutLoading === plan.id}
                          className={`w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                            isUnavailable || !isAvailable
                              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                              : plan.badge
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          {checkoutLoading === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                          {isUnavailable
                            ? "Yalnızca Yıllık"
                            : !isAvailable
                            ? "Yakında"
                            : (plan.cta ?? "Şimdi Üye Ol")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Giriş hatırlatması */}
            {!isSignedIn && plans.length > 0 && (
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Zaten üye misiniz?{" "}
                <Link href="/giris" className="text-primary font-semibold hover:underline">Giriş yapın →</Link>
              </p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
