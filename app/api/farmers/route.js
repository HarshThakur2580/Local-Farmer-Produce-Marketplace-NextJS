import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/server/authSession';

export async function GET() {
  try {
    await dbConnect();
    const [farmers, counts] = await Promise.all([
      Farmer.find().sort({ createdAt: -1 }),
      Product.aggregate([
        { $match: { status: 'active', farmerId: { $ne: null } } },
        { $group: { _id: '$farmerId', count: { $sum: 1 } } },
      ]),
    ]);
    const countMap = new Map(counts.map((entry) => [entry._id.toString(), entry.count]));
    return NextResponse.json({
      farmers: farmers.map((farmer) => ({
        ...farmer.toJSON(),
        totalProducts: countMap.get(farmer._id.toString()) || 0,
      })),
    });
  } catch (error) {
    console.error('Farmer listing error:', error);
    return NextResponse.json({ message: 'Unable to load farmers.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Sign in to create a farm profile.' }, { status: 401 });
    if (user.accountType !== 'farmer') {
      return NextResponse.json({ message: 'Only farmer accounts can create farm profiles.' }, { status: 403 });
    }

    const body = await request.json();
    const farmName = typeof body.farmName === 'string' ? body.farmName.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
    const yearsActive = Number(body.yearsActive);
    const specialties = Array.isArray(body.specialties)
      ? body.specialties.map((value) => String(value).trim()).filter(Boolean).slice(0, 12)
      : String(body.specialties || '').split(',').map((value) => value.trim()).filter(Boolean).slice(0, 12);

    if (farmName.length < 2 || farmName.length > 120 || location.length < 2 || location.length > 160) {
      return NextResponse.json({ message: 'Farm name and location are required.' }, { status: 400 });
    }
    if (bio.length < 20 || bio.length > 1500) {
      return NextResponse.json({ message: 'Tell customers about the farm in at least 20 characters.' }, { status: 400 });
    }
    if (!Number.isInteger(yearsActive) || yearsActive < 0 || yearsActive > 100) {
      return NextResponse.json({ message: 'Years of experience must be between 0 and 100.' }, { status: 400 });
    }

    const existing = await Farmer.findOne({ owner: user._id });
    if (existing) {
      return NextResponse.json({ message: 'You already have a farm profile.', farmer: existing.toJSON() }, { status: 409 });
    }

    const farmer = await Farmer.create({
      owner: user._id,
      name: user.fullName,
      farmName,
      location,
      bio,
      email: user.email,
      phone: user.phone,
      specialties,
      yearsActive,
    });

    const linkedProducts = await Product.updateMany(
      { createdBy: user._id, farmerId: null },
      { $set: { farmerId: farmer._id, farmerName: farmer.farmName, location: farmer.location } }
    );

    return NextResponse.json({ farmer: { ...farmer.toJSON(), totalProducts: linkedProducts.modifiedCount } }, { status: 201 });
  } catch (error) {
    console.error('Farmer creation error:', error);
    if (error?.code === 11000) return NextResponse.json({ message: 'You already have a farm profile.' }, { status: 409 });
    if (error instanceof SyntaxError) return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
    return NextResponse.json({ message: 'Unable to create farm profile.' }, { status: 500 });
  }
}
