import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Check, Trash2, Clock, Mail } from 'lucide-react';

const NotificationsLog = () => {
  const { notifications, currentUser, markAllNotificationsRead, deleteNotification } = useContext(AppContext);

  // Filter user specific alerts
  const myNotifications = notifications.filter(
    (n) => currentUser && n.targetEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Workspace Alerts Center</h2>
          <p className="text-xs text-slate-400 font-medium">Review task assignments, sync changes, and approvals</p>
        </div>

        {myNotifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Roster list */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-orange-500" /> Notifications Feed
          </h3>
          <span className="text-[10px] bg-slate-150 px-2 py-0.5 rounded text-slate-500 font-bold">
            {myNotifications.filter(n => !n.read).length} Unread Alerts
          </span>
        </div>

        <div className="space-y-3">
          {myNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-2xl flex justify-between items-start gap-4 transition ${
                n.read ? 'border-slate-100 bg-slate-50/20' : 'border-orange-100 bg-orange-500/5'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">
                    {n.type}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {n.time}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-normal">{n.text}</p>
              </div>

              <button
                onClick={() => deleteNotification(n.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition"
                title="Remove Notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {myNotifications.length === 0 && (
            <div className="text-center py-12 text-slate-400 italic">No workspace alerts logged.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default NotificationsLog;
