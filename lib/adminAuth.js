export function createAuditEntry({ action, target, details, adminName = 'Marketplace Member' }) {
  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    adminName,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: 'Current authenticated session',
  };
}
