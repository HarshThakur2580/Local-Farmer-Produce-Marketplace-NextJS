import { NextResponse } from 'next/server';
import { verifyServerAdminAuth } from '@/lib/server/adminService';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export async function GET() {
  const auth = await verifyServerAdminAuth();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: 401 });

  await dbConnect();
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
  return NextResponse.json({ success: true, logs: logs.map((log) => log.toJSON()), count: logs.length });
}

export async function POST(request) {
  const auth = await verifyServerAdminAuth();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const body = await request.json();
    const action = typeof body.action === 'string' ? body.action.trim() : '';
    const target = typeof body.target === 'string' ? body.target.trim() : '';
    const details = typeof body.details === 'string' ? body.details.trim() : '';
    if (!action || !target) return NextResponse.json({ error: 'Action and target are required.' }, { status: 400 });

    await dbConnect();
    const log = await AuditLog.create({
      user: auth.user.email,
      userName: auth.user.name,
      action,
      target,
      details,
      ipAddress: request.headers.get('x-forwarded-for') || '',
    });
    return NextResponse.json({ success: true, log: log.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Audit log creation error:', error);
    return NextResponse.json({ error: 'Unable to create audit log.' }, { status: 400 });
  }
}
