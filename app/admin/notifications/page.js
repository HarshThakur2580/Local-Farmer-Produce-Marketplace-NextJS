'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminNotificationsPage() {
  const { notifications, broadcastNotification } = useAdmin();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all'); // 'all' | 'customers' | 'farmers'
  const [type, setType] = useState('announcement'); // 'announcement' | 'alert' | 'system'
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    broadcastNotification({
      title: title.trim(),
      message: message.trim(),
      target,
      type,
    });

    setTitle('');
    setMessage('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Broadcast Communications & Announcements
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Publish site-wide announcements, emergency seasonal alerts and logistical updates to buyers and agricultural vendors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Form (1 Column) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
          <h2 className="font-bold text-gray-900 text-base mb-1 flex items-center gap-2">
            <span>📢</span> Compose New Broadcast
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Notifications are displayed in user notification bells and platform banners.
          </p>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl mb-4 font-semibold flex items-center gap-2">
              <span>✓</span> Announcement broadcasted to {target.toUpperCase()} audience successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'Everyone' },
                  { id: 'customers', label: 'Buyers Only' },
                  { id: 'farmers', label: 'Farmers Only' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTarget(aud.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                      target === aud.id
                        ? 'bg-green-600 text-white border-green-600 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Notification Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
              >
                <option value="announcement">General Announcement</option>
                <option value="alert">Critical / Weather Alert</option>
                <option value="system">System Maintenance</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Winter Harvest Logistics Guidelines"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Broadcast Body
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write the full announcement text here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm"
            >
              🚀 Dispatch Notification Now
            </button>
          </form>
        </div>

        {/* History of Sent Announcements (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base">
              Dispatched Broadcasts History ({notifications.length})
            </h2>
            <span className="text-xs text-gray-400">Chronological feed</span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {notif.type === 'alert' ? '⚠️' : notif.type === 'system' ? '⚙️' : '📢'}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">{notif.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                        Audience: {notif.target}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(notif.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {notif.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Type: <strong className="capitalize text-gray-600">{notif.type}</strong></span>
                  <span>Delivered to <strong>{notif.readCount || 0}</strong> active sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
