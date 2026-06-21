// lib/adminSession.ts
import crypto from 'crypto';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

export const SESSION_COOKIE_NAME = 'mc_admin_session';
export { SESSION_MAX_AGE_SECONDS };

export function signSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${email}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, expiresAtStr, signature] = decoded.split('.');
    const expiresAt = Number(expiresAtStr);

    if (!email || !expiresAt || !signature) return false;
    if (Date.now() > expiresAt) return false;

    const payload = `${email}.${expiresAtStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
