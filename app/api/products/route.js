import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Farmer from '@/models/Farmer';
import { getCurrentUser } from '@/lib/server/authSession';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    return NextResponse.json({ products: products.map((product) => product.toJSON()) });
  } catch (error) {
    console.error('Product listing error:', error);
    return NextResponse.json({ message: 'Unable to load products.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Sign in to add a product.' }, { status: 401 });
    if (user.accountType !== 'farmer') {
      return NextResponse.json({ message: 'Only farmer accounts can publish products.' }, { status: 403 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const unit = typeof body.unit === 'string' ? body.unit.trim() : '';
    const price = Number(body.price);
    const stock = Number(body.stock);

    if (name.length < 2 || name.length > 120 || description.length < 10 || description.length > 1000) {
      return NextResponse.json({ message: 'Enter a valid product name and a description of at least 10 characters.' }, { status: 400 });
    }
    if (!category || category.length > 80 || !unit || unit.length > 40) {
      return NextResponse.json({ message: 'Category and selling unit are required.' }, { status: 400 });
    }
    if (!Number.isFinite(price) || price <= 0 || price > 1_000_000 || !Number.isInteger(stock) || stock < 0 || stock > 1_000_000) {
      return NextResponse.json({ message: 'Enter a valid price and whole-number stock quantity.' }, { status: 400 });
    }

    const farmer = await Farmer.findOne({ owner: user._id });
    const product = await Product.create({
      createdBy: user._id,
      farmerId: farmer?._id || null,
      farmerName: farmer?.farmName || user.fullName,
      location: farmer?.location || user.location || '',
      name,
      description,
      category,
      unit,
      price,
      stock,
      isOrganic: body.isOrganic === true,
    });

    return NextResponse.json({ product: product.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    if (error instanceof SyntaxError) return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
    return NextResponse.json({ message: 'Unable to create product.' }, { status: 500 });
  }
}
