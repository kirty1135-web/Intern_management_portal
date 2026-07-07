import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Search, Bell, Sun, Moon, Plus, User, Settings, LogOut, CheckSquare, Video, Users, Menu } from 'lucide-react';
import AddWorkModal from './AddWorkModal';

const Navbar = ({ onMenuClick }) => {
  const { currentUser, logoutUser, notifications, markAllNotificationsRead, tasks, meetings, users, defaultAvatar } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [themeMode, setThemeMode] = useState('light');

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const unreadNotifications = notifications.filter(
    (n) => currentUser && n.targetEmail.toLowerCase() === currentUser.email.toLowerCase() && !n.read
  );

  const getSearchResults = () => {
    if (!searchQuery.trim()) return { tasks: [], meetings: [], users: [] };
    const query = searchQuery.toLowerCase();

    const matchedTasks = tasks.filter(
      (t) => t.title.toLowerCase().includes(query) || t.project.toLowerCase().includes(query)
    );
    const matchedMeetings = meetings.filter((m) => m.title.toLowerCase().includes(query));
    const matchedUsers = users.filter(
      (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );

    return { tasks: matchedTasks, meetings: matchedMeetings, users: matchedUsers };
  };

  const searchResults = getSearchResults();
  const hasResults =
    searchResults.tasks.length > 0 ||
    searchResults.meetings.length > 0 ||
    searchResults.users.length > 0;

  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  return (
    <header className="bg-white border border-slate-100 rounded-3xl px-6 h-16 flex items-center justify-between shadow-xs mb-0 flex-shrink-0 w-full relative">
      {/* Search Input Section */}
      <div className="flex items-center gap-4 flex-1 max-w-sm" ref={searchRef}>
        <button
          onClick={onMenuClick}
          className="p-1.5 border border-slate-50 rounded-xl hover:bg-slate-50 transition lg:hidden text-slate-500 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search console..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-orange-500 text-xs rounded-xl outline-none text-slate-800 transition"
          />

          {/* Search Dropdown Overlay */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-12 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl p-4 space-y-4 max-h-96 overflow-y-auto z-50 text-slate-800">
              {!hasResults ? (
                <div className="text-center py-4 text-xs text-slate-450 italic">
                  No matching results for "{searchQuery}"
                </div>
              ) : (
                <>
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> Tasks
                      </h4>
                      <div className="space-y-1">
                        {searchResults.tasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleResultClick('/dashboard/tasks')}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-700"
                          >
                            {t.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.meetings.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-orange-500" /> Meetings
                      </h4>
                      <div className="space-y-1">
                        {searchResults.meetings.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleResultClick('/dashboard/meetings')}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-700"
                          >
                            {m.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Icons Section */}
      <div className="flex items-center gap-3">
        {/* Add Work Button */}
        <button
          onClick={() => setShowAddWorkModal(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Work
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-slate-500 hover:text-slate-700 cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-slate-500 hover:text-slate-700 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute top-12 right-0 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-orange-500 hover:text-orange-600"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    No new notifications
                  </div>
                ) : (
                  unreadNotifications.map((n) => (
                    <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition space-y-1">
                      <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md">
                        {n.type}
                      </span>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {n.text}
                      </p>
                      <span className="text-[9px] text-slate-400 block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {currentUser && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 outline-none cursor-pointer"
            >
              <img
                src={currentUser.avatar || defaultAvatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-slate-100 object-cover bg-slate-50"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </button>

            {showProfileDropdown && (
              <div className="absolute top-12 right-0 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl p-2.5 z-50 text-slate-850">
                <div className="px-3 py-2 border-b border-slate-50 mb-2">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{currentUser.name}</h4>
                  <span className="text-[10px] text-slate-400 truncate block">{currentUser.email}</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/dashboard/profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddWorkModal isOpen={showAddWorkModal} onClose={() => setShowAddWorkModal(false)} />
    </header>
  );
};

export default Navbar;
