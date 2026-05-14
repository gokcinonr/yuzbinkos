import { createServer } from "http";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.PORT) || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".xml": "application/xml",
};

function mime(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

createServer((req, res) => {
  const urlPath = (req.url ?? "/").split("?")[0];
  const filePath = path.join(distDir, urlPath);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const isImmutable = urlPath.startsWith("/assets/");
    res.writeHead(200, {
      "Content-Type": mime(filePath),
      "Cache-Control": isImmutable ? "public, max-age=31536000, immutable" : "no-cache",
    });
    createReadStream(filePath).pipe(res);
    return;
  }

  const indexPath = path.join(distDir, "index.html");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
  createReadStream(indexPath).pipe(res);
}).listen(PORT, "0.0.0.0", () => {
  console.log(`YBK serving on port ${PORT}`);
});
