import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import AdminSession from '@/models/AdminSession';

export const ADMIN_SESSION_COOKIE = 'farmfresh_admin_session';
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function digest(value) {
  return createHash('sha256').update(value).digest();
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function safeEqual(left, right) {
  return timingSafeEqual(digest(left), digest(right));
}

export function validateAdminCredentials(email, password) {
  const configuredEmail = process.env.SUPER_ADMIN_EMAIL;
  const configuredPassword = process.env.SUPER_ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;
  return safeEqual(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase())
    && safeEqual(password, configuredPassword);
}

export async function createAdminSession(email) {
  await dbConnect();
  const token = randomBytes(32).toString('hex');
  await AdminSession.create({
    email: email.trim().toLowerCase(),
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + ADMIN_SESSION_SECONDS * 1000),
  });
  return token;
}

export function attachAdminCookie(response, token) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  await dbConnect();
  const session = await AdminSession.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;
  return { email: session.email, name: 'Super Administrator', role: 'super_admin' };
}

export async function deleteCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return;
  await dbConnect();
  await AdminSession.deleteOne({ tokenHash: hashToken(token) });
}
