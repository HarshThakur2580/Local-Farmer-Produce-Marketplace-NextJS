import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import Product from '@/models/Product';

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'Farmer not found.' }, { status: 404 });

  try {
    await dbConnect();
    const [farmer, products] = await Promise.all([
      Farmer.findById(id),
      Product.find({ farmerId: id, status: 'active' }).sort({ createdAt: -1 }),
    ]);
    if (!farmer) return NextResponse.json({ message: 'Farmer not found.' }, { status: 404 });
    return NextResponse.json({
      farmer: { ...farmer.toJSON(), totalProducts: products.length },
      products: products.map((product) => product.toJSON()),
    });
  } catch (error) {
    console.error('Farmer detail error:', error);
    return NextResponse.json({ message: 'Unable to load farmer.' }, { status: 500 });
  }
}
