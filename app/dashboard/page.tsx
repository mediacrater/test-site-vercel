'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { ScanWorkspace, type WorkspaceProfile } from '@/components/scan-workspace';
import { supabase } from '@/lib/mediacrater/supabaseClient';

interface UserProfile extends WorkspaceProfile {
  id: string;
  scans_made: number;
  account_status: string;
}

interface ScanRecord {
  id: string;
  created_at: string;
  target_platform: string;
  content_type: string;
  violations_found: number;
  status: string;
  origin: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      setUser(session.user);
      await fetchUserData(session.user.id);
      setLoading(false);
    };
    initAuth();

    // Listen for auth state changes (token expiration, sign-out in another
    // tab, or — since this is the same Supabase project as the extension —
    // this only reflects THIS tab's session; it does not sign this tab out
    // just because the extension's session changed. The two are independent
    // sessions against the same account, same as two browser tabs would be.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/signin');
      } else if (session) {
        setUser(session.user);
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!profileErr && profileData) {
        setProfile(profileData);
      }

      // NOTE: the real table (per schema) is `scans`, not `scan_logs`.
      // Every scan — from the extension AND this web app — writes here
      // via helpers.js's logScan(), so this table is already the single
      // shared source of truth for scan history across both clients.
      const { data: logsData, error: logsErr } = await supabase
        .from('scans')
        .select('id, created_at, target_platform, content_type, violations_found, status, origin')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (!logsErr && logsData) {
        setScanHistory(logsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Logged in as {user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="self-start md:self-auto px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
            <p className="text-2xl font-bold mt-2 capitalize">{profile?.plan || 'Free'}</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Scans Remaining</p>
            <p className="text-2xl font-bold mt-2 text-primary">{profile?.scans_remaining ?? 0}</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total Scans Performed</p>
            <p className="text-2xl font-bold mt-2">{profile?.scans_made ?? 0}</p>
          </div>
        </div>

        {/* Scan Workspace — video + image, same flow/config as the extension */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Run Ad Compliance Scan</h2>
          <ScanWorkspace profile={profile} onScanComplete={() => user && fetchUserData(user.id)} />
        </div>

        {/* Scan History Table */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Scan History</h2>
          {scanHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent scans found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Origin</th>
                    <th className="pb-3 font-medium">Violations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scanHistory.map((scan) => (
                    <tr key={scan.id}>
                      <td className="py-3">{new Date(scan.created_at).toLocaleDateString()}</td>
                      <td className="py-3 capitalize">{scan.target_platform}</td>
                      <td className="py-3 capitalize">{scan.content_type}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            scan.origin === 'extension'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}
                        >
                          {scan.origin || 'webapp'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={scan.violations_found > 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                          {scan.violations_found}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
