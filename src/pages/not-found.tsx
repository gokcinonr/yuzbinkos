import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="font-bold text-3xl text-foreground mb-3">Sayfa Bulunamadı</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Aradığın sayfa bulunamadı ya da taşınmış olabilir. Belki de rotadan saptın.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Anasayfaya Dön
        </Link>
      </motion.div>
    </div>
  );
}
