'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Header } from '@/components/header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
  id: string;
  plan: string;
  scans_remaining: number;
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

  // Scan execution state
  const [platform, setPlatform] = useState('facebook');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState('');

  useEffect(() => {
    // Session token retrieval from localStorage is handled automatically by Supabase client
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/signin');
        return;
      }

      setUser(session.user);
      await fetchUserData(session.user.id, session.access_token);
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes (token expiration, logout across tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/signin');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchUserData = async (userId: string, token: string) => {
    try {
      // Fetch Profile Data
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileErr && profileData) {
        setProfile(profileData);
      }

      // Fetch Recent Scans
      const { data: logsData, error: logsErr } = await supabase
        .from('scan_logs')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setScanResult(null);
    setScanError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !filePreview || !user) return;

    setScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Session expired. Please sign in again.');

      const response = await fetch(`${process.env.NEXT_PUBLIC_VPS_API_URL || ''}/scan-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'x-scan-origin': 'webapp'
        },
        body: JSON.stringify({
          imageData: filePreview,
          platform: platform
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Scan failed to complete');
      }

      setScanResult(data.result);
      // Refresh metrics and log table after successful scan
      await fetchUserData(user.id, session.access_token);

    } catch (err: any) {
      setScanError(err.message || 'An error occurred while scanning.');
    } finally {
      setScanning(false);
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
            <h1 className="text-3xl font-bold">Web App Dashboard</h1>
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

        {/* Core Workspace: Scanner & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Form */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Run Ad Compliance Scan</h2>
            
            <form onSubmit={handleRunScan} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Target Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="facebook">Meta (Facebook / Instagram)</option>
                  <option value="tiktok">TikTok</option>
                  <option value="google">Google Ads</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ad Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>

              {filePreview && (
                <div className="mt-4 border border-border rounded-lg p-2 max-h-64 flex justify-center bg-muted/20">
                  <img src={filePreview} alt="Preview" className="max-h-56 object-contain rounded" />
                </div>
              )}

              {scanError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-400">{scanError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={scanning || !selectedFile || (profile?.scans_remaining ?? 0) <= 0}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? 'Analyzing Ad Policy Compliance...' : 'Analyze Compliance'}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-4">Scan Report</h2>

            {!scanResult && !scanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-muted/10">
                <p className="text-muted-foreground text-sm">
                  Select a platform and upload an ad creative to run a live compliance check.
                </p>
              </div>
            )}

            {scanning && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-foreground">Checking compliance against {platform} policies...</p>
              </div>
            )}

            {scanResult && (
              <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-semibold">Status: 
                    <span className={`ml-2 ${scanResult.violations?.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {scanResult.violations?.length > 0 ? `${scanResult.violations.length} Potential Violation(s)` : 'Compliant'}
                    </span>
                  </p>
                </div>

                {scanResult.violations && scanResult.violations.length > 0 ? (
                  <div className="space-y-3">
                    {scanResult.violations.map((violation: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
                        <p className="font-semibold text-sm text-red-800 dark:text-red-400">{violation.rule || 'Policy Issue'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{violation.reason || violation.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20">
                    <p className="text-sm text-green-800 dark:text-green-400">No rule violations were flagged for this ad design.</p>
                  </div>
                )}
              </div>
            )}
          </div>
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
                        <span className={`px-2 py-0.5 text-xs rounded ${scan.origin === 'extension' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
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
