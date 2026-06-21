// app/dash-x9k2mfp7/page.tsx
// RENAME this folder to your real obscure slug before deploying.
// Never link to this route anywhere in the site's code, nav, or sitemap.

import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '../../lib/adminSession';
import LoginForm from './LoginForm';
import DashboardContent from './DashboardContent';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const isAuthenticated = sessionToken ? verifySessionToken(sessionToken) : false;

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardContent />;
}
