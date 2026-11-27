import { getCurrentAdmin } from '@/lib/server/adminSession';

export async function verifyServerAdminAuth() {
  const admin = await getCurrentAdmin();
  if (!admin) return { authorized: false, error: 'Super administrator sign in required.' };
  return { authorized: true, user: admin };
}
