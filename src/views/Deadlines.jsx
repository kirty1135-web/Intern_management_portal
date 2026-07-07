import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const Deadlines = () => {
  const { tasks, currentUser } = useContext(AppContext);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const myTasks = tasks.filter(t => {
    if (!currentUser) return false;
    if (currentUser.role === 'intern') {
      return t.assignTo.toLowerCase() === currentUser.email.toLowerCase();
    }
    return true;
  });

  const getCountdown = (dueDateStr, status) => {
    if (status === 'Completed' || status === 'Closed') {
      return { text: 'Completed', color: 'text-emerald-500 bg-emerald-50 border-emerald-100', isOverdue: false, pctLeft: 0 };
    }

    const due = new Date(dueDateStr + 'T23:59:59');
    const diff = due.getTime() - now.getTime();

    if (diff < 0) {
      const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
      return {
        text: `Overdue by ${days === 0 ? 'Hours' : `${days} days`}`,
        color: 'text-rose-500 bg-rose-50 border-rose-100',
        isOverdue: true,
        pctLeft: 100
      };
    }

    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (daysLeft === 0) {
      return {
        text: `Due in ${hoursLeft} hours`,
        color: 'text-orange-500 bg-orange-50 border-orange-100',
        isOverdue: false,
        pctLeft: 90
      };
    }

    // Rough visual gauge: capped at 10 days max for comparison
    const pct = Math.max(0, Math.min(100, (10 - daysLeft) * 10));
    return {
      text: `${daysLeft} days, ${hoursLeft}h left`,
      color: 'text-slate-650 bg-slate-50 border-slate-100',
      isOverdue: false,
      pctLeft: pct
    };
  };

  const urgentTasks = myTasks.filter(t => {
    const countdown = getCountdown(t.dueDate, t.status);
    return countdown.isOverdue || t.priority === 'Urgent';
  });

  const activeTasks = myTasks.filter(t => {
    const countdown = getCountdown(t.dueDate, t.status);
    return !countdown.isOverdue && t.status !== 'Completed' && t.status !== 'Closed';
  });

  const completedTasks = myTasks.filter(t => t.status === 'Completed' || t.status === 'Closed');

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Deadlines & urgency gauges</h2>
        <p className="text-xs text-slate-400 font-medium">Evaluate upcoming dates with visual timers and indicators</p>
      </div>

      {/* Grid decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* Urgent Deck */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-55 pb-2">
            <h3 className="font-bold text-sm text-slate-850 flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 animate-pulse" /> Urgent & Overdue
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-rose-500 bg-rose-50 rounded-full">
              {urgentTasks.length} Active
            </span>
          </div>

          <div className="space-y-3.5">
            {urgentTasks.map(t => {
              const countdown = getCountdown(t.dueDate, t.status);
              return (
                <div key={t.id} className="p-4 border border-rose-100/50 rounded-2xl space-y-3 bg-rose-50/5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-850 truncate max-w-[60%]">{t.title}</span>
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase tracking-wider ${countdown.color}`}>
                      {countdown.text}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${countdown.pctLeft}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Due: {t.dueDate}</span>
                    <span>{t.project}</span>
                  </div>
                </div>
              );
            })}
            {urgentTasks.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-8">No urgent or overdue tasks found.</p>
            )}
          </div>
        </div>

        {/* Active Deck */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-55 pb-2">
            <h3 className="font-bold text-sm text-slate-850 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-orange-500" /> Active Countdowns
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-orange-600 bg-orange-50 rounded-full">
              {activeTasks.length} Active
            </span>
          </div>

          <div className="space-y-3.5">
            {activeTasks.map(t => {
              const countdown = getCountdown(t.dueDate, t.status);
              return (
                <div key={t.id} className="p-4 border border-slate-100 rounded-2xl space-y-3 bg-slate-50/20">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-850 truncate max-w-[60%]">{t.title}</span>
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase tracking-wider ${countdown.color}`}>
                      {countdown.text}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${countdown.pctLeft}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Due: {t.dueDate}</span>
                    <span>{t.project}</span>
                  </div>
                </div>
              );
            })}
            {activeTasks.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-8">No active countdowns.</p>
            )}
          </div>
        </div>

        {/* Completed Deck */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-55 pb-2">
            <h3 className="font-bold text-sm text-slate-850 flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Completed
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full">
              {completedTasks.length} Done
            </span>
          </div>

          <div className="space-y-3.5">
            {completedTasks.map(t => (
              <div key={t.id} className="p-4 border border-emerald-100/50 rounded-2xl space-y-3 bg-emerald-50/5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-slate-800 truncate max-w-[60%] line-through">{t.title}</span>
                  <span className="px-2 py-0.5 border border-emerald-100 text-[9px] font-bold rounded-md text-emerald-600 bg-emerald-50 uppercase tracking-wider">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Due was: {t.dueDate}</span>
                  <span>{t.project}</span>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-8">No completed deadlines found.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Deadlines;
