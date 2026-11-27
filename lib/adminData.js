// Platform configuration defaults. Marketplace records are loaded from MongoDB or start empty.
export const initialPlatformSettings = {
  platformName: 'Fresh Farm Marketplace',
  platformCommissionRate: 10,
  minFarmerPayoutThreshold: 500,
  freeDeliveryThreshold: 199,
  defaultDeliveryFee: 30,
  autoApproveFarmers: false,
  autoApproveProducts: false,
  maintenanceMode: false,
  supportEmail: '',
  supportPhone: '',
  adminSessionTimeoutMinutes: 60,
  auditLoggingEnabled: true,
};
