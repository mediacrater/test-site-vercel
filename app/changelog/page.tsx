export const metadata = {
  title: 'Changelog – Mediacrater',
  description: 'See what is new in each version of Mediacrater.',
};

export default function ChangelogPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Changelog</h1>
      <p className="text-muted-foreground mb-12">What is new in Mediacrater.</p>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">Alpha 1.1.1</h2>
            <span className="text-xs text-muted-foreground">June 2026</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Added keyboard shortcuts (W / A / S / D) for panel navigation</li>
            <li>Fixed header disappearing when switching from History to Settings</li>
          </ul>
        </section>

        {/* Add new entries above this line */}
      </div>
    </main>
  );
}
