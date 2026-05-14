import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Zap, Building2, Users,
  Laptop, Medal, PersonStanding, Bike, Waves, User, LogIn,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, resolveImageUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type NavItem = { href: string; icon: LucideIcon; label: string; description?: string };

const hakkimizdaItems: NavItem[] = [
  { href: "/hakkimizda", icon: Building2, label: "Kurumsal",   description: "Kulübümüz hakkında" },
  { href: "/ekip",       icon: Users,     label: "Eğitmenler", description: "Antrenör kadromuz" },
];

const egitimlerItems: NavItem[] = [
  { href: "/egitimler/online-coaching", icon: Laptop,         label: "Online Coaching", description: "Uzaktan bireysel koçluk" },
  { href: "/egitimler/triatlon",        icon: Medal,          label: "Triatlon",         description: "Triatlona hazırlık" },
  { href: "/egitimler/atletizm",        icon: PersonStanding, label: "Atletizm",         description: "Koşu ve atletizm" },
  { href: "/egitimler/bisiklet",        icon: Bike,           label: "Bisiklet",         description: "Yol ve dayanıklılık" },
  { href: "/egitimler/yuzme",           icon: Waves,          label: "Yüzme",            description: "Havuz ve açık su" },
];

const mainLinks = [
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/blog",        label: "Blog" },
  { href: "/iletisim",    label: "İletişim" },
];

function DesktopDropdown({
  id,
  label,
  items,
  isActive,
  wide = false,
  activeId,
  setActiveId,
}: {
  id: string;
  label: string;
  items: NavItem[];
  isActive: boolean;
  wide?: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = activeId === id;

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setActiveId(id)}
      onMouseLeave={() => setActiveId(null)}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors hover:text-primary focus:outline-none whitespace-nowrap ${
          isActive ? "text-primary" : "text-foreground/70"
        }`}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key={`${id}-dropdown`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute top-full left-0 mt-2 bg-popover rounded-xl overflow-hidden shadow-[0_16px_48px_-4px_rgba(0,0,0,0.18),0_4px_16px_-2px_rgba(0,0,0,0.10)] ${wide ? "w-60" : "w-52"}`}
          >
            {items.map(({ href, icon: Icon, label: itemLabel, description }) => (
              <Link
                key={href}
                href={href}
                className="flex items-start gap-2.5 px-4 py-3 hover:bg-primary/8 transition-colors group"
              >
                <Icon className="w-4 h-4 shrink-0 text-primary mt-0.5" strokeWidth={1.4} />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                    {itemLabel}
                  </p>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  )}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileHakkimizdaOpen, setMobileHakkimizdaOpen] = useState(false);
  const [mobileEgitimlerOpen, setMobileEgitimlerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const session = authClient.useSession();
  const user = session.data?.user;

  const { data: logoSeo } = useQuery({
    queryKey: ["ybk-seo", "logo"],
    queryFn: () => api.seo.get("logo"),
    staleTime: 1000 * 60 * 10,
  });
  const logoUrl = resolveImageUrl(logoSeo?.heroImageUrl);

  useEffect(() => {
    setMobileOpen(false);
    setMobileHakkimizdaOpen(false);
    setMobileEgitimlerOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(prev => {
        if (!prev && y > 60) return true;
        if (prev && y < 30) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHakkimizdaActive = location.startsWith("/hakkimizda") || location.startsWith("/ekip");
  const isEgitimlerActive  = location.startsWith("/egitimler");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-sm" : "bg-background/80"
      }`}
    >
      <div
        className="container mx-auto flex items-center justify-between transition-all duration-300"
        style={{
          height: scrolled ? "64px" : "80px",
          paddingLeft: "clamp(1rem, 4vw, 2rem)",
          paddingRight: "clamp(1rem, 4vw, 2rem)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="YBK"
              referrerPolicy="no-referrer"
              className="w-auto object-contain transition-all duration-300"
              style={{ height: scrolled ? "32px" : "40px" }}
            />
          ) : (
            <span
              className="font-bold tracking-tight text-foreground transition-all duration-300"
              style={{ fontSize: scrolled ? "1.25rem" : "1.5rem" }}
            >
              YBK
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center"
          style={{ gap: "clamp(0.25rem, 1vw, 0.5rem)", fontSize: "clamp(0.8rem, 1vw, 0.9375rem)" }}
        >
          {/* Hakkımızda dropdown */}
          <DesktopDropdown
            id="hakkimizda"
            label="Hakkımızda"
            items={hakkimizdaItems}
            isActive={isHakkimizdaActive}
            activeId={activeDropdown}
            setActiveId={setActiveDropdown}
          />

          {/* Eğitimler dropdown */}
          <DesktopDropdown
            id="egitimler"
            label="Eğitimler"
            items={egitimlerItems}
            isActive={isEgitimlerActive}
            wide
            activeId={activeDropdown}
            setActiveId={setActiveDropdown}
          />

          {/* Diğer linkler */}
          {mainLinks.map(({ href, label }) => {
            const isActive = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setActiveDropdown(null)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive ? "text-primary" : "text-foreground/70"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sağ: auth + CTA + hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <Link
              href="/hesabim"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:border-primary transition-colors whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              Hesabım
            </Link>
          ) : (
            <Link
              href="/giris"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:border-primary transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              Giriş Yap
            </Link>
          )}
          <Link
            href="/uye-ol"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            Üye Ol
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-foreground"
            aria-label="Menüyü aç/kapat"
          >
            <div className="w-5 h-[14px] flex flex-col justify-between">
              <span
                className="block h-px w-full bg-current rounded-full"
                style={{
                  transformOrigin: "center",
                  transition: "transform 0.25s ease",
                  transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-px w-full bg-current rounded-full"
                style={{ transition: "opacity 0.2s ease", opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-px w-full bg-current rounded-full"
                style={{
                  transformOrigin: "center",
                  transition: "transform 0.25s ease",
                  transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div
              className="fixed left-0 right-0 bottom-0 bg-black/30 md:hidden z-40"
              style={{ top: scrolled ? "64px" : "80px" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-full left-0 right-0 z-50 bg-background border-t border-border/60 shadow-xl overflow-y-auto md:hidden"
              style={{ maxHeight: "calc(100dvh - 80px)" }}
            >
              <nav className="py-2">
                {/* Hakkımızda accordion */}
                <button
                  onClick={() => setMobileHakkimizdaOpen((o) => !o)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors ${
                    isHakkimizdaActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  Hakkımızda
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileHakkimizdaOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileHakkimizdaOpen && (
                    <motion.div
                      key="hakkimizda-sub"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-muted/40 border-t border-b border-border/40 px-8 py-2">
                        {hakkimizdaItems.map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 py-2.5 text-sm text-foreground/80 hover:text-primary transition-colors"
                          >
                            <Icon className="w-4 h-4 text-primary" strokeWidth={1.4} />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Eğitimler accordion */}
                <button
                  onClick={() => setMobileEgitimlerOpen((o) => !o)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors ${
                    isEgitimlerActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  Eğitimler
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileEgitimlerOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileEgitimlerOpen && (
                    <motion.div
                      key="egitimler-sub"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-muted/40 border-t border-b border-border/40 px-8 py-2">
                        {egitimlerItems.map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 py-2.5 text-sm transition-colors ${
                              location === href ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                            }`}
                          >
                            <Icon className="w-4 h-4 text-primary" strokeWidth={1.25} />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Diğer linkler */}
                {mainLinks.map(({ href, label }) => {
                  const isActive = location === href || (href !== "/" && location.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-5 py-3.5 text-sm font-medium transition-colors ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}

                <div className="px-4 pt-3 pb-5 space-y-2">
                  <Link
                    href="/uye-ol"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Üye Ol
                  </Link>
                  {user ? (
                    <Link
                      href="/hesabim"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Hesabım
                    </Link>
                  ) : (
                    <Link
                      href="/giris"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Giriş Yap
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
