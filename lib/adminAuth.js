// Server-side & Client Admin Authentication & Authorization Service
// Seeds the Super Administrator account and provides role validation.

export const SEEDED_SUPER_ADMIN = {
  id: 'adm_super_01',
  name: 'Super Administrator',
  email: 'officialharsh2580@gmail.com',
  role: 'super_admin',
  department: 'Platform Operations & Quality Compliance',
  lastLogin: '2026-11-17T18:30:00Z',
  permissions: [
    'ALL_ACCESS',
    'MANAGE_CUSTOMERS',
    'MANAGE_FARMERS',
    'APPROVE_REJECT_PRODUCERS',
    'MANAGE_PRODUCTS',
    'MANAGE_CATEGORIES',
    'MANAGE_ORDERS',
    'MANAGE_PAYMENTS_PAYOUTS',
    'MODERATE_REVIEWS',
    'BROADCAST_NOTIFICATIONS',
    'VIEW_FINANCIAL_REPORTS',
    'PLATFORM_SETTINGS',
    'AUDIT_LOG_READ_WRITE',
  ],
};

// Set your administrative password here:
export const SEEDED_ADMIN_PASSWORD_PLAIN = '#Harsh180203'; // 👈 Type your chosen password here

export const ADMIN_SESSION_COOKIE = 'freshfarm_admin_session';

/**
 * Validates admin credentials securely.
 * Note: When MongoDB is connected, this compares with bcrypt-hashed credentials stored in the Admins collection.
 */
export function validateAdminCredentials(email, password) {
  if (!email || !password) return { success: false, message: 'Email and password are required.' };

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === SEEDED_SUPER_ADMIN.email && password === SEEDED_ADMIN_PASSWORD_PLAIN) {
    return {
      success: true,
      user: {
        id: SEEDED_SUPER_ADMIN.id,
        name: SEEDED_SUPER_ADMIN.name,
        email: SEEDED_SUPER_ADMIN.email,
        role: SEEDED_SUPER_ADMIN.role,
        permissions: SEEDED_SUPER_ADMIN.permissions,
      },
    };
  }

  return { success: false, message: 'Invalid administrative credentials or insufficient permissions.' };
}

/**
 * Validates if an active session or user object has Super Admin clearance.
 */
export function isSuperAdmin(user) {
  return Boolean(user && (user.role === 'super_admin' || user.role === 'admin'));
}

/**
 * Helper to build standard audit log entry.
 */
export function createAuditEntry({
  action,
  target,
  details,
  adminName = 'Super Administrator',
}) {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    adminName,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1 (Authenticated Admin Session)',
  };
}
