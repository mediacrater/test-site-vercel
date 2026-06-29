import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password, acceptedTerms } = await req.json();

  if (!acceptedTerms) {
    return NextResponse.json({ error: 'Terms of service must be accepted' }, { status: 400 });
  }

  // Block disposable/temp emails
  // Block disposable/temp emails using Kickbox's free API (no key required)
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const kickboxRes = await fetch(`https://open.kickbox.com/v1/disposable/${domain}`);
  const kickboxData = await kickboxRes.json();
  if (kickboxData.disposable === true) {
    return NextResponse.json({ error: 'Temporary or disposable email addresses are not allowed. Please use a permanent email.' }, { status: 400 });
  }

  const ip = (
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    ''
  ).split(',')[0].trim();

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

  const userId = data.user?.id;
  if (userId) {
    await supabaseAdmin
      .from('profiles')
      .update({
        ip_at_creation: ip || null,
        accept_terms_and_privacy: new Date().toISOString()
      })
      .eq('id', userId)
      .is('ip_at_creation', null);
  }

  return NextResponse.json({ success: true });
}
