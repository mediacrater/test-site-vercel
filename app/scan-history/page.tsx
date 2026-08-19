'use client';

// app/scan-history/page.tsx
//
// Gated the same way the extension gates it (profiles.scan_history) —
// that flag already exists and is already correctly maintained by
// stripe-webhook, so this required zero backend changes for the gating
// itself. Thumbnails are new: each row's thumbnail_url is a private
// Storage path, resolved to a short-lived signed URL at render time
// (never a permanent public link — these are screenshots of real ad
// creatives).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { supabase } from '@/lib/mediacrater/supabaseClient';
import { getThumbnailSignedUrl } from '@/lib/mediacrater/thumbnails';

interface ScanRecord {
  id: string;
  created_at: string;
  target_platform: string;
  content_type: string;
  violations_found: number;
  status: string;
  origin: string;
  thumbnail_url: string | null;
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

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
        .select('scan_history, scans_remaining, plan')
        .eq('id', session.user.id)
        .single();

      setPlan(profile?.plan ?? null);
      setScansRemaining(profile?.scans_remaining ?? null);
      const access = Boolean(profile?.scan_history);
      setHasAccess(access);

      if (access) {
        const { data: scans } = await supabase
          .from('scans')
          .select('id, created_at, target_platform, content_type, violations_found, status, origin, thumbnail_url')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        setHistory(scans || []);

        // Resolve signed URLs for every row that has a thumbnail. Older
        // scans (before this feature existed) simply have no path here —
        // they render without a thumbnail, not as an error.
        const paths = (scans || []).filter((s) => s.thumbnail_url).map((s) => s.thumbnail_url as string);
        const uniquePaths = Array.from(new Set(paths));
        const resolved = await Promise.all(
          uniquePaths.map(async (path) => [path, await getThumbnailSignedUrl(path)] as const)
        );
        const map: Record<string, string> = {};
        resolved.forEach(([path, url]) => {
          if (url) map[path] = url;
        });
        setThumbnails(map);
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
    <AppShell userEmail={email} plan={plan} scansRemaining={scansRemaining}>
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
        <div className="space-y-2">
          {history.map((scan) => {
            const thumbUrl = scan.thumbnail_url ? thumbnails[scan.thumbnail_url] : null;
            return (
              <div
                key={scan.id}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-3"
              >
                <div className="w-14 h-14 rounded-lg bg-muted/30 border border-border overflow-hidden shrink-0 flex items-center justify-center">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground capitalize px-1 text-center">
                      {scan.content_type}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm capitalize">{scan.target_platform}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        scan.origin === 'extension'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {scan.origin || 'webapp'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(scan.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}{' '}
                    · <span className="capitalize">{scan.content_type}</span>
                  </p>
                </div>

                <span
                  className={`shrink-0 text-sm font-semibold ${
                    scan.violations_found > 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {scan.violations_found > 0 ? `${scan.violations_found} violations` : 'Clean'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
