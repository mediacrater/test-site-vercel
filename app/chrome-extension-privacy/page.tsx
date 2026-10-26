import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Chrome Extension Privacy Policy | Mediacrater',
  description:
    'How the Mediacrater Chrome extension handles local storage, Facebook Ads Library content, and user privacy.',
  alternates: { canonical: '/chrome-extension-privacy' },
  robots: { index: true, follow: true },
}

export default function ExtensionPrivacyPolicy() {
  return (
    <PolicyShell title="Chrome Extension Privacy Policy" updated="Effective date: September 30, 2026">
      <section>
        <h2>Who We Are</h2>
        <p>
          Mediacrater provides a free, serverless Chrome extension that helps users navigate, select,
          preview, download, and locally organize image and video advertisements from the Facebook Ads Library.
          We can be reached at{' '}
          <a href="mailto:hello.mediacrater@gmail.com">
            hello.mediacrater@gmail.com
          </a>.
        </p>
        <p>
          This policy applies specifically to the Mediacrater Chrome extension. Our main web platform is
          governed by the standard Mediacrater{' '}
          <a href="/privacy">
            Privacy Policy
          </a>.
        </p>
      </section>

      <section>
        <h2>Data Storage and Processing</h2>
        <p>
          The Mediacrater Chrome extension operates entirely within your web browser. We do not collect,
          transmit, or store your data on external servers.
        </p>

        <h3>Local Storage & IndexedDB</h3>
        <ul>
          <li>
            <strong>Selected Creatives & Settings</strong>: Your selection history, UI settings, active tab state,
            and extension options are saved locally using Chrome&apos;s <code>chrome.storage.local</code> API.
          </li>
          <li>
            <strong>Local Creative Library</strong>: If you save creatives or organize them into folders, the source URLs,
            downloaded files, thumbnails, tags, notes, and metadata are stored directly on your device using IndexedDB.
          </li>
        </ul>

        <h3>Facebook Ads Library Content</h3>
        <ul>
          <li>
            <strong>Visible Page Data</strong>: When activated, the extension reads visible image and video source URLs,
            poster URLs, and Facebook Library IDs on Facebook Ads Library pages to allow easy previews, selection, and direct downloads.
          </li>
          <li>
            <strong>Scope</strong>: The extension functions solely on Facebook Ads Library pages. It does not access your personal Facebook account data, private messages, posts, or browsing activity on other websites.
          </li>
        </ul>

        <h3>Downloads & File Handling</h3>
        <p>
          File downloads and folder ZIP exports are handled locally in your browser through Chrome&apos;s download manager
          and browser memory. Downloads are saved directly to your device and are never routed through or stored on Mediacrater servers.
        </p>
      </section>

      <section>
        <h2>Data We Do Not Collect or Sell</h2>
        <p>
          Because our extension operates serverlessly, we do not track, collect, sell, or rent your personal information,
          browsing history, or saved creative library. We do not use your data for advertising, profiling, or tracking.
        </p>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <ul>
          <li>
            <strong>Meta Content Delivery Network (fbcdn.net)</strong>: Your browser requests images and video content directly from Meta&apos;s official content delivery network to render previews and process downloads.
          </li>
          <li>
            <strong>Google Chrome APIs</strong>: Browser APIs are used locally to manage side panels, storage, script injection on Facebook Ads Library pages, and file downloads.
          </li>
        </ul>
      </section>

      <section>
        <h2>Chrome Extension Permissions</h2>
        <ul>
          <li>
            <strong>activeTab & scripting</strong>: Used to detect Facebook Ads Library pages and load the selector tool when activated.
          </li>
          <li>
            <strong>downloads</strong>: Enables saving images, videos, and generated ZIP archives directly to your computer.
          </li>
          <li>
            <strong>storage & unlimitedStorage</strong>: Allows storing your settings, selections, and local library files on your device.
          </li>
          <li>
            <strong>sidePanel</strong>: Renders the extension interface within Chrome&apos;s side panel.
          </li>
        </ul>
      </section>

      <section>
        <h2>Data Control and Deletion</h2>
        <p>
          All data stored by the extension resides on your device. You can clear your saved selection history, local creative library,
          and extension settings at any time by clearing your browser site data or uninstalling the extension.
        </p>
      </section>

      <section>
        <h2>Chrome Web Store Limited Use Compliance</h2>
        <p>
          Mediacrater&apos;s use and transfer of information received from Google APIs strictly adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.
        </p>
      </section>

      <section>
        <h2>Relationship With Meta</h2>
        <p>
          Mediacrater is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. Facebook and Meta are trademarks of Meta Platforms, Inc. Users are responsible for ensuring compliance with Meta&apos;s terms and policies when using the Facebook Ads Library.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us at{' '}
          <a href="mailto:hello.mediacrater@gmail.com">
            hello.mediacrater@gmail.com
          </a>.
        </p>
      </section>
    </PolicyShell>
  )
}
