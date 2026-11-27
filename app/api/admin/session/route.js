import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  deleteCurrentAdminSession,
  getCurrentAdmin,
} from '@/lib/server/adminSession';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Admin session lookup error:', error);
    return NextResponse.json({ message: 'Unable to read administrator session.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteCurrentAdminSession();
    const response = NextResponse.json({ message: 'Administrator signed out.' });
    response.cookies.set(ADMIN_SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json({ message: 'Unable to sign out.' }, { status: 500 });
  }
}
