import { NextResponse } from 'next/server';
import {
  attachAdminCookie,
  createAdminSession,
  validateAdminCredentials,
} from '@/lib/server/adminSession';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json({ message: 'Invalid administrator credentials.' }, { status: 401 });
    }

    const token = await createAdminSession(email);
    const response = NextResponse.json({
      admin: { email: email.trim().toLowerCase(), name: 'Super Administrator', role: 'super_admin' },
    });
    attachAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'Unable to sign in as administrator.' }, { status: 500 });
  }
}
