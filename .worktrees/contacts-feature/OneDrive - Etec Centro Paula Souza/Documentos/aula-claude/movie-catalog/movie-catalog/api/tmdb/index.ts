import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const KV_TTL_SECONDS = 3600; // 1 hour cache

export default async (req: VercelRequest, res: VercelResponse) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const tmdbPath = url.pathname.replace(/^\/api\/tmdb/, '');
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'TMDB_API_KEY not configured' });
    return;
  }

  const cacheKey = `tmdb:${tmdbPath}?${url.searchParams.toString()}`;
  // @ts-ignore – Vercel KV is provided globally as `kv`
  const cached = await kv.get(cacheKey);
  if (cached) {
    res.setHeader('x-cache', 'HIT');
    res.json(JSON.parse(cached));
    return;
  }

  const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}?api_key=${apiKey}&${url.searchParams.toString()}`;
  const tmdbRes = await fetch(tmdbUrl);
  const data = await tmdbRes.json();

  // @ts-ignore – store in KV with TTL
  await kv.set(cacheKey, JSON.stringify(data), { ex: KV_TTL_SECONDS });
  res.setHeader('x-cache', 'MISS');
  res.json(data);
};
