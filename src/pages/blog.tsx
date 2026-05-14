import { useQuery } from "@tanstack/react-query";
import { api, resolveImageUrl } from "@/lib/api";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { usePageSeo } from "@/hooks/usePageSeo";

export default function BlogPage() {
  usePageSeo("blog", "Blog | YBK — Triatlon Kulübü");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["ybk-blog-posts"],
    queryFn: api.blogPosts.list,
  });

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
            <span className="text-primary font-semibold text-sm block mb-3">Haberler & Makaleler</span>
            <h1 className="font-bold text-5xl text-foreground">Blog</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Antrenman ipuçları, yarış deneyimleri ve triatlon dünyasından güncel içerikler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-card animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className="h-52 overflow-hidden relative">
                      {post.coverImage ? (
                        <img
                          src={resolveImageUrl(post.coverImage) ?? ""}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-base text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4">
                        <span className="font-medium">{post.author}</span>
                        {post.publishedAt && (
                          <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card rounded-2xl">
              <p className="text-muted-foreground text-lg font-medium">Henüz blog yazısı yok.</p>
              <p className="text-muted-foreground text-sm mt-2">Yakında yeni içeriklerle karşınızda olacağız.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
