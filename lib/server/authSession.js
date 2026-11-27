import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
import User from '@/models/User';

export const SESSION_COOKIE = 'farmfresh_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function serializeUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    farmName: user.farmName,
    location: user.location,
  };
}

export async function createUserSession(userId) {
  await dbConnect();
  const token = randomBytes(32).toString('hex');
  await Session.create({
    user: userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000),
  });
  return token;
}

export function attachSessionCookie(response, token) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  await dbConnect();
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  return User.findById(session.user);
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await dbConnect();
    await Session.deleteOne({ tokenHash: hashToken(token) });
  }
}
