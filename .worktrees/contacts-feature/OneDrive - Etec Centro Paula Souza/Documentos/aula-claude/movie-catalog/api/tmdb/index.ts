import { VercelRequest, VercelResponse } from '@vercel/node';
import kv from '@vercel/kv';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export default async (req: VercelRequest, res: VercelResponse) => {
  const { resource } = req.query as { resource?: string };
  if (!resource) {
    return res.status(400).json({ error: 'Missing resource parameter' });
  }
  const query = req.url?.split('?')[1] ?? '';
  const cacheKey = `tmdb:${resource}:${query}`;

  // Try cache first
  const cached = await kv.get(cacheKey);
  if (cached) {
    res.setHeader('x-cache', 'HIT');
    return res.status(200).json(cached);
  }

  const url = `https://api.themoviedb.org/3/${resource}?api_key=${TMDB_API_KEY}&${query}`;
  const upstream = await fetch(url);
  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: 'TMDB error' });
  }
  const data = await upstream.json();
  // Cache for 1 hour
  await kv.set(cacheKey, data, { ex: 3600 });
  res.setHeader('x-cache', 'MISS');
  return res.status(200).json(data);
};