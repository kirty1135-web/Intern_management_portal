import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import AssignedByMe from './views/AssignedByMe';
import ProjectsList from './views/Projects';
import Kanban from './components/Kanban';
import CalendarView from './components/Calendar';
import Deadlines from './views/Deadlines';
import Approvals from './views/Approvals';
import Meetings from './views/Meetings';
import ActivityLog from './views/Activity';
import NotificationsLog from './views/Notifications';
import Reports from './views/Reports';
import Profile from './views/Profile';
import Settings from './views/Settings';
import HelpSupport from './views/Help';

// Protected Route shell to guard dashboard access
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Global Floating Notifications Banner
const ToastContainer = () => {
  const { toasts } = useContext(AppContext);
  return (
    <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4.5 py-3.5 rounded-2xl shadow-lg text-xs font-bold text-white border flex items-center gap-2 transition duration-300 ${
            t.type === 'error'
              ? 'bg-rose-500 border-rose-600'
              : t.type === 'warning'
              ? 'bg-amber-500 border-amber-600'
              : 'bg-emerald-500 border-emerald-600'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="assigned" element={<AssignedByMe />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="deadlines" element={<Deadlines />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="notifications" element={<NotificationsLog />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpSupport />} />
          <Route index element={<Navigate to="overview" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
