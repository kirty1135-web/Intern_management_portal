import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar, User, Clock, CheckCircle2 } from 'lucide-react';

const Kanban = () => {
  const { tasks, updateTask, users } = useContext(AppContext);
  const [draggedOverCol, setDraggedOverCol] = useState(null);

  const columns = [
    { title: 'Unassigned', status: 'Unassigned', border: 'border-t-slate-400', glowColor: 'rgba(148, 163, 184, 0.4)' },
    { title: 'Assigned', status: 'Assigned', border: 'border-t-blue-400', glowColor: 'rgba(59, 130, 246, 0.4)' },
    { title: 'In Progress', status: 'In Progress', border: 'border-t-amber-400', glowColor: 'rgba(245, 158, 11, 0.4)' },
    { title: 'Review', status: 'Review', border: 'border-t-purple-400', glowColor: 'rgba(139, 92, 246, 0.4)' },
    { title: 'Testing', status: 'Testing', border: 'border-t-indigo-400', glowColor: 'rgba(99, 102, 241, 0.4)' },
    { title: 'Completed', status: 'Completed', border: 'border-t-emerald-400', glowColor: 'rgba(16, 185, 129, 0.4)' },
    { title: 'Closed', status: 'Closed', border: 'border-t-rose-400', glowColor: 'rgba(239, 68, 68, 0.4)' }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDraggedOverCol(status);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { status });
    }
    setDraggedOverCol(null);
  };

  const getUserNameByEmail = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-210px)] select-none">
      {columns.map(col => {
        const colTasks = tasks.filter(t => (t.status || 'Unassigned').toLowerCase() === col.status.toLowerCase());
        const isDraggedOver = draggedOverCol === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            onDragLeave={() => setDraggedOverCol(null)}
            className={`flex-shrink-0 w-80 bg-white border border-slate-100 rounded-3xl p-4 flex flex-col h-full transition-all duration-300 border-t-4 ${col.border} ${
              isDraggedOver ? 'shadow-lg bg-slate-50/50' : 'shadow-xs'
            }`}
            style={{
              boxShadow: isDraggedOver ? `0 10px 25px -5px ${col.glowColor}` : 'none'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{col.title}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {colTasks.length === 0 ? (
                <div className="h-28 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                  Drop tickets here
                </div>
              ) : (
                colTasks.map(t => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    className="p-4 bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-2xl transition duration-300 cursor-grab active:cursor-grabbing group space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                        {t.project}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-md ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-700 leading-normal group-hover:text-orange-500 transition">
                      {t.title}
                    </h4>

                    {t.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate font-semibold text-slate-650">{getUserNameByEmail(t.assignTo)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 flex-shrink-0 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[9px] text-slate-500">{t.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Kanban;
