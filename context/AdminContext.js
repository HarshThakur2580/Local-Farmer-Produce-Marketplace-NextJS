'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialCustomers,
  initialFarmers,
  initialCategories,
  initialAdminProducts,
  initialOrders,
  initialPayments,
  initialReviews,
  initialNotifications,
  initialAuditLogs,
  initialPlatformSettings,
} from '@/lib/adminData';
import { SEEDED_SUPER_ADMIN, validateAdminCredentials, createAuditEntry } from '@/lib/adminAuth';

const AdminContext = createContext(null);

const STORAGE_PREFIX = 'freshfarm_admin_';

export function AdminProvider({ children }) {
  // Admin Session State
  const [adminUser, setAdminUser] = useState(SEEDED_SUPER_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Pre-authenticated with seeded Super Admin
  const [isLoaded, setIsLoaded] = useState(false);

  // Entities State
  const [customers, setCustomers] = useState(initialCustomers);
  const [farmers, setFarmers] = useState(initialFarmers);
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialAdminProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [payments, setPayments] = useState(initialPayments);
  const [reviews, setReviews] = useState(initialReviews);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [settings, setSettings] = useState(initialPlatformSettings);

  // Load from localStorage on client mount if available
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(`${STORAGE_PREFIX}session`);
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setAdminUser(parsed.user);
        setIsAuthenticated(parsed.isAuthenticated);
      }

      const storedFarmers = localStorage.getItem(`${STORAGE_PREFIX}farmers`);
      if (storedFarmers) setFarmers(JSON.parse(storedFarmers));

      const storedProducts = localStorage.getItem(`${STORAGE_PREFIX}products`);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedOrders = localStorage.getItem(`${STORAGE_PREFIX}orders`);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCategories = localStorage.getItem(`${STORAGE_PREFIX}categories`);
      if (storedCategories) setCategories(JSON.parse(storedCategories));

      const storedCustomers = localStorage.getItem(`${STORAGE_PREFIX}customers`);
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

      const storedPayments = localStorage.getItem(`${STORAGE_PREFIX}payments`);
      if (storedPayments) setPayments(JSON.parse(storedPayments));

      const storedReviews = localStorage.getItem(`${STORAGE_PREFIX}reviews`);
      if (storedReviews) setReviews(JSON.parse(storedReviews));

      const storedLogs = localStorage.getItem(`${STORAGE_PREFIX}audit_logs`);
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
    } catch (e) {
      console.warn('Admin storage load error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Helper to append audit log
  const logAction = (action, target, details) => {
    const entry = createAuditEntry({
      action,
      target,
      details,
      adminName: adminUser?.name || 'Super Administrator',
    });
    setAuditLogs((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_PREFIX}audit_logs`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Auth Functions
  const loginAdmin = (email, password) => {
    const res = validateAdminCredentials(email, password);
    if (res.success) {
      setAdminUser(res.user);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(
          `${STORAGE_PREFIX}session`,
          JSON.stringify({ isAuthenticated: true, user: res.user })
        );
      } catch (e) {
        console.error(e);
      }
      logAction('ADMIN_LOGIN', 'Admin Portal', `Successful login by ${res.user.email}`);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logoutAdmin = () => {
    logAction('ADMIN_LOGOUT', 'Admin Portal', `Logout by ${adminUser?.email}`);
    setIsAuthenticated(false);
    setAdminUser(null);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}session`);
    } catch (e) {
      console.error(e);
    }
  };

  // ==================== CUSTOMER ACTIONS ====================
  const toggleSuspendCustomer = (customerId, reason = 'Administrative action') => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          logAction(
            nextStatus === 'Suspended' ? 'CUSTOMER_SUSPEND' : 'CUSTOMER_REACTIVATE',
            `Customer: ${c.name} (${c.email})`,
            nextStatus === 'Suspended' ? `Suspended. Reason: ${reason}` : 'Account reactivated'
          );
          return {
            ...c,
            status: nextStatus,
            suspensionReason: nextStatus === 'Suspended' ? reason : undefined,
          };
        }
        return c;
      })
    );
  };

  const updateCustomerNotes = (customerId, address) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          logAction('CUSTOMER_UPDATE', `Customer: ${c.name}`, `Updated address/profile info`);
          return { ...c, address };
        }
        return c;
      })
    );
  };

  // ==================== FARMER ACTIONS ====================
  const approveFarmer = (farmerId) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          logAction('FARMER_APPROVE', `Farmer: ${f.name} (${f.farmName})`, 'Application verified and approved.');
          return { ...f, status: 'Approved', verified: true, badge: 'Verified Farmer' };
        }
        return f;
      })
    );
  };

  const rejectFarmer = (farmerId, reason = 'Document verification failed') => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          logAction('FARMER_REJECT', `Farmer: ${f.name} (${f.farmName})`, `Rejected. Reason: ${reason}`);
          return { ...f, status: 'Rejected', rejectionReason: reason };
        }
        return f;
      })
    );
  };

  const toggleSuspendFarmer = (farmerId, reason = 'Compliance check required') => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          const nextStatus = f.status === 'Approved' ? 'Suspended' : 'Approved';
          logAction(
            nextStatus === 'Suspended' ? 'FARMER_SUSPEND' : 'FARMER_REACTIVATE',
            `Farmer: ${f.name} (${f.farmName})`,
            nextStatus === 'Suspended' ? `Suspension applied. Reason: ${reason}` : 'Account reactivated.'
          );
          return {
            ...f,
            status: nextStatus,
            badge: nextStatus === 'Suspended' ? 'Suspended' : 'Verified Farmer',
            suspensionReason: nextStatus === 'Suspended' ? reason : undefined,
          };
        }
        return f;
      })
    );
  };

  // ==================== PRODUCT ACTIONS ====================
  const approveProduct = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          logAction('PRODUCT_APPROVE', `Product: ${p.name}`, `Approved for sale by farmer ${p.farmerName}`);
          return { ...p, status: 'Approved' };
        }
        return p;
      })
    );
  };

  const rejectProduct = (productId, reason = 'Quality check failed') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          logAction('PRODUCT_REJECT', `Product: ${p.name}`, `Rejected. Reason: ${reason}`);
          return { ...p, status: 'Rejected', rejectionReason: reason };
        }
        return p;
      })
    );
  };

  const updateProductDetails = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          logAction('PRODUCT_UPDATE', `Product: ${p.name}`, `Price: ₹${updates.price}, Stock: ${updates.stock}`);
          return { ...p, ...updates };
        }
        return p;
      })
    );
  };

  const deleteProduct = (productId) => {
    const target = products.find((p) => p.id === productId);
    logAction('PRODUCT_DELETE', `Product: ${target?.name || productId}`, 'Removed product listing from platform');
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // ==================== CATEGORY ACTIONS ====================
  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: categoryData.description || 'Agricultural produce category.',
      icon: categoryData.icon || '🌾',
      productsCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    logAction('CATEGORY_CREATE', `Category: ${newCategory.name}`, `Created new category slug /${newCategory.slug}`);
    setCategories((prev) => [newCategory, ...prev]);
  };

  const updateCategory = (categoryId, updates) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          logAction('CATEGORY_UPDATE', `Category: ${cat.name}`, `Updated category details`);
          return { ...cat, ...updates };
        }
        return cat;
      })
    );
  };

  const deleteCategory = (categoryId) => {
    const target = categories.find((c) => c.id === categoryId);
    logAction('CATEGORY_DELETE', `Category: ${target?.name || categoryId}`, 'Deleted product category');
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // ==================== ORDER ACTIONS ====================
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          logAction('ORDER_STATUS_UPDATE', `Order: ${o.id}`, `Status updated from ${o.status} to ${newStatus}`);
          return { ...o, status: newStatus };
        }
        return o;
      })
    );
  };

  const resolveOrderComplaint = (orderId, resolutionNotes) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          logAction('COMPLAINT_RESOLVE', `Order: ${o.id}`, `Complaint marked resolved. Notes: ${resolutionNotes}`);
          return { ...o, complaintStatus: 'Resolved', complaintNotes: resolutionNotes };
        }
        return o;
      })
    );
  };

  // ==================== PAYMENT & PAYOUT ACTIONS ====================
  const processRefund = (paymentId) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          logAction('PAYMENT_REFUND', `Payment: ${p.id}`, `Refund of ₹${p.grossAmount} processed to ${p.customerName}`);
          return { ...p, status: 'Refunded', payoutStatus: 'Cancelled' };
        }
        return p;
      })
    );
    // Also reflect in matching order
    const match = payments.find((p) => p.id === paymentId);
    if (match) {
      setOrders((prev) =>
        prev.map((o) => (o.id === match.orderId ? { ...o, paymentStatus: 'Refunded', status: 'Cancelled' } : o))
      );
    }
  };

  const releaseFarmerPayout = (paymentId) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          logAction('PAYOUT_RELEASE', `Payment: ${p.id}`, `Released ₹${p.netPayout} payout to ${p.farmerName}`);
          return { ...p, payoutStatus: 'Paid', payoutDate: new Date().toISOString().split('T')[0] };
        }
        return p;
      })
    );
  };

  const holdFarmerPayout = (paymentId, reason) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          logAction('PAYOUT_HOLD', `Payment: ${p.id}`, `Payout held. Reason: ${reason}`);
          return { ...p, payoutStatus: 'On Hold', holdReason: reason };
        }
        return p;
      })
    );
  };

  // ==================== REVIEW MODERATION ====================
  const moderateReview = (reviewId, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          logAction('REVIEW_MODERATE', `Review: ${r.id}`, `Review status set to ${newStatus}`);
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  const deleteReview = (reviewId) => {
    logAction('REVIEW_DELETE', `Review: ${reviewId}`, 'Deleted customer review');
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // ==================== NOTIFICATIONS ====================
  const broadcastNotification = ({ title, message, target, type }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      target: target || 'all',
      type: type || 'announcement',
      sentAt: new Date().toISOString(),
      readCount: 0,
    };
    logAction('BROADCAST_NOTIFICATION', `Announcement: ${title}`, `Sent to audience: ${target}`);
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ==================== SETTINGS ====================
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      logAction('SETTINGS_UPDATE', 'Platform Settings', 'Super Administrator updated platform configurations');
      return updated;
    });
  };

  // Computed summary metrics
  const pendingApprovalsCount = useMemo(() => {
    const pendingFarmers = farmers.filter((f) => f.status === 'Pending').length;
    const pendingProducts = products.filter((p) => p.status === 'Pending').length;
    return pendingFarmers + pendingProducts;
  }, [farmers, products]);

  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + p.grossAmount, 0);
  }, [payments]);

  const platformEarnings = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + p.platformFee, 0);
  }, [payments]);

  const openComplaintsCount = useMemo(() => {
    return orders.filter((o) => o.complaintStatus === 'Open').length;
  }, [orders]);

  const flaggedReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === 'Flagged').length;
  }, [reviews]);

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        loginAdmin,
        logoutAdmin,
        isLoaded,
        customers,
        toggleSuspendCustomer,
        updateCustomerNotes,
        farmers,
        approveFarmer,
        rejectFarmer,
        toggleSuspendFarmer,
        products,
        approveProduct,
        rejectProduct,
        updateProductDetails,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        orders,
        updateOrderStatus,
        resolveOrderComplaint,
        payments,
        processRefund,
        releaseFarmerPayout,
        holdFarmerPayout,
        reviews,
        moderateReview,
        deleteReview,
        notifications,
        broadcastNotification,
        auditLogs,
        settings,
        updateSettings,
        pendingApprovalsCount,
        totalRevenue,
        platformEarnings,
        openComplaintsCount,
        flaggedReviewsCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
