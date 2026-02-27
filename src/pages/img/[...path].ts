import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";

export const GET: APIRoute = async ({ params }) => {
  const filePath = params.path;

  if (!filePath) {
    return new Response("Not Found", { status: 404 });
  }

  // 解码 URL，处理中文路径和空格
  const decodedPath = decodeURIComponent(filePath);
  const fullPath = path.resolve("src/data/blog/img", decodedPath);
  const baseDir = path.resolve("src/data/blog/img");

  if (!fullPath.startsWith(baseDir)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new Response("Image Not Found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(fullPath);
    const extension = path.extname(fullPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".avif": "image/avif",
    };

    const contentType = mimeTypes[extension] || "application/octet-stream";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new Response("Error loading image", { status: 500 });
  }
};

export function getStaticPaths() {
  const baseDir = path.resolve("src/data/blog/img");

  if (!fs.existsSync(baseDir)) {
    return [];
  }

  function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        const relativePath = path.relative(baseDir, fullPath);
        arrayOfFiles.push(relativePath);
      }
    });

    return arrayOfFiles;
  }

  const allImages = getAllFiles(baseDir);

  return allImages.map((imagePath) => ({
    params: { path: imagePath },
  }));
}
