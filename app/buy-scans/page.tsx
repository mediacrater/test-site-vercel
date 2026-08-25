'use client';

// app/buy-scans/page.tsx
//
// The web app's own checkout entry point — deliberately a different
// route/name from /buy-tokens (which stays as-is for the extension) so
// it's obvious at a glance, in analytics and in the URL bar, which
// surface a given checkout came from.
//
// Unlike /buy-tokens, this page is authenticated: identity comes from
// the signed-in Supabase session (same as the rest of the dashboard),
// never from a URL parameter. There's no "open this from the right
// place or the buttons stay disabled" state here — being signed in IS
// the gate, enforced server-side by create-checkout-webapp itself.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Check, Minus } from 'lucide-react';
import { supabase } from '@/lib/mediacrater/supabaseClient';

const PLANS = [
  {
    id: 'startup',
    name: 'Startup',
    price: '$10',
    period: '/mo',
    scans: 20,
    description: 'For solo dropshippers testing new creatives',
  },
  {
    id: 'established',
    name: 'Established',
    price: '$40',
    period: '/mo',
    scans: 100,
    description: 'For brands running consistent paid campaigns',
  },
  {
    id: 'scaler',
    name: 'Scaler',
    price: '$80',
    period: '/mo',
    scans: 250,
    description: 'For media buyers scaling across multiple offers',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$200',
    period: '/mo',
    scans: 1000,
    description: 'For agencies managing multiple client accounts',
  },
];

type CellValue = boolean | string;

const featureRows: { label: string; values: CellValue[] }[] = [
  { label: 'Video & image scanning', values: [true, true, true, true] },
  { label: 'All platforms supported', values: [true, true, true, true] },
  { label: 'Violation timestamps & fixes', values: [true, true, true, true] },
  { label: 'Scan type', values: ['Regular + Deep', 'Regular + Deep', 'Regular + Deep', 'Regular + Deep'] },
  { label: 'Monthly scans', values: ['20', '100', '250', '1000'] },
  { label: 'Priority support', values: [false, true, true, true] },
  { label: 'Dedicated account manager', values: [false, false, false, true] },
];

const FAQ_ITEMS = [
  {
    question: 'What counts as one scan?',
    answer:
      'One scan = one ad analyzed against one platform. A video or image submitted for Meta compliance check uses 1 scan regardless of length or file size.',
  },
  {
    question: 'What happens to my scans if I upgrade mid-cycle?',
    answer:
      "Your scan count resets immediately to your new plan's full allocation on the day you upgrade. Your billing cycle also resets from that day.",
  },
  {
    question: 'What happens if I downgrade or cancel?',
    answer:
      'You keep your current plan and scan count until the end of your billing cycle. After that, your scan count resets to the new plan (or the free plan, if cancelled).',
  },
  {
    question: 'Is my payment secure?',
    answer: 'Yes. All payments are processed by Stripe. We never store or see your card details.',
  },
];

function Cell({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 mx-auto text-emerald-500" strokeWidth={2.5} />
    ) : (
      <Minus className="w-4 h-4 mx-auto text-muted-foreground/30" strokeWidth={2} />
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left gap-4">
        <span className="font-medium text-sm">{question}</span>
        <span className="text-muted-foreground text-lg flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{answer}</p>}
    </div>
  );
}

export default function BuyScansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', session.user.id).single();
      setCurrentPlan(profile?.plan || 'free');
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSubscribe = async (planId: string) => {
    setError(null);
    setLoadingPlan(planId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-webapp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan: planId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to start checkout');
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoadingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-16 space-y-20">

        {/* ── Heading ── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Stop guessing. Start scanning.</h1>
          <p className="text-muted-foreground">
            Pick a plan based on how many ad campaigns you run per month.
            Cancel or change plans anytime.
          </p>
          {!fromExtension && !fromabuse_email && (
            <p className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 inline-block">
              Open this page from the Mediacrater extension to subscribe
            </p>
          )}
        </div>

        {/* ── Free tier callout ── */}
        <div className="max-w-2xl mx-auto text-center p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Not ready to commit?</span>{' '}
            The free plan includes 3 scans per month — no credit card required.
            Just install the extension and sign up.
          </p>
        </div>

        {/* ── Pricing table ── */}
        <div className="relative pt-5">

          {/* Most popular badge — mirrors column widths */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
            <div className="flex min-w-[600px]">
              <div className="w-[200px] shrink-0" />
              {PLANS.map((plan) => (
                <div key={plan.id} className="flex-1 flex justify-center">
                  {plan.popular && (
                    <span className="bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-wider">
                      Most popular
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">

                {/* Plan header row */}
                <thead>
                  <tr>
                    <th className="w-[200px] bg-card px-6 pt-8 pb-5 text-left align-bottom border-r border-border">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Features
                      </span>
                    </th>

                    {PLANS.map((plan) => (
                      <th
                        key={plan.id}
                        className={`px-4 pt-8 pb-5 text-center align-bottom border-r last:border-r-0 border-border ${
                          plan.highlight ? 'bg-primary' : 'bg-card'
                        }`}
                      >
                        <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                          plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {plan.name}
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 mb-1">
                          <span className={`text-2xl font-bold ${
                            plan.highlight ? 'text-primary-foreground' : 'text-foreground'
                          }`}>
                            {plan.price}
                          </span>
                          <span className={`text-xs ${
                            plan.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}>
                            {plan.period}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed mb-3 ${
                          plan.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'
                        }`}>
                          {plan.description}
                        </p>
                        <button
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={
                            loadingPlan !== null ||
                            (!fromExtension && !fromabuse_email) ||
                            plan.id === currentPlan
                          }
                          className={`block w-full text-center py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed ${
                            plan.id === currentPlan
                              ? 'bg-muted text-muted-foreground border border-border cursor-not-allowed'
                              : plan.highlight
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20'
                          }`}
                        >
                          {plan.id === currentPlan
                            ? 'Current Plan'
                            : loadingPlan === plan.id
                            ? 'Redirecting…'
                            : `Get ${plan.name}`}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Feature rows */}
                <tbody>
                  {featureRows.map((row, rowIdx) => (
                    <tr
                      key={row.label}
                      className={rowIdx % 2 === 0 ? 'bg-card' : 'bg-secondary/40'}
                    >
                      <td className="px-6 py-4 border-r border-border">
                        <span className="text-sm text-foreground/80 font-medium">{row.label}</span>
                      </td>
                      {PLANS.map((plan, planIdx) => (
                        <td
                          key={plan.id}
                          className={`px-4 py-4 text-center border-r last:border-r-0 border-border ${
                            plan.highlight ? 'bg-primary/5' : ''
                          }`}
                        >
                          <Cell value={row.values[planIdx]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* ── Trust line ── */}
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure checkout via Stripe
          <span className="text-border">·</span>
          Cancel anytime
          <span className="text-border">·</span>
          No hidden fees
          <span className="text-border">·</span>
          Downgrade or upgrade at any time
        </p>

        {/* ── Validation strip ── */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[80px] bg-border" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Validated before we built it
            </p>
            <div className="h-px flex-1 max-w-[80px] bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VALIDATION_SCREENSHOTS.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="overflow-hidden bg-[#1a1a2e]">
                  <img
                    src={item.src}
                    alt={`Validation message from ${item.name}`}
                    className="w-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="px-4 py-3 border-t border-border flex-1 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    {item.quote}
                  </p>
                  <div className="mt-auto pt-2 flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full bg-accent shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-tight">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Real feedback from Facebook advertising communities — collected before building
          </p>
        </div>

        {/* ── What every scan includes ── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">What every scan includes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Violation detection', desc: 'Flags specific policy violations with timestamps' },
              { title: 'Severity rating', desc: 'Low, medium, or high risk for each violation' },
              { title: 'Fix recommendations', desc: 'Concrete suggestions to resolve each flag' },
              { title: 'Editing workarounds', desc: 'Practical edits like cropping, blurring, or reframing' },
              { title: 'All major platforms', desc: 'Meta, TikTok, YouTube, Pinterest, X' },
              { title: 'Video and image support', desc: 'MP4, MOV, WebM, PNG, JPG, GIF' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
          <div className="mt-4">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
