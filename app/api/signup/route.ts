import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Anon client to sign the user up normally
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client to write IP (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Grab the real IP server-side
  const ip = (
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    ''
  ).split(',')[0].trim();

  // Sign up the user exactly as before
  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        browser_id: null,
        signup_source: 'website'
      }
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Write IP to profiles immediately — profile row exists thanks to your DB trigger
  const userId = data.user?.id;
  if (ip && userId) {
    await supabaseAdmin
      .from('profiles')
      .update({ ip_at_creation: ip })
      .eq('id', userId)
      .is('ip_at_creation', null);
  }

  return NextResponse.json({ success: true });
}
