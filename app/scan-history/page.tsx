'use client';

// app/scan-history/page.tsx
//
// Pulled out of the dashboard per the plan — and gated the same way the
// extension gates it (profiles.scan_history). That flag already exists
// and is already correctly flipped true/false by stripe-webhook on
// upgrade/downgrade — nothing in the web app has ever actually read it
// until now, so this required zero backend changes.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { supabase } from '@/lib/mediacrater/supabaseClient';

interface ScanRecord {
  id: string;
  created_at: string;
  target_platform: string;
  content_type: string;
  violations_found: number;
  status: string;
  origin: string;
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      setEmail(session.user.email ?? null);

      const { data: profile } = await supabase
        .from('profiles')
        .select('scan_history, scans_remaining')
        .eq('id', session.user.id)
        .single();

      setScansRemaining(profile?.scans_remaining ?? null);
      const access = Boolean(profile?.scan_history);
      setHasAccess(access);

      if (access) {
        const { data: scans } = await supabase
          .from('scans')
          .select('id, created_at, target_platform, content_type, violations_found, status, origin')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        setHistory(scans || []);
      }

      setLoading(false);
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <AppShell userEmail={email}>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </AppShell>
    );
  }

  return (
    <AppShell userEmail={email} scansRemaining={scansRemaining}>
      <h1 className="text-2xl font-bold mb-6">Scan History</h1>

      {!hasAccess ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center max-w-md mx-auto">
          <p className="font-semibold mb-2">Scan History is a paid feature</p>
          <p className="text-sm text-muted-foreground mb-6">
            Upgrade to any paid plan to automatically save and browse every scan you run — full results, violation
            details, and timestamps, kept for as long as you're subscribed.
          </p>
          <Link
            href="/buy-scans"
            className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            View Plans
          </Link>
        </div>
      ) : history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No scans yet. Run your first scan from the dashboard.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6">
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
                {history.map((scan) => (
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
        </div>
      )}
    </AppShell>
  );
}
