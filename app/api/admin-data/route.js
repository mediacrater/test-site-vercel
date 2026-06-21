// app/api/admin-data/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../lib/adminSession';
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function GET() {
  // Re-verify the admin session on every data fetch — this route
  // returns real business data, so it must never trust the client.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = sessionToken ? verifySessionToken(sessionToken) : false;
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // ── Revenue summary ──────────────────────────────────────
    const { data: purchases, error: purchasesError } = await supabaseAdmin
      .from('purchases')
      .select('amount_paid, plan, created_at')
      .order('created_at', { ascending: false });
    if (purchasesError) throw purchasesError;
    const totalRevenue = (purchases || []).reduce((sum, p) => sum + (p.amount_paid || 0), 0);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const revenueLast30Days = (purchases || [])
      .filter(p => new Date(p.created_at) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0);
    // ── User / plan breakdown ────────────────────────────────
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('plan, scans_made, created_at');
    if (profilesError) throw profilesError;
    const totalUsers = (profiles || []).length;
    const planCounts: Record<string, number> = {};
    (profiles || []).forEach(p => {
      const plan = p.plan || 'free';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    const paidUsers = (profiles || []).filter(p => p.plan && p.plan !== 'free').length;
    // ── Recent scans feed ─────────────────────────────────────
    const { data: recentScans, error: scansError } = await supabaseAdmin
      .from('scans')
      .select('email, target_platform, scan_type, content_type, violations_found, analysis_duration_ms, created_at')
      .order('created_at', { ascending: false })
      .limit(25);
    if (scansError) throw scansError;
    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        last30Days: revenueLast30Days,
        totalPurchases: (purchases || []).length,
      },
      users: {
        total: totalUsers,
        paid: paidUsers,
        free: totalUsers - paidUsers,
        byPlan: planCounts,
      },
      recentScans: recentScans || [],
    });
  } catch (error: any) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
