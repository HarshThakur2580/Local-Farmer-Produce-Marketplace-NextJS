import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { attachSessionCookie, createUserSession, serializeUser } from '@/lib/server/authSession';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ message: 'Request body must be a JSON object.' }, { status: 400 });
    }

    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      normalizedEmail.length > 254 ||
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = await createUserSession(user._id);
    const response = NextResponse.json(
      {
        message: 'Signed in successfully!',
        user: serializeUser(user),
      },
      { status: 200 }
    );
    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Server error during sign in.' },
      { status: 500 }
    );
  }
}
