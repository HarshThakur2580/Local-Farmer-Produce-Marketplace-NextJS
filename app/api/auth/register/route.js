import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ message: 'Request body must be a JSON object.' }, { status: 400 });
    }

    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      accountType,
      farmName,
      location,
      agreeTerms,
    } = body;

    if (
      typeof fullName !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof password !== 'string'
    ) {
      return NextResponse.json(
        { message: 'Full name, email, phone number, and password are required.' },
        { status: 400 }
      );
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.replace(/[\s-]/g, '');
    const normalizedFarmName = typeof farmName === 'string' ? farmName.trim() : '';
    const normalizedLocation = typeof location === 'string' ? location.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedName.length < 3 || normalizedName.length > 100) {
      return NextResponse.json(
        { message: 'Full name must be between 3 and 100 characters.' },
        { status: 400 }
      );
    }

    if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { message: 'Enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 128 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { message: 'Password must be 8–128 characters and include uppercase, lowercase, and a number.' },
        { status: 400 }
      );
    }

    if (typeof confirmPassword !== 'string' || confirmPassword !== password) {
      return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
    }

    if (!['customer', 'farmer'].includes(accountType)) {
      return NextResponse.json({ message: 'Select a valid account type.' }, { status: 400 });
    }

    if (agreeTerms !== true) {
      return NextResponse.json(
        { message: 'You must agree to the Terms of Service and Privacy Policy.' },
        { status: 400 }
      );
    }

    if (accountType === 'farmer' && !normalizedFarmName) {
      return NextResponse.json(
        { message: 'Farm name is required for farmer accounts.' },
        { status: 400 }
      );
    }

    if (normalizedFarmName.length > 120 || normalizedLocation.length > 160) {
      return NextResponse.json(
        { message: 'Farm name or location is too long.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email address already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await User.create({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      accountType,
      farmName: normalizedFarmName,
      location: normalizedLocation,
    });

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          accountType: newUser.accountType,
          farmName: newUser.farmName,
          location: newUser.location,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);

    if (error?.code === 11000) {
      return NextResponse.json(
        { message: 'A user with this email address already exists.' },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
