'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import Icon from '@/components/Icon';

export default function AdminSettingsPage() {
  const { adminUser, settings, updateSettings, auditLogs } = useAdmin();

  const [formSettings, setFormSettings] = useState({
    platformName: settings.platformName || 'Fresh Farm Marketplace',
    platformCommissionRate: settings.platformCommissionRate || 10,
    minFarmerPayoutThreshold: settings.minFarmerPayoutThreshold || 500,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 199,
    defaultDeliveryFee: settings.defaultDeliveryFee || 30,
    autoApproveFarmers: settings.autoApproveFarmers || false,
    autoApproveProducts: settings.autoApproveProducts || false,
    maintenanceMode: settings.maintenanceMode || false,
    supportEmail: settings.supportEmail || 'officialharsh2580@gmail.com',
    supportPhone: settings.supportPhone || '+91 (555) 123-4567',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.action.includes(logFilter);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Super Admin Settings & Security Audit
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure marketplace platform parameters, security policies and review immutable administrative audit trails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin Profile & Security Card (1 Column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-700 text-white font-extrabold flex items-center justify-center text-xl shadow-xs">
                SA
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">{adminUser?.name}</h3>
                <p className="text-xs text-green-700 font-semibold">{adminUser?.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                  Role: {adminUser?.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
              <p><strong>Department:</strong> {adminUser?.department || 'Operations'}</p>
              <p><strong>Session Clearance:</strong> Full Access Tier 1</p>
              <p><strong>Authentication:</strong> Seeded Server Credentials</p>
            </div>

            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Granted Permissions
            </h4>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {adminUser?.permissions?.map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                  <Icon name="check" className="w-4 h-4 text-green-600" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200/70 text-amber-950 space-y-2 text-xs">
            <h4 className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
              <Icon name="shield" className="w-5 h-5" /> Security hardening notice
            </h4>
            <p className="leading-relaxed">
              Public user registration as an administrator is strictly disabled. Administrator credentials are only managed via server seed or internal security provisioning.
            </p>
          </div>
        </div>

        {/* Platform Configuration Form (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Marketplace Financial & Logistics Rules</h2>
              <p className="text-xs text-gray-400 mt-0.5">Parameters apply dynamically to customer checkouts and producer payouts</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl mb-6 font-semibold flex items-center gap-2">
              <Icon name="check" className="w-4 h-4" /> Platform configurations updated and recorded in the audit log.
            </div>
          )}

          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={formSettings.platformName}
                  onChange={(e) => setFormSettings({ ...formSettings, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Commission Rate on Gross Produce Sales (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formSettings.platformCommissionRate}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      platformCommissionRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Minimum Farmer Payout Threshold (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formSettings.minFarmerPayoutThreshold}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      minFarmerPayoutThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Free Delivery Cart Minimum (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formSettings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Quality & Verification Policies
              </h3>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/70 cursor-pointer select-none border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-900">Enforce Farmer Verification Audit</p>
                  <p className="text-[11px] text-gray-500">
                    New farmer registrations require Super Admin verification before listing
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!formSettings.autoApproveFarmers}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, autoApproveFarmers: !e.target.checked })
                  }
                  className="w-5 h-5 accent-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/70 cursor-pointer select-none border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-900">Mandatory Produce Quality Sign-off</p>
                  <p className="text-[11px] text-gray-500">
                    Every harvest submission must be approved in the Approvals Hub
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!formSettings.autoApproveProducts}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, autoApproveProducts: !e.target.checked })
                  }
                  className="w-5 h-5 accent-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50 cursor-pointer select-none border border-rose-100">
                <div>
                  <p className="text-xs font-bold text-rose-900">Platform Maintenance Mode</p>
                  <p className="text-[11px] text-rose-700">
                    Temporarily pause public buyer checkout flow for scheduled upgrades
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.maintenanceMode}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, maintenanceMode: e.target.checked })
                  }
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-xs"
              >
                Save Platform Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Audit Trail Log Viewer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Icon name="document" className="w-5 h-5" /> Administrative security audit logs
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Immutable server records tracking all privileged Super Admin actions
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'FARMER', 'ORDER', 'PRODUCT', 'CATEGORY', 'SETTINGS'].map((filter) => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  logFilter === filter
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-xl">Timestamp</th>
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 rounded-r-xl">Session IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900">{log.adminName}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-800">{log.target}</td>
                  <td className="py-3 px-3 text-gray-600 max-w-xs">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
