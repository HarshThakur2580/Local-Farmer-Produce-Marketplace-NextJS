import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Farmer from '@/models/Farmer';
import Product from '@/models/Product';
import AuditLog from '@/models/AuditLog';
import { verifyServerAdminAuth } from '@/lib/server/adminService';

function dateLabel(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

export async function GET() {
  const auth = await verifyServerAdminAuth();
  if (!auth.authorized) return NextResponse.json({ message: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const [users, farmerDocs, productDocs, auditDocs] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      Farmer.find().sort({ createdAt: -1 }).lean(),
      Product.find().sort({ createdAt: -1 }).lean(),
      AuditLog.find().sort({ createdAt: -1 }).limit(200),
    ]);

    const productsByFarmer = new Map();
    for (const product of productDocs) {
      if (!product.farmerId) continue;
      const key = product.farmerId.toString();
      productsByFarmer.set(key, (productsByFarmer.get(key) || 0) + 1);
    }

    const customers = users
      .filter((user) => user.accountType === 'customer')
      .map((user) => ({
        id: user._id.toString(),
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.location || 'Not provided',
        joinedDate: dateLabel(user.createdAt),
        ordersCount: 0,
        totalSpent: 0,
        status: 'Active',
      }));

    const farmers = farmerDocs.map((farmer) => ({
      id: farmer._id.toString(),
      name: farmer.name,
      farmName: farmer.farmName,
      email: farmer.email,
      phone: farmer.phone,
      location: farmer.location,
      bio: farmer.bio,
      specialties: farmer.specialties || [],
      yearsActive: farmer.yearsActive || 0,
      rating: farmer.rating || 0,
      totalProducts: productsByFarmer.get(farmer._id.toString()) || 0,
      totalRevenue: 0,
      verified: Boolean(farmer.isVerified),
      isVerified: Boolean(farmer.isVerified),
      verificationDocs: farmer.isVerified ? 'Verified in database' : 'Awaiting administrator verification',
      status: farmer.isVerified ? 'Approved' : 'Pending',
      createdAt: farmer.createdAt,
    }));

    const products = productDocs.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      farmerId: product.farmerId?.toString() || null,
      farmerName: product.farmerName,
      location: product.location,
      description: product.description,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      isOrganic: product.isOrganic,
      image: '',
      rating: product.rating || 0,
      reviewsCount: product.reviews || 0,
      status: product.status === 'active' ? 'Approved' : 'Suspended',
      createdAt: product.createdAt,
    }));

    const categoryMap = new Map();
    for (const product of products) {
      const existing = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, existing + 1);
    }
    const categories = Array.from(categoryMap, ([name, productsCount]) => ({
      id: `category-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: 'Derived from live MongoDB product listings.',
      productsCount,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    }));

    return NextResponse.json({
      customers,
      farmers,
      products,
      categories,
      orders: [],
      payments: [],
      reviews: [],
      notifications: [],
      auditLogs: auditDocs.map((log) => log.toJSON()),
    });
  } catch (error) {
    console.error('Admin data loading error:', error);
    return NextResponse.json({ message: 'Unable to load administrator data.' }, { status: 500 });
  }
}
