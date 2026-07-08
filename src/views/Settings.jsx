import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, UserPlus, Shield, Trash2, Sliders, Bell, Globe, Key, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { currentUser, users, manageUser, deleteUser, registerUser, triggerToast, defaultAvatar } = useContext(AppContext);
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollRole, setEnrollRole] = useState('intern');
  const [enrollPassword, setEnrollPassword] = useState('password123');
  const [enrollId, setEnrollId] = useState('');

  const generateInternId = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setEnrollId(`INT-2026-${rand}`);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEnrollPassword(pass);
  };

  const handleEnrollUser = (e) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollEmail.trim() || !enrollPassword.trim() || !enrollId.trim()) {
      triggerToast('All enrollment fields are required.', 'error');
      return;
    }

    const exists = users.some((u) => u.email.toLowerCase() === enrollEmail.toLowerCase());
    if (exists) {
      triggerToast('A user with this email already exists.', 'error');
      return;
    }

    const res = registerUser(enrollName.trim(), enrollEmail.trim(), enrollPassword.trim(), enrollRole);
    if (res.success) {
      // Save the generated intern ID on the user
      manageUser(res.user.id, { internId: enrollId.trim() });
      triggerToast(`Enrolled ${enrollName} as ${enrollRole} with ID ${enrollId}!`, 'success');
      
      // Clear inputs
      setEnrollName('');
      setEnrollEmail('');
      setEnrollId('');
      setEnrollPassword('password123');
    }
  };

  // Filter roster: Mentors only see interns assigned to them (admins see all)
  const visibleRoster = users.filter(u => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return u.role === 'intern' && u.mentorEmail === currentUser.email;
  });

  const isPrivileged = currentUser && (currentUser.role === 'mentor' || currentUser.role === 'admin');

  if (currentUser && currentUser.role === 'intern') {
    return (
      <div className="space-y-6 text-slate-800">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Console Settings</h2>
          <p className="text-xs text-slate-400 font-medium">Configure workspace notifications preferences</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 max-w-md">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-orange-500" /> Notifications Settings
          </h3>
          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
              <span>Email notifications for assigned tasks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
              <span>Calendar event reminders</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Console Settings & Administration</h2>
        <p className="text-xs text-slate-400 font-medium">Configure workspace preferences and manage user accounts</p>
      </div>

      {isPrivileged && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Roster list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-500" /> 
              {currentUser.role === 'admin' ? 'Active Workspace Users' : 'Assigned Interns Roster'}
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {visibleRoster.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic text-xs">No active interns assigned.</div>
              ) : (
                visibleRoster.map(u => (
                  <div key={u.id} className="flex justify-between items-center p-3 border border-slate-50 hover:border-slate-105 rounded-xl bg-slate-50/30 text-xs">
                    <div className="min-w-0 flex-1 flex items-center gap-2.5">
                      <img
                        src={u.avatar || defaultAvatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-105"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{u.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {u.email} {u.internId ? `• ID: ${u.internId}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                        {u.role}
                      </span>

                      {/* Delete button (cannot delete self) */}
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          disabled={currentUser.email.toLowerCase() === u.email.toLowerCase()}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Remove User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enroll user form */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-orange-500" /> Enroll Member
            </h3>

            <form onSubmit={handleEnrollUser} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyesh Sen"
                  value={enrollName}
                  onChange={e => setEnrollName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyesh@internverse.com"
                  value={enrollEmail}
                  onChange={e => setEnrollEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Workspace Role</label>
                <select
                  value={enrollRole}
                  onChange={e => setEnrollRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-orange-500"
                >
                  <option value="intern">Intern</option>
                  {currentUser.role === 'admin' && <option value="mentor">Mentor</option>}
                  {currentUser.role === 'admin' && <option value="admin">Admin</option>}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Intern ID</span>
                  <button
                    type="button"
                    onClick={generateInternId}
                    className="text-[9px] font-bold text-orange-550 hover:underline flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Generate ID
                  </button>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Generate or input Intern ID"
                  value={enrollId}
                  onChange={e => setEnrollId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[9px] font-bold text-orange-550 hover:underline flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Generate Password
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={enrollPassword}
                  onChange={e => setEnrollPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition shadow-md shadow-orange-500/10 cursor-pointer"
              >
                Enroll New Account
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Console alerts preferences */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 max-w-md">
        <h3 className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-orange-500" /> Notifications Settings
        </h3>
        <div className="space-y-3 text-xs text-slate-650 font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
            <span>Email notifications for assigned tasks</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
            <span>Calendar event reminders</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
            <span>Browser audio alerts on reviews</span>
          </label>
        </div>
      </div>

    </div>
  );
};

export default Settings;
