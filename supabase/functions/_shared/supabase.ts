import { createClient } from 'npm:@supabase/supabase-js@2.112.2';

function requiredEnvironment(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing Edge Function environment variable: ${name}`);
  return value;
}

export function createAdminClient() {
  return createClient(
    requiredEnvironment('SUPABASE_URL'),
    requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function createPublicClient(requestKey?: string) {
  const key = requestKey || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
  if (!key) throw new Error('Missing Supabase publishable key.');
  return createClient(
    requiredEnvironment('SUPABASE_URL'),
    key,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
