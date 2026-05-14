import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, resolveImageUrl, type YbkPageSeo } from "@/lib/api";

const SITE_NAME = "YBK — Yüzbin Koşu";
const SITE_URL = "https://ybk.com.tr";
const DEFAULT_OG_IMAGE = "/opengraph.jpg";

const FALLBACK_HEROES: Record<string, string> = {
  home: "https://picsum.photos/seed/ybk-hero/1920/1080",
  about: "https://picsum.photos/seed/ybk-about/1920/1080",
  blog: "https://picsum.photos/seed/ybk-blog/1920/1080",
  team: "https://picsum.photos/seed/ybk-team/1920/1080",
  trainings: "https://picsum.photos/seed/ybk-trainings/1920/1080",
};

function setMeta(selector: string, attrKey: string, attrVal: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrKey, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-schema="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-schema", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function usePageSeo(pageSlug: string, defaultTitle?: string, opts?: {
  description?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}) {
  const { data: seo } = useQuery<YbkPageSeo>({
    queryKey: ["ybk-seo", pageSlug],
    queryFn: () => api.seo.get(pageSlug),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const title = seo?.metaTitle || defaultTitle || SITE_NAME;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const description =
      seo?.metaDescription ||
      opts?.description ||
      "YBK — Türkiye'nin triatlon kulübü. Antrenman yap, yarış, sınırlarını zorla.";
    const canonical = window.location.origin + window.location.pathname;
    const ogImage = seo?.heroImageUrl
      ? seo.heroImageUrl
      : window.location.origin + DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      opts?.noindex ? "noindex,nofollow" : "index,follow"
    );

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    setLink("canonical", canonical);

    setJsonLd("organization", {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sport: "Triathlon",
      sameAs: [],
    });

    if (opts?.jsonLd) {
      setJsonLd("page", opts.jsonLd);
    }
  }, [seo, defaultTitle, opts?.description, opts?.noindex, opts?.jsonLd]);

  const heroImageUrl = resolveImageUrl(seo?.heroImageUrl) || FALLBACK_HEROES[pageSlug] || null;
  const heroImageAlt = seo?.heroImageAlt || "YBK hero görseli";

  return { seo, heroImageUrl, heroImageAlt };
}

export { SITE_NAME, SITE_URL };
