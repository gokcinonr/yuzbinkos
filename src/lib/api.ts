const API_BASE = (import.meta.env.VITE_API_URL ?? "https://gaendurance.com") + "/api";
const ASSET_BASE = import.meta.env.VITE_API_URL ?? "https://gaendurance.com";

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) return url;
  return ASSET_BASE + url;
}

function getAdminToken() {
  return localStorage.getItem("admin_token") ?? "";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function adminRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type YbkBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string | null;
  sourceBlogPostId: number | null;
  autoTranslated: boolean;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type YbkTeam = {
  id: number;
  name: string;
  role: string;
  bio: string;
  speciality: string;
  photoUrl: string | null;
  sortOrder: number;
  active: boolean;
};

export type YbkTraining = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  level: string;
  duration: string;
  coverImage: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type YbkPage = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type YbkPageSeo = {
  id?: number;
  pageSlug: string;
  pageName: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  contentPill: string | null;
  contentTitle: string | null;
  contentBody: string | null;
  contentJson: string | null;
  updatedAt?: string | null;
};

export type YbkHomeCard = {
  id: number;
  sortOrder: number;
  imageUrl: string | null;
  title: string;
  body: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type YbkProgram = {
  id?: number | null;
  slug: string;
  title: string;
  heroImageUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string | null;
};

export type YbkProgramApplication = {
  id: number;
  programSlug: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string | null;
};

export type SubscriptionPlan = {
  id: number;
  site: string;
  name: string;
  tagline: string | null;
  badge: string | null;
  monthlyPrice: string | null;
  yearlyPrice: string | null;
  discountedMonthlyPrice: string | null;
  discountedYearlyPrice: string | null;
  yearlySub: string | null;
  annualOnly: number;
  features: string[] | null;
  limitations: string[] | null;
  cta: string | null;
  status: string;
  sortOrder: number;
  stripeTier: string | null;
  stripeMonthlyPriceId: string | null;
  stripeYearlyPriceId: string | null;
  pageSlug: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type YbkSubscriber = {
  id: number;
  email: string;
  source: string;
  gdprConsent: boolean;
  site: string;
  createdAt: string;
};

export type YbkEmailTemplate = {
  id: number;
  key: string;
  subject: string;
  bodyHtml: string;
  discountCode: string | null;
  updatedAt: string;
} | null;

export const api = {
  emailTemplates: {
    get: (key: string) =>
      adminRequest<YbkEmailTemplate>(`/email-template/${key}`, getAdminToken()),
    save: (key: string, data: { subject: string; bodyHtml: string }) =>
      adminRequest<YbkEmailTemplate>(`/email-template/${key}`, getAdminToken(), {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    sendTest: (key: string, data: { email: string; subject: string; bodyHtml: string }) =>
      adminRequest<{ ok: boolean }>(`/email-template/${key}/send-test`, getAdminToken(), {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  subscribers: {
    list: () => adminRequest<YbkSubscriber[]>("/ybk/subscribers", getAdminToken()),
    delete: (id: number) =>
      adminRequest<{ ok: boolean }>(`/ybk/subscribers/${id}`, getAdminToken(), { method: "DELETE" }),
    subscribe: (data: { email: string; firstName?: string; lastName?: string }) =>
      request<{ ok: boolean }>("/ybk/subscribers/subscribe", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  subscriptionPlans: {
    list: () => request<SubscriptionPlan[]>("/subscription-plans?site=ybk"),
    listAll: (token: string) => adminRequest<SubscriptionPlan[]>("/subscription-plans/all?site=ybk", token),
    create: (data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">) =>
      adminRequest<SubscriptionPlan>("/subscription-plans", getAdminToken(), {
        method: "POST",
        body: JSON.stringify({ ...data, site: "ybk" }),
      }),
    update: (id: number, data: Partial<Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">>) =>
      adminRequest<SubscriptionPlan>(`/subscription-plans/${id}`, getAdminToken(), {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      adminRequest<{ ok: boolean }>(`/subscription-plans/${id}`, getAdminToken(), { method: "DELETE" }),
    validatePrice: (priceId: string) =>
      request<{ found: boolean; active?: boolean; amount?: number; currency?: string; interval?: string; productName?: string }>(`/stripe/validate-price/${priceId}`),
  },
  stripe: {
    checkout: (priceId: string) =>
      request<{ url: string }>("/stripe/checkout", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ priceId, site: "ybk" }),
      } as RequestInit),
    portal: () =>
      request<{ url: string }>("/stripe/portal", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ site: "ybk" }),
      } as RequestInit),
    subscription: () =>
      fetch((import.meta.env.VITE_API_URL ?? "") + "/api/stripe/subscription", { credentials: "include", cache: "no-store" })
        .then((r) => r.json()),
  },
  blogPosts: {
    list: () => request<YbkBlogPost[]>("/ybk/blog-posts"),
    get: (slug: string) => request<YbkBlogPost>(`/ybk/blog-posts/${slug}`),
  },
  team: {
    list: () => request<YbkTeam[]>("/ybk/team"),
  },
  trainings: {
    list: () => request<YbkTraining[]>("/ybk/trainings"),
    get: (slug: string) => request<YbkTraining>(`/ybk/trainings/${slug}`),
  },
  pages: {
    get: (slug: string) => request<YbkPage>(`/ybk/pages/${slug}`),
  },
  homeCards: {
    list: () => request<YbkHomeCard[]>("/ybk/home-cards"),
    listAll: (token: string) => adminRequest<YbkHomeCard[]>("/ybk/home-cards/all", token),
    create: (data: { title: string; body: string; imageUrl?: string | null; sortOrder?: number }) =>
      adminRequest<YbkHomeCard>("/ybk/home-cards", getAdminToken(), {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<{ title: string; body: string; imageUrl: string | null; sortOrder: number; active: boolean }>) =>
      adminRequest<YbkHomeCard>(`/ybk/home-cards/${id}`, getAdminToken(), {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (id: number) =>
      adminRequest<{ ok: boolean }>(`/ybk/home-cards/${id}`, getAdminToken(), { method: "DELETE" }),
  },
  programs: {
    get: (slug: string) => request<YbkProgram>(`/ybk/programs/${slug}`),
    update: (
      slug: string,
      data: {
        heroImageUrl?: string | null;
        heroTitle?: string | null;
        heroSubtitle?: string | null;
        content?: string;
        metaTitle?: string | null;
        metaDescription?: string | null;
      },
    ) =>
      adminRequest<YbkProgram>(`/ybk/programs/${slug}`, getAdminToken(), {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    apply: (slug: string, data: { name: string; email: string; phone?: string; message?: string }) =>
      request<YbkProgramApplication>(`/ybk/programs/${slug}/apply`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    applications: (slug: string, token: string) =>
      adminRequest<YbkProgramApplication[]>(`/ybk/programs/${slug}/applications`, token),
  },
  seo: {
    get: (slug: string) => request<YbkPageSeo>(`/ybk/seo/${slug}`),
    listAll: (token: string) => adminRequest<YbkPageSeo[]>("/ybk/seo", token),
    update: (
      slug: string,
      data: {
        heroImageUrl?: string | null;
        heroImageAlt?: string | null;
        metaTitle?: string | null;
        metaDescription?: string | null;
      },
    ) =>
      adminRequest<YbkPageSeo>(`/ybk/seo/${slug}`, getAdminToken(), {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};

export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem("admin_token");

  const metaRes = await fetch(`${API_BASE}/upload/request-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!metaRes.ok) {
    const body = await metaRes.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Yükleme başarısız: ${metaRes.status}`);
  }
  const { uploadURL, objectPath } = await metaRes.json() as { uploadURL: string; objectPath: string };

  const uploadRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadRes.ok) {
    throw new Error(`Depolama yüklemesi başarısız: ${uploadRes.status}`);
  }

  return `${API_BASE}/storage${objectPath}`;
}
