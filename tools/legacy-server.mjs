/**
 * Serves the original static site so the migration can be diffed against it.
 *
 * The legacy documents reference `assets/...` relatively; those files live in
 * public/ now, so asset requests are mapped there rather than duplicated.
 *
 *   node tools/legacy-server.mjs [port]
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const PORT = Number(process.argv[2] ?? 4321);
const LEGACY_DIR = path.resolve('legacy');
const PUBLIC_DIR = path.resolve('public');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.webm': 'video/webm',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

const resolveFile = async (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const relative = clean === '/' ? '/index.html' : clean;
  const candidates = relative.startsWith('/assets/')
    ? [path.join(PUBLIC_DIR, relative)]
    : [path.join(LEGACY_DIR, relative), path.join(PUBLIC_DIR, relative)];

  for (const candidate of candidates) {
    try {
      const stats = await stat(candidate);
      if (stats.isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
};

createServer(async (request, response) => {
  const file = await resolveFile(request.url ?? '/');

  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`Legacy site: http://localhost:${PORT}`);
});
