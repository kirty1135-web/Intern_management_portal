import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  TrendingUp, CheckCircle, Clock, AlertTriangle, Video, Users,
  UserPlus, FileCheck, HelpCircle, ChevronRight, Activity, Calendar, Settings, Folder, CheckSquare
} from 'lucide-react';

// Custom SVG Progress Ring for Premium KPI presentation
const ProgressRing = ({ value, max, color, icon: Icon }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const val = max > 0 ? value : 0;
  const offset = circumference - (Math.min(val, max) / max) * circumference;
  
  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="rgba(241, 245, 249, 0.8)" strokeWidth="4" fill="transparent" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, tasks, meetings, timeline, users } = useContext(AppContext);
  const navigate = useNavigate();

  if (!currentUser) {
    React.useEffect(() => {
      navigate('/login');
    }, []);
    return null;
  }

  // --- STATS COMPUTATION ---
  const myTasks = tasks;

  const pendingTasksCount = myTasks.filter((t) => t.status !== 'Completed' && t.status !== 'Closed').length;
  const completedTasksCount = myTasks.filter((t) => t.status === 'Completed').length;
  const upcomingMeetingsCount = meetings.length;
  const overdueTasksCount = myTasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Closed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const totalTasksCount = myTasks.length || 1;

  // --- ROLE-BASED QUICK ACTIONS ---
  const getQuickActions = () => {
    switch (currentUser.role) {
      case 'admin':
        return [
          { title: 'Enroll User', desc: 'Add new interns or mentors', icon: UserPlus, path: '/dashboard/settings', bg: 'bg-orange-50 text-orange-600 border-orange-100' },
          { title: 'Configure System', desc: 'Adjust global settings', icon: Settings, path: '/dashboard/settings', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
          { title: 'System Logs', desc: 'Inspect timeline logs', icon: Activity, path: '/dashboard/activity', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
        ];
      case 'mentor':
        return [
          { title: 'Assign Work', desc: 'Create a new task ticket', icon: FileCheck, path: '/dashboard/tasks', bg: 'bg-orange-50 text-orange-600 border-orange-100' },
          { title: 'Schedule Sync', desc: 'Plan calendar meetings', icon: Video, path: '/dashboard/meetings', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
          { title: 'Intern Roster', desc: 'Assess intern details', icon: Users, path: '/dashboard/settings', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
        ];
      default:
        // Intern quick actions: remove Profile and Help
        return [
          { title: 'My Projects', desc: 'Track project progress states', icon: Folder, path: '/dashboard/projects', bg: 'bg-orange-50 text-orange-600 border-orange-100' },
          { title: 'Meetings & Syncs', desc: 'Observe standalone video schedules', icon: Video, path: '/dashboard/meetings', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
          { title: 'My Tasks List', desc: 'Check tasks list checklist', icon: CheckSquare, path: '/dashboard/tasks', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
        ];
    }
  };

  const quickActions = getQuickActions();

  // --- FILTERED TIMELINE LOGS (Requirement 15) ---
  const filteredTimeline = timeline.filter(log => {
    if (currentUser.role === 'intern') {
      return log.targetEmail?.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (currentUser.role === 'mentor') {
      const myInternEmails = users.filter(u => u.mentorEmail === currentUser.email).map(u => u.email.toLowerCase());
      return !log.targetEmail || myInternEmails.includes(log.targetEmail.toLowerCase()) || log.text.includes(currentUser.name);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Redesigned Floating Dashboard Greeting Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Glow elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl" />
        
        <div className="z-10 space-y-1">
          <span className="text-[10px] bg-orange-500/20 text-orange-400 font-extrabold px-2 py-0.5 rounded-md border border-orange-500/30 uppercase tracking-widest">
            {currentUser.role} console
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Workspace Hub, {currentUser.name}!
          </h2>
          <p className="text-xs text-slate-400 max-w-md font-medium">Manage cohort task tickets, synchronize timeline metrics, and organize video standups.</p>
        </div>

        <div className="flex gap-2 text-xs font-bold text-slate-350 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 shadow-sm items-center z-10">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>July 8, 2026</span>
        </div>
      </div>

      {/* RETAINED KPI CARDS WITH SVG PROGRESS RINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ring Card 1 */}
        <div
          onClick={() => navigate('/dashboard/tasks')}
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:shadow hover:border-orange-500/20 transition cursor-pointer"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Pending Tasks</span>
            <span className="text-xl font-black text-slate-800">{pendingTasksCount}</span>
            <span className="text-[10px] text-slate-450 block mt-0.5">Allocated active tickets</span>
          </div>
          <ProgressRing value={pendingTasksCount} max={totalTasksCount} color="#0891b2" icon={Clock} />
        </div>

        {/* Ring Card 2 */}
        <div
          onClick={() => navigate('/dashboard/tasks')}
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:shadow hover:border-orange-500/20 transition cursor-pointer"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Completed</span>
            <span className="text-xl font-black text-slate-800">{completedTasksCount}</span>
            <span className="text-[10px] text-slate-455 block mt-0.5">Successfully compiled</span>
          </div>
          <ProgressRing value={completedTasksCount} max={totalTasksCount} color="#10b981" icon={CheckCircle} />
        </div>

        {/* Ring Card 3 */}
        <div
          onClick={() => navigate('/dashboard/meetings')}
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:shadow hover:border-orange-500/20 transition cursor-pointer"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Sync Calls</span>
            <span className="text-xl font-black text-slate-800">{upcomingMeetingsCount}</span>
            <span className="text-[10px] text-slate-450 block mt-0.5">Active calendar syncs</span>
          </div>
          <ProgressRing value={upcomingMeetingsCount} max={6} color="#3b82f6" icon={Video} />
        </div>

        {/* Ring Card 4 */}
        <div
          onClick={() => navigate('/dashboard/deadlines')}
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:shadow hover:border-orange-500/20 transition cursor-pointer"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Overdue Tasks</span>
            <span className="text-xl font-black text-slate-800">{overdueTasksCount}</span>
            <span className="text-[10px] text-slate-450 block mt-0.5">Urgent priority warnings</span>
          </div>
          <ProgressRing value={overdueTasksCount} max={totalTasksCount} color="#ef4444" icon={AlertTriangle} />
        </div>
      </div>

      {/* Grid Layout for Timeline Audit Logs and Console Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity logs section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Workspace Log Audit</h3>
            <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> 
              Live timeline
            </span>
          </div>
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {filteredTimeline.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-xs">No workspace logs recorded.</div>
            ) : (
              filteredTimeline.slice(0, 4).map((log) => (
                <div key={log.id} className="flex gap-4 items-start text-xs text-slate-650">
                  <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-700 leading-normal">{log.text}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations cards */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-1 pb-4">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Console Operations</h3>
            <p className="text-[10px] text-slate-400 leading-normal">Fast pathways mapped for your workspace role</p>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {quickActions.map((action, idx) => (
              <div
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-200 rounded-2xl cursor-pointer hover:shadow-xs transition bg-slate-50/10 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center flex-shrink-0 ${action.bg}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-700">{action.title}</h4>
                    <p className="text-[9px] text-slate-400 truncate font-semibold">{action.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-350 group-hover:text-slate-550 transition" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
