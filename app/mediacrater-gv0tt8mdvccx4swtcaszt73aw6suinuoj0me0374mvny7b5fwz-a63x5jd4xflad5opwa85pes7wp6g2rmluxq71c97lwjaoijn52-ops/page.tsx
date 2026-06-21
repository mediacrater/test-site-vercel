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
