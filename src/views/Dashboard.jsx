import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  TrendingUp, CheckCircle, Clock, AlertTriangle, Video, Users,
  UserPlus, FileCheck, HelpCircle, ChevronRight, Activity, Calendar, Settings
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

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
  const myTasks = tasks.filter(
    (t) => currentUser.role === 'intern' ? t.assignTo.toLowerCase() === currentUser.email.toLowerCase() : true
  );

  const pendingTasksCount = myTasks.filter((t) => t.status !== 'Completed' && t.status !== 'Closed').length;
  const completedTasksCount = myTasks.filter((t) => t.status === 'Completed').length;
  const upcomingMeetingsCount = meetings.length;
  const overdueTasksCount = myTasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Closed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const totalTasksCount = myTasks.length || 1;

  // --- CHART DATA ---
  const productivityData = [
    { day: 'Mon', completed: 2, estimated: 4 },
    { day: 'Tue', completed: 4, estimated: 6 },
    { day: 'Wed', completed: 6, estimated: 8 },
    { day: 'Thu', completed: 3, estimated: 5 },
    { day: 'Fri', completed: 8, estimated: 8 },
    { day: 'Sat', completed: 1, estimated: 2 },
    { day: 'Sun', completed: 0, estimated: 0 }
  ];

  const performanceHistory = [
    { month: 'Jan', rate: 70 },
    { month: 'Feb', rate: 75 },
    { month: 'Mar', rate: 82 },
    { month: 'Apr', rate: 80 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 94 }
  ];

  const projectBreakdown = [
    { name: 'Core API Integration', value: tasks.filter(t => t.project === 'Core API Integration').length, color: '#0891b2' },
    { name: 'User Onboarding Flow', value: tasks.filter(t => t.project === 'User Onboarding Flow').length, color: '#3b82f6' },
    { name: 'Database Optimization', value: tasks.filter(t => t.project === 'Database Optimization').length, color: '#10b981' }
  ];

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
        return [
          { title: 'View Assigned', desc: 'Check tasks list checklist', icon: CheckCircle, path: '/dashboard/tasks', bg: 'bg-orange-50 text-orange-600 border-orange-100' },
          { title: 'Progress Roster', desc: 'Track my profile info', icon: TrendingUp, path: '/dashboard/profile', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
          { title: 'Request Help', desc: 'Open support tickets', icon: HelpCircle, path: '/dashboard/help', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
        ];
    }
  };

  const quickActions = getQuickActions();

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
          <p className="text-xs text-slate-400 max-w-md">Manage cohort task tickets, synchronize timeline metrics, and organize video standalone reviews.</p>
        </div>

        <div className="flex gap-2 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 shadow-sm items-center z-10">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>July 7, 2026</span>
        </div>
      </div>

      {/* RETAINED ORIGINAL COMPONENT DESIGN: SVG Progress Rings */}
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
            <span className="text-[10px] text-slate-450 block mt-0.5">Active calendars syncs</span>
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

      {/* Productivity and Breakdown Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Weekly Output Analysis</h3>
              <p className="text-[10px] text-slate-400">Compares completed tasks against estimated allocations</p>
            </div>
            <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">Estimated Hours</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(241,245,249,0.8)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'rgba(8, 145, 178, 0.03)' }} />
                <Bar dataKey="completed" name="Completed Hours" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="estimated" name="Estimated Hours" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-80 lg:h-auto">
          <div>
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Workspace Tasks Split</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">By Assigned Projects</span>
          </div>
          
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {projectBreakdown.map(proj => (
              <div key={proj.name} className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-2 truncate max-w-[80%]">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }} />
                  {proj.name}
                </span>
                <span className="font-bold text-slate-800">{proj.value} tasks</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Roster Output Trend and Operations Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Area Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Monthly Workspace Velocity</h3>
              <p className="text-[10px] text-slate-400">Tracking progress output trends on cohort batches</p>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Growth Index</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrangeGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(241,245,249,0.8)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" name="Productivity Rate" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorOrangeGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations cards */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Console Operations</h3>
            <p className="text-[10px] text-slate-400 leading-normal">Fast pathways mapped for your workspace role</p>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center mt-4">
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
                    <p className="text-[9px] text-slate-400 truncate">{action.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity logs section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Workspace Log Audit</h3>
          <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Live timeline</span>
        </div>
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {timeline.slice(0, 4).map((log) => (
            <div key={log.id} className="flex gap-4 items-start text-xs text-slate-650">
              <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 leading-normal">{log.text}</p>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
