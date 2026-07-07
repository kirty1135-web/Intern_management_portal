import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800 antialiased">
      {/* Sidebar - Floating Navigation Card on Desktop */}
      <div className="hidden lg:block flex-shrink-0 py-6 pl-6 h-full">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          isOpen={isMobileOpen}
          setIsOpen={setIsMobileOpen}
        />
      </div>

      {/* Mobile Drawer (Absolute positioning) */}
      <div className="lg:hidden">
        <Sidebar
          isCollapsed={false}
          toggleCollapse={toggleCollapse}
          isOpen={isMobileOpen}
          setIsOpen={setIsMobileOpen}
        />
      </div>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-6 px-6">
        {/* Floating Header Navbar Pill */}
        <Navbar onMenuClick={handleMenuClick} />

        {/* Scrollable Workspace Panels */}
        <main className="flex-1 overflow-y-auto mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
