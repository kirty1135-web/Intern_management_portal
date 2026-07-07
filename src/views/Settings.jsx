import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, UserPlus, Shield, Trash2, Sliders, Bell, Globe, Key } from 'lucide-react';

const Settings = () => {
  const { currentUser, users, manageUser, deleteUser, registerUser, triggerToast, defaultAvatar } = useContext(AppContext);
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollRole, setEnrollRole] = useState('intern');
  const [enrollPassword, setEnrollPassword] = useState('password123');

  const [activeTheme, setActiveTheme] = useState('slate');
  const [lang, setLang] = useState('english');

  const handleEnrollUser = (e) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollEmail.trim()) return;

    // Use registerUser helper (without logging in the new user)
    const exists = users.some((u) => u.email.toLowerCase() === enrollEmail.toLowerCase());
    if (exists) {
      triggerToast('A user with this email already exists.', 'error');
      return;
    }

    registerUser(enrollName.trim(), enrollEmail.trim(), enrollPassword, enrollRole);
    
    // Clear inputs
    setEnrollName('');
    setEnrollEmail('');
    setEnrollPassword('password123');
    triggerToast(`Enrolled ${enrollName} as ${enrollRole}!`, 'success');
  };

  const handleRoleChange = (userId, newRole) => {
    manageUser(userId, { role: newRole });
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Console Settings & Administration</h2>
        <p className="text-xs text-slate-400 font-medium">Configure themes, workspace preferences, and manage user roles</p>
      </div>

      {/* Admin User Management Panel */}
      {currentUser && currentUser.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Roster list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-500" /> Active Workspace Users
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border border-slate-50 hover:border-slate-100 rounded-xl bg-slate-50/30 text-xs">
                  <div className="min-w-0 flex-1 flex items-center gap-2.5">
                    <img
                      src={u.avatar || defaultAvatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-100"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{u.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role Selection Dropdown */}
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="mentor">Mentor</option>
                      <option value="intern">Intern</option>
                    </select>

                    {/* Delete button (cannot delete self) */}
                    <button
                      onClick={() => deleteUser(u.id)}
                      disabled={currentUser.email.toLowerCase() === u.email.toLowerCase()}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Workspace Role</label>
                  <select
                    value={enrollRole}
                    onChange={e => setEnrollRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-orange-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="mentor">Mentor</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={enrollPassword}
                    onChange={e => setEnrollPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                  />
                </div>
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

      {/* Roster Theme Preference & Lang Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Theme Preferences */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-orange-500" /> Theme Selection
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {['slate', 'navy', 'charcoal'].map(t => (
              <button
                key={t}
                onClick={() => {
                  setActiveTheme(t);
                  triggerToast(`Theme switched to ${t}!`, 'success');
                }}
                className={`py-2 px-3 border rounded-xl font-bold transition text-left capitalize ${
                  activeTheme === t
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t} Theme
              </button>
            ))}
          </div>
        </div>

        {/* Global Languages */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-orange-500" /> System Language
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {['english', 'hindi', 'spanish'].map(l => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  triggerToast(`Language updated to ${l}!`, 'success');
                }}
                className={`py-2 px-3 border rounded-xl font-bold transition text-left capitalize ${
                  lang === l
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Console alerts preferences */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
              <span>Browser audio alerts on reviews</span>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
