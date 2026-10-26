//app/chrome-extension-privacy/page.tsx
import type { Metadata } from 'next'
import { PolicyShell } from '@/components/legal/policy-shell'

export const metadata: Metadata = {
  title: 'Chrome Extension Privacy Policy | Mediacrater',
  description:
    'How the Mediacrater Chrome extension handles account data, Facebook Ads Library images and videos, local storage, downloads, and optional policy scans.',
  alternates: { canonical: '/chrome-extension-privacy' },
  robots: { index: true, follow: true },
}

export default function ExtensionPrivacyPolicy() {
  return (
    <PolicyShell title="Chrome Extension Privacy Policy" updated="Effective date: September 30, 2026">
    <section>
      <h2>Who We Are</h2>
      <p>
        Mediacrater provides a Chrome extension that lets users select, preview, download,
        organize, and optionally scan image and video advertisements found in the Facebook Ads Library.
        We are operated as Mediacrater and can be reached at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
      <p>
        This policy applies specifically to the Mediacrater Chrome extension. Our web app is
        also governed by the main Mediacrater{' '}
        <a href="/privacy">
          Privacy Policy
        </a>.
      </p>
    </section>

    <section>
      <h2>What Data the Extension Handles</h2>
      <p>
        The extension handles downloaded video data and created libraries. We at mediacrater do not see what you're doing on the extension.
      </p>

      <h3>Account and authentication data</h3>
      <ul>
        <li>
          <strong>The extension does not collect account or authentication data</strong>: It is a free to use, standalone extension that runs in your browser.
        </li>
      </ul>

      <h3>Facebook Ads Library content</h3>
      <ul>
          <li>
            <strong>Visible creative information</strong> — when you activate selection mode on a
            Facebook Ads Library page, the extension examines visible image and video elements so
            you can select a specific advertisement. It may access an image source URL, video
            source URL, video poster URL, the visible numeric Facebook Library ID, and the
            corresponding public Ads Library details URL made available to your browser by Facebook.
          </li>
          <li>
            <strong>Selected-creative records</strong> — the creative type, source URL, optional
            poster URL, Facebook Library ID and details URL when available, creative position,
            selection time, URL refresh time, and a randomly generated local record ID are stored in Chrome extension
            local storage so your selections remain available in the side panel until you remove
            or clear them.
          </li>
          <li>
            <strong>Page access limitations</strong> — the selector operates only on Facebook Ads
            Library pages. The extension does not read Facebook messages, account credentials,
            private posts, or general browsing history.
          </li>
        </ul>

      <h3>Downloads and previews</h3>
      <ul>
          <li>
            <strong>Image and video downloads</strong> — when you click Download, the selected
            source URL is passed to Chrome's download manager and the file is saved to your device.
            For a paid batch download, the extension fetches the selected files in your browser and
            creates a local ZIP containing separate Images and Videos folders. Mediacrater does not
            receive or retain an ordinary download merely because you downloaded it.
          </li>
          <li>
            <strong>Creative previews</strong> — previews load the selected image or video from its
            source URL directly into the extension interface. Previewing does not upload the file
            to Mediacrater.
          </li>
          <li>
            <strong>Ad details and URL refresh</strong> — when you choose Ad details or Refresh URL,
            the extension opens the public Facebook Ads Library page identified by the saved
            Facebook Library ID. A refresh examines the matching ad card after it loads and updates
            the locally stored temporary image or video source URL and poster URL. This operation
            communicates directly with Facebook in your browser and does not upload the creative
            to Mediacrater.
          </li>
        </ul>

      <h3>Local creative library</h3>
      <p>
        If your plan includes the local creative library, the following information is stored
        on your device using the browser's IndexedDB storage:
      </p>
      <ul>
        <li>The saved image or video file and its locally generated low-resolution thumbnail</li>
        <li>The source URL, source host, poster URL, Facebook Library ID and details URL when available, URL refresh time, file type, file size, and saved date</li>
        <li>The title, folder assignment, folder colour, tags, notes, and favourite status</li>
        <li>Your Mediacrater user ID, used locally to separate libraries between signed-in users</li>
      </ul>
      <p>
        Local-library files and organizational information are not uploaded to Mediacrater
        merely because you save or organize them. They remain on the device where they were
        saved unless you explicitly choose to scan a creative. Folder ZIP exports and bulk
        folder assignments are also performed locally in your browser.
      </p>

      <h3>Extension settings and technical data</h3>
      <ul>
        <li>
          <strong>Extension settings</strong>: your selector shortcut, theme preference,
          selector state, and selected-creative list are stored locally so the extension functions
          as configured.
        </li>
        <li>
          <strong>Browser identifier</strong>: the extension generates a random identifier and
          stores it locally. It is not used to monitor your activity on other websites.
        </li>
        <li>
          <strong>Security and request information</strong>: our infrastructure providers may
          process standard technical information such as IP address, User-Agent, timestamps,
          request headers, and security signals when you authenticate, manage billing, or run a
          scan. This information is used to deliver and protect the service.
        </li>
      </ul>

    <section>
      <h2>How We Use Extension Data</h2>
      <ul>
        <li>We don't, zero data is collected from the extension.</li>
      </ul>
    </section>

    <section>
      <h2>Data We Do Not Sell or Use for Advertising</h2>
      <p>
        We do not sell or rent extension user data. We do not use Facebook Ads Library content,
        downloaded images or videos, locally saved library content, authentication information, or scan
        content for targeted advertising, credit decisions, or purposes unrelated to the
        extension's disclosed features.
      </p>
    </section>

    <section>
      <h2>Data Sharing and Third-Party Services</h2>
      <p>
        We disclose data only to the service providers needed to deliver the requested feature,
        protect the service, process payments, or comply with law.
      </p>
      <ul>
        <li>
          <strong>Supabase</strong>: authentication, account information, plan entitlements,
          extension-version records, scan records, and related database services.
        </li>
        <li>
          <strong>Stripe</strong>: checkout, subscription management, billing, and payment
          processing.
        </li>
        <li>
          <strong>Cloud and server infrastructure providers</strong>: hosting and processing
          account, queue, scan, and security requests.
        </li>
        <li>
          <strong>Cloudflare</strong>: network security, bot protection, traffic management, and
          related security challenges. Cloudflare may process technical signals including IP
          address, User-Agent, and TLS or network information.
        </li>
        <li>
          <strong>AI model providers</strong>: processing selected image data, extracted video
          frames, optional audio, and scan instructions when you explicitly request a policy scan.
        </li>
        <li>
          <strong>Google Chrome</strong>: browser APIs used for local storage, IndexedDB,
          downloads, tab access, scripting, and the extension side panel.
        </li>
        <li>
          <strong>Meta and its content-delivery services</strong>: your browser communicates
          directly with Facebook and fbcdn.net to display, preview, refresh source links for,
          download, and reopen Ads Library images, videos, and ad details that are already
          available in your browser session.
        </li>
      </ul>
      <p>
        Each provider maintains its own privacy policy and security standards. We may also
        disclose information where required by law or where reasonably necessary to protect the
        rights, safety, and security of users, Mediacrater, or the public.
      </p>
    </section>

    <section>
      <h2>Chrome Extension Permissions</h2>
      <ul>
        <li>
          <strong>activeTab</strong>: verifies that the active page is the Facebook Ads Library
          and communicates with that page when you activate the selector.
        </li>
        <li>
          <strong>downloads</strong>: saves images, videos, and locally generated ZIP archives
          selected by you through Chrome's download manager.
        </li>
        <li>
          <strong>scripting</strong>: loads the selector script and styles into the active Ads
          Library page when required.
        </li>
        <li>
          <strong>storage and unlimitedStorage</strong>: stores authentication sessions,
          settings, selected-creative information, and paid local-library images, videos, and
          metadata on your device.
        </li>
        <li>
          <strong>sidePanel</strong>: displays the Mediacrater interface in Chrome's side panel.
        </li>
        <li>
          <strong>Host access</strong>: limited to Mediacrater services, Facebook Ads Library
          pages, and Facebook content-delivery domains needed to identify, reopen, preview,
          refresh source links for, download, and scan user-selected images and videos.
        </li>
      </ul>
    </section>

    <section>
      <h2>Data Retention and Deletion</h2>
      <ul>
        <li>
          <strong>Selected-creative records</strong>: remain in extension local storage until you
          remove them, clear the selection, clear extension data, or uninstall the extension.
        </li>
        <li>
          <strong>Local creative library</strong>: images, videos, thumbnails, folders, tags, notes, and
          related metadata remain in IndexedDB until you delete them, clear extension storage,
          or uninstall the extension. Signing out does not automatically erase the local
          library.
        </li>
        <li>
          <strong>Authentication tokens</strong>: retained locally until they expire, are
          invalidated, or you sign out.
        </li>
        <li>
          <strong>Account, entitlement, and extension-version information</strong>: retained
          while your account remains active and as needed to operate and secure the service.
        </li>
        <li>
          <strong>Scan metadata and results</strong>: retained with your account as needed to
          provide scan history, diagnostics, security, balance accounting, and support.
        </li>
        <li>
          <strong>Extracted scan media</strong>: used to complete the requested analysis and not
          intentionally retained by Mediacrater after processing is complete. AI and
          infrastructure providers may retain information according to their own policies and
          legal obligations.
        </li>
        <li>
          <strong>Legally required records</strong>: billing, transaction, fraud-prevention, and
          other records may be retained where required by tax, accounting, security, or other
          applicable law.
        </li>
      </ul>
      <p>
        You may request deletion of your Mediacrater account and associated server-side data by
        emailing us. Local extension data must be deleted through the extension where controls
        are available, by clearing the extension's site data in Chrome, or by uninstalling the
        extension.
      </p>
    </section>

    <section>
      <h2>Security</h2>
      <p>
        The Mediacrater Chrome extension works 100% in your browser with zero connection to 
        our servers. As a standalone extension, you are responsible for its usage on the Facebook
        Ads library and staying compliant with Meta's policies. Meta may have policies or systems 
        in place that prevent excessive scraping or abuse. Please use responsibly.
      </p>
    </section>

    <section>
      <h2>Your Choices and Rights</h2>
      <p>You may:</p>
      <ul>
        <li>Remove individual selected images or videos or clear the current selection</li>
        <li>Delete locally saved images, videos, folders, tags, notes, and favourites</li>
        <li>Choose whether to submit any selected creative for a policy scan</li>
        <li>Sign out to remove locally stored authentication tokens</li>
        <li>Clear extension storage or uninstall the extension to remove local extension data</li>
        <li>Request access to, correction of, or deletion of eligible server-side personal data</li>
        <li>Withdraw consent by discontinuing use of the extension and closing your account</li>
        <li>Lodge a complaint with your applicable privacy or data-protection authority</li>
      </ul>
      <p>
        To exercise a privacy right concerning server-side information, email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>

    <section>
      <h2>Chrome Web Store Limited Use</h2>
      <p>
        Mediacrater's use of information received from Google APIs will adhere to the Chrome Web
        Store User Data Policy, including the Limited Use requirements.
      </p>
    </section>

    <section>
      <h2>Changes to This Policy</h2>
      <p>
        If we materially change how the extension handles user data, we will update this policy's
        effective date and provide any additional notice or consent required by applicable law or
        Chrome Web Store policy. Continued use after an effective policy change constitutes
        acceptance where permitted by law.
      </p>
    </section>

    <section>
      <h2>Relationship With Meta</h2>
      <p>
        Mediacrater is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc.
        Facebook and Meta are trademarks of Meta Platforms, Inc. Users are responsible for
        ensuring they have permission to download, store, and use advertising content.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email us at{' '}
        <a href="mailto:hello.mediacrater@gmail.com">
          hello.mediacrater@gmail.com
        </a>.
      </p>
    </section>
    
    </PolicyShell>
  )
}
