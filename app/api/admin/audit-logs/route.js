import { NextResponse } from 'next/server';
import { verifyServerAdminAuth } from '@/lib/server/adminService';
import { initialAuditLogs } from '@/lib/adminData';

/**
 * GET /api/admin/audit-logs
 * Server-protected API returning administrative audit logs.
 */
export async function GET(request) {
  const auth = await verifyServerAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    logs: initialAuditLogs,
    count: initialAuditLogs.length,
    requestedBy: auth.user.email,
  });
}

/**
 * POST /api/admin/audit-logs
 * Server-validated logging API for privileged operations.
 */
export async function POST(request) {
  const auth = await verifyServerAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, target, details } = body;

    if (!action || !target) {
      return NextResponse.json(
        { error: 'Validation failed: action and target are required fields.' },
        { status: 400 }
      );
    }

    const newLog = {
      id: `log-server-${Date.now()}`,
      adminName: auth.user.name,
      action,
      target,
      details: details || '',
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1 (Server API)',
    };

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
