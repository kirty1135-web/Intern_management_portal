import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Activity as ActivityIcon, Clock, ChevronRight } from 'lucide-react';

const ActivityLog = () => {
  const { timeline, currentUser, users } = useContext(AppContext);

  // Filtered timeline logs (Requirement 15)
  const filteredTimeline = timeline.filter(log => {
    if (!currentUser) return false;
    if (currentUser.role === 'intern') {
      return log.targetEmail?.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (currentUser.role === 'mentor') {
      const myInternEmails = users.filter(u => u.mentorEmail === currentUser.email).map(u => u.email.toLowerCase());
      return !log.targetEmail || myInternEmails.includes(log.targetEmail.toLowerCase()) || log.text.includes(currentUser.name);
    }
    return true; // Admin sees all
  });

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Workspace Activity Audit</h2>
        <p className="text-xs text-slate-400 font-medium">Observe system logs, task creation, and profile edits</p>
      </div>

      {/* Timeline container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <ActivityIcon className="w-4 h-4 text-orange-500" /> Audit Log Entries
          </h3>
          <span className="text-[10px] bg-slate-150 px-2 py-0.5 rounded text-slate-500 font-bold">Live Status</span>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-100 pl-1">
          {filteredTimeline.map((log) => (
            <div key={log.id} className="relative flex gap-5 items-start text-xs text-slate-650 pl-6">
              {/* Dot */}
              <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              </div>

              <div className="flex-1 min-w-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-1 hover:border-slate-200 transition">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1 flex-wrap gap-2">
                  <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{log.type || 'Activity'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {log.time}</span>
                </div>
                <p className="font-semibold text-slate-700 leading-normal">{log.text}</p>
              </div>
            </div>
          ))}

          {filteredTimeline.length === 0 && (
            <div className="text-center py-12 text-slate-400 italic">No workspace logs recorded.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ActivityLog;
