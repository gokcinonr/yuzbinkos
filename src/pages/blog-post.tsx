import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, resolveImageUrl } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["ybk-blog-post", slug],
    queryFn: () => api.blogPosts.get(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-3xl text-foreground">Yazı bulunamadı</h1>
        <Link href="/blog" className="text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Blog'a dön
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col bg-background pb-24">
      {/* Hero */}
      {post.coverImage && (
        <div className="relative h-[50vh] min-h-[360px] mt-18">
          <img
            src={resolveImageUrl(post.coverImage) ?? ""}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 pt-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Tüm Yazılar
          </Link>

          {/* Category */}
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {post.author}
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-foreground/80 prose-p:leading-relaxed prose-img:rounded-xl prose-img:border prose-img:border-border max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-card hover:bg-muted border border-border text-foreground font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>
      </div>
    </article>
  );
}
