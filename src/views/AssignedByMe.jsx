import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, User, Calendar, Clock, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import AddWorkModal from '../components/AddWorkModal';

const AssignedByMe = () => {
  const { tasks, users, deleteTask, updateTask, currentUser } = useContext(AppContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks created or assigned by mentor/admin
  const assignedTasks = tasks.filter(t => {
    if (!currentUser) return false;
    // Admins see everything, Mentors see everything. Interns see nothing here
    if (currentUser.role === 'intern') return false;
    return true; 
  });

  const getUserName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  const handleUpdateDueDate = (taskId, dateStr) => {
    updateTask(taskId, { dueDate: dateStr });
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Assigned Workspace Tickets</h2>
          <p className="text-xs text-slate-400 font-medium">Observe, audit, and modify due dates of tasks assigned to cohort interns</p>
        </div>

        {currentUser && currentUser.role !== 'intern' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/10"
          >
            <Send className="w-4 h-4" /> Create Work Ticket
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Send className="w-4 h-4 text-orange-500" /> Outgoing Task Checklist
          </h3>
          <span className="text-[10px] bg-slate-150 px-2 py-0.5 rounded text-slate-500 font-bold">
            {assignedTasks.length} Tickets Active
          </span>
        </div>

        <div className="space-y-3.5">
          {assignedTasks.map(t => (
            <div key={t.id} className="p-4 border border-slate-100 bg-slate-50/20 hover:border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-wider">{t.project}</span>
                  <span className="text-xs font-black text-slate-800 truncate">{t.title}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500 flex-wrap font-semibold">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> Intern: {getUserName(t.assignTo)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Status: {t.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <span>Due:</span>
                  <input
                    type="date"
                    value={t.dueDate}
                    onChange={e => handleUpdateDueDate(t.id, e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none text-xs focus:border-orange-500 text-slate-700 font-bold"
                  />
                </div>
                
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 text-rose-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Revoke Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {assignedTasks.length === 0 && (
            <div className="text-center py-16 text-slate-400 italic">No task assignments found. Click "Create Work Ticket" to assign work.</div>
          )}
        </div>
      </div>

      <AddWorkModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

    </div>
  );
};

export default AssignedByMe;
