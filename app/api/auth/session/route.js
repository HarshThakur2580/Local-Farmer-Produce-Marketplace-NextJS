import { NextResponse } from 'next/server';
import {
  deleteCurrentSession,
  getCurrentUser,
  serializeUser,
  SESSION_COOKIE,
} from '@/lib/server/authSession';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user ? serializeUser(user) : null });
  } catch (error) {
    console.error('Session lookup error:', error);
    return NextResponse.json({ message: 'Unable to read session.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteCurrentSession();
    const response = NextResponse.json({ message: 'Signed out successfully.' });
    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ message: 'Unable to sign out.' }, { status: 500 });
  }
}
