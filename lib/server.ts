import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server environment variables are missing.');
  return createClient(url, key, { auth: { persistSession: false } });
}

export function ai() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is missing.');
  return new OpenAI({ apiKey: key });
}

export function isAdmin(request: Request) {
  const expected = process.env.ADMIN_SECRET;
  return Boolean(expected && request.headers.get('x-admin-secret') === expected);
}

export function isCollector(request: Request) {
  const expected = process.env.CRON_SECRET;
  return Boolean(expected && request.headers.get('x-cron-secret') === expected);
}
