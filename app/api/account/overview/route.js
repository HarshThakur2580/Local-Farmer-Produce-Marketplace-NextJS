import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farmer from '@/models/Farmer';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/server/authSession';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Sign in required.' }, { status: 401 });

    await dbConnect();
    if (user.accountType !== 'farmer') {
      return NextResponse.json({ accountType: user.accountType });
    }

    const [farmer, products] = await Promise.all([
      Farmer.findOne({ owner: user._id }),
      Product.find({ createdBy: user._id }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      accountType: 'farmer',
      farmer: farmer ? farmer.toJSON() : null,
      products: products.slice(0, 4).map((product) => product.toJSON()),
      stats: {
        products: products.length,
        activeProducts: products.filter((product) => product.status === 'active').length,
        totalStock: products.reduce((sum, product) => sum + product.stock, 0),
      },
    });
  } catch (error) {
    console.error('Account overview error:', error);
    return NextResponse.json({ message: 'Unable to load account overview.' }, { status: 500 });
  }
}
