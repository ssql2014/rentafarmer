import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseInquiry, recommendPlan } from "./core.js";

const root = join(fileURLToPath(new URL("..", import.meta.url)), "public");
const port = Number(process.env.PORT || 4321);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/plan") {
      const body = await readJson(req);
      return sendJson(res, recommendPlan(body.text || ""));
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/farmers/")) {
      const body = await readJson(req);
      return sendJson(res, {
        accepted: true,
        farmerId: url.pathname.split("/")[3],
        receivedAt: new Date().toISOString(),
        job: body
      });
    }

    if (req.method === "POST" && url.pathname === "/api/parse") {
      const body = await readJson(req);
      return sendJson(res, parseInquiry(body.text || ""));
    }

    const filePath = safePath(url.pathname === "/" ? "/index.html" : url.pathname);
    const data = await readFile(filePath);
    res.writeHead(200, { "content-type": mime[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: error.message }));
  }
});

function safePath(pathname) {
  const requested = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(root, `.${requested}`);
  if (!filePath.startsWith(root)) {
    throw new Error("Invalid path");
  }
  return filePath;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, payload) {
  res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

server.listen(port, () => {
  console.log(`RentAFarmer running at http://localhost:${port}`);
});
