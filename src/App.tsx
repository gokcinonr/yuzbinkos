import React, { Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

// Public pages
const HomePage = React.lazy(() => import("@/pages/home"));
const BlogPage = React.lazy(() => import("@/pages/blog"));
const BlogPostPage = React.lazy(() => import("@/pages/blog-post"));
const ProgramPage = React.lazy(() => import("@/pages/program"));
const TeamPage = React.lazy(() => import("@/pages/team"));
const AboutPage = React.lazy(() => import("@/pages/about"));
const EtkinliklerPage = React.lazy(() => import("@/pages/etkinlikler"));
const IletisimPage = React.lazy(() => import("@/pages/iletisim"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

// Auth + subscription pages
const GirisPage = React.lazy(() => import("@/pages/giris"));
const KayitPage = React.lazy(() => import("@/pages/kayit"));
const UyeOlPage = React.lazy(() => import("@/pages/uye-ol"));
const HesabimPage = React.lazy(() => import("@/pages/hesabim"));


const Spinner = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {/* ── Public (with layout) ── */}
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/giris" component={GirisPage} />
              <Route path="/kayit" component={KayitPage} />
              <Route path="/uye-ol" component={UyeOlPage} />
              <Route path="/hesabim" component={HesabimPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/blog/:slug" component={BlogPostPage} />
              <Route path="/egitimler/:slug" component={ProgramPage} />
              <Route path="/ekip" component={TeamPage} />
              <Route path="/hakkimizda" component={AboutPage} />
              <Route path="/etkinlikler" component={EtkinliklerPage} />
              <Route path="/iletisim" component={IletisimPage} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
