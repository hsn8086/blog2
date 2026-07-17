import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const articleRelativePath = path.join(
  "2025",
  "04",
  "11",
  "从01bfs到dijkstra",
  "index.html",
);

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectHtmlFiles(entryPath);
      }
      return entry.name.endsWith(".html") ? [entryPath] : [];
    }),
  );
  return files.flat();
}

function count(html, pattern) {
  return html.match(pattern)?.length ?? 0;
}

function getJsonLd(html) {
  const match = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(match, "JSON-LD script is missing");
  return JSON.parse(match[1]);
}

test("every generated page has complete and unique SEO metadata", async () => {
  const htmlFiles = await collectHtmlFiles(distDirectory);
  const canonicalUrls = new Set();

  assert.ok(htmlFiles.length > 80, "expected all blog and tag pages to build");

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const relativePath = path.relative(distDirectory, filePath);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];

    assert.match(html, /<html lang="zh-CN">/, relativePath);
    assert.equal(count(html, /<title>/g), 1, relativePath);
    assert.equal(count(html, /<meta name="description"/g), 1, relativePath);
    assert.equal(count(html, /<link rel="canonical"/g), 1, relativePath);
    assert.match(html, /<meta property="og:title"/, relativePath);
    assert.match(html, /<meta property="og:description"/, relativePath);
    assert.match(html, /<meta property="og:url"/, relativePath);
    assert.match(html, /<meta property="og:image"/, relativePath);
    assert.match(html, /<meta name="twitter:card"/, relativePath);
    assert.equal(count(html, /<h1(?:\s|>)/g), 1, relativePath);
    assert.ok(canonical, relativePath);
    assert.ok(!canonicalUrls.has(canonical), `duplicate canonical: ${canonical}`);
    canonicalUrls.add(canonical);

    const structuredData = getJsonLd(html);
    assert.equal(structuredData["@context"], "https://schema.org", relativePath);
    assert.ok(Array.isArray(structuredData["@graph"]), relativePath);
  }
});

test("home page exposes site metadata without article-only scripts", async () => {
  const html = await readFile(path.join(distDirectory, "index.html"), "utf8");
  const structuredData = getJsonLd(html);
  const schemaTypes = structuredData["@graph"].map((item) => item["@type"]);

  assert.match(html, /<link rel="canonical" href="https:\/\/www\.zh314\.xyz\/">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.doesNotMatch(html, /giscus\.app/);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/katex/);
  assert.doesNotMatch(html, /astro-island/);
  assert.match(
    html,
    /<img src="\/img\/avatar\.png" alt="HSN8086 的头像" width="96" height="96"/,
  );
  assert.doesNotMatch(html, /style="display:\s*none"/);
  assert.ok(schemaTypes.includes("WebSite"));
  assert.ok(schemaTypes.includes("Blog"));
});

test("article page exposes semantic and social article metadata", async () => {
  const html = await readFile(
    path.join(distDirectory, articleRelativePath),
    "utf8",
  );
  const structuredData = getJsonLd(html);
  const article = structuredData["@graph"].find(
    (item) => item["@type"] === "BlogPosting",
  );

  assert.match(html, /<meta property="og:type" content="article">/);
  assert.match(html, /<meta property="article:published_time"/);
  assert.match(html, /<meta property="article:tag" content="Dijkstra">/);
  assert.match(html, /<article(?:\s|>)/);
  assert.match(html, /<time datetime="2025-04-11T18:15:00\.000Z">/);
  assert.match(html, /href="\/tags\/Dijkstra" rel="tag"/);
  assert.match(html, /giscus\.app/);
  assert.match(html, /cdn\.jsdelivr\.net\/npm\/katex/);
  assert.ok(article);
  assert.equal(article.headline, "从01BFS到Dijkstra");
  assert.equal(
    article.mainEntityOfPage,
    "https://www.zh314.xyz/2025/04/11/%E4%BB%8E01bfs%E5%88%B0dijkstra/",
  );
  assert.ok(article.keywords.includes("Dijkstra"));
});

test("post routes remain stable across local time zones", () => {
  assert.ok(existsSync(path.join(distDirectory, articleRelativePath)));
  assert.equal(
    existsSync(
      path.join(
        distDirectory,
        "2025",
        "04",
        "12",
        "从01bfs到dijkstra",
        "index.html",
      ),
    ),
    false,
  );
});

test("robots and sitemap advertise only indexable page routes", async () => {
  const [robots, sitemapIndex, sitemap] = await Promise.all([
    readFile(path.join(distDirectory, "robots.txt"), "utf8"),
    readFile(path.join(distDirectory, "sitemap-index.xml"), "utf8"),
    readFile(path.join(distDirectory, "sitemap-0.xml"), "utf8"),
  ]);

  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/www\.zh314\.xyz\/sitemap-index\.xml/);
  assert.match(sitemapIndex, /https:\/\/www\.zh314\.xyz\/sitemap-0\.xml/);
  assert.match(
    sitemap,
    /https:\/\/www\.zh314\.xyz\/2025\/04\/11\/%E4%BB%8E01bfs%E5%88%B0dijkstra\//,
  );
  assert.match(sitemap, /https:\/\/www\.zh314\.xyz\/tags\//);
  assert.doesNotMatch(sitemap, /\/img\//);
  assert.doesNotMatch(sitemap, /robots\.txt/);
});
