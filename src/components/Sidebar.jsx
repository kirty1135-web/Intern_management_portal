import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  Home, CheckSquare, Send, Folder, ClipboardList, Calendar, Clock,
  CheckCircle2, Video, BarChart3, Bell, TrendingUp, User, Settings,
  HelpCircle, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleCollapse, isOpen, setIsOpen }) => {
  const { currentUser, logoutUser, notifications, defaultAvatar } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getMenuItems = () => {
    const isIntern = currentUser?.role === 'intern';
    const items = [
      { name: 'Dashboard', icon: Home, path: '/dashboard/overview' },
      isIntern
        ? { name: 'My Tasks', icon: CheckSquare, path: '/dashboard/tasks' }
        : { name: 'Assigned By Me', icon: CheckSquare, path: '/dashboard/tasks' },
      { name: 'Projects', icon: Folder, path: '/dashboard/projects' },
      { name: 'Task Board', icon: ClipboardList, path: '/dashboard/kanban' },
      { name: 'Calendar', icon: Calendar, path: '/dashboard/calendar' },
      { name: 'Deadlines', icon: Clock, path: '/dashboard/deadlines' },
    ];

    if (!isIntern) {
      items.push({ name: 'Approvals', icon: CheckCircle2, path: '/dashboard/approvals' });
    }

    items.push(
      { name: 'Meetings', icon: Video, path: '/dashboard/meetings' },
      { name: 'Activity', icon: BarChart3, path: '/dashboard/activity' },
      { name: 'Settings', icon: Settings, path: '/dashboard/settings' }
    );

    return items;
  };

  const menuItems = getMenuItems();

  const unreadCount = notifications.filter(
    n => currentUser && n.targetEmail.toLowerCase() === currentUser.email.toLowerCase() && !n.read
  ).length;

  const MenuItemContent = ({ item, isActive }) => (
    <>
      {/* Left Glowing Active Accent Ring */}
      {isActive && (
        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-orange-500 rounded-r-lg" />
      )}
      
      <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
        isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'
      }`} />
      
      {!isCollapsed && (
        <span className="ml-3 font-semibold text-sm truncate flex-1">{item.name}</span>
      )}

      {!isCollapsed && item.badge && unreadCount > 0 && (
        <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-orange-500 rounded-full flex-shrink-0">
          {unreadCount}
        </span>
      )}

      {isCollapsed && item.badge && unreadCount > 0 && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
      )}
    </>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Floating Card Sidebar container */}
      <div className={`h-full flex flex-col bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden ${
        isCollapsed ? 'w-20' : 'w-[260px]'
      } transition-all duration-300 lg:relative ${
        isOpen ? 'fixed left-6 top-6 bottom-6 z-45 w-[260px]' : 'hidden lg:flex'
      }`}>
        {/* Brand Banner Banner */}
        <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8.5 h-8.5 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 text-white">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-slate-800 tracking-tight text-sm truncate">
                CohortFlow Workspace
              </span>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 border border-slate-50 rounded-lg hover:bg-slate-50 transition text-slate-400 hover:text-slate-600"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User profile card */}
        {currentUser && !isCollapsed && (
          <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/10 flex-shrink-0">
            <img
              src={currentUser.avatar || defaultAvatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-100"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-800 truncate">{currentUser.name}</h4>
              <span className="text-[9px] uppercase font-bold text-orange-500 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation list (Independent Scrollable Container) */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center px-3 py-2.5 rounded-xl transition text-slate-600 hover:text-slate-800 ${
                  isActive ? 'bg-orange-500/5 text-orange-600 font-bold' : 'hover:bg-slate-50/70'
                }`
              }
            >
              {({ isActive }) => <MenuItemContent item={item} isActive={isActive} />}
            </NavLink>
          ))}
        </nav>

        {/* FIXED FOOTER (Strictly Non-Scrolling Bottom Logout Option) */}
        <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0 sticky bottom-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-xl transition text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold text-sm group cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-rose-400 group-hover:text-rose-500" />
            {!isCollapsed && <span className="ml-3">Logout Session</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
