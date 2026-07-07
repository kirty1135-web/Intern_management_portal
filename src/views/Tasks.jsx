import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Calendar, User, Clock, Trash2, MessageSquare, AlertCircle, Plus, Send } from 'lucide-react';
import AddWorkModal from '../components/AddWorkModal';

const Tasks = () => {
  const { tasks, users, deleteTask, addTaskComment, updateTask, currentUser } = useContext(AppContext);
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter tasks based on logged in user role & inputs
  const myTasks = tasks.filter(t => {
    if (!currentUser) return false;
    // Interns only see their assigned tasks
    if (currentUser.role === 'intern') {
      return t.assignTo.toLowerCase() === currentUser.email.toLowerCase();
    }
    // Mentors and Admins see everything
    return true;
  });

  const filteredTasks = myTasks.filter(t => {
    const query = searchVal.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(query) || t.project.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getUserName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Closed': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Review': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;
    addTaskComment(selectedTask.id, newCommentText.trim());
    
    // Refresh selectedTask comments in sidebar
    setSelectedTask(prev => ({
      ...prev,
      comments: [...(prev.comments || []), { sender: currentUser.name, text: newCommentText.trim(), time: 'Just now' }]
    }));
    setNewCommentText('');
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Workspace Tasks Checklist</h2>
          <p className="text-xs text-slate-400 font-medium">Manage deliverables, assignees, and review pipelines</p>
        </div>
        
        {currentUser && currentUser.role !== 'intern' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/10"
          >
            <Plus className="w-4 h-4" /> Create Work Ticket
          </button>
        )}
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, projects..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-orange-500 text-sm rounded-xl outline-none text-slate-800 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-orange-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Priority</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-orange-500 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Main Roster Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold">No work tickets match the filter inputs</span>
            </div>
          ) : (
            filteredTasks.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`p-4 bg-white border rounded-2xl shadow-sm hover:shadow transition flex justify-between items-center gap-4 cursor-pointer ${
                  selectedTask && selectedTask.id === t.id ? 'ring-2 ring-orange-500' : 'border-slate-100'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.project}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 truncate">{t.title}</h3>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {getUserName(t.assignTo)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-450" /> {t.dueDate}
                    </span>
                    {t.estimatedHours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-450" /> {t.estimatedHours} Hours
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                    <MessageSquare className="w-3.5 h-3.5" /> {(t.comments || []).length}
                  </div>
                  {currentUser && currentUser.role !== 'intern' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(t.id);
                        if (selectedTask && selectedTask.id === t.id) setSelectedTask(null);
                      }}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Details / Evaluation Inspector */}
        {selectedTask ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{selectedTask.project}</span>
                <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{selectedTask.title}</h4>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block">Description</span>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                  {selectedTask.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block mb-1">Assignee</span>
                  <span className="font-bold text-slate-700">{getUserName(selectedTask.assignTo)}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block mb-1">Status Options</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {selectedTask.attachments && (
                <div>
                  <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block mb-1">Deliverable Files</span>
                  <a
                    href={selectedTask.attachments}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-orange-600 hover:underline inline-flex items-center gap-1.5"
                  >
                    Open Submission Link / Specs
                  </a>
                </div>
              )}

              {/* Task Comments Threads */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h5 className="font-bold text-[10px] uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" /> Collaboration Thread
                </h5>
                
                <div className="space-y-3.5 max-h-48 overflow-y-auto">
                  {(selectedTask.comments || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2">No comments posted yet.</p>
                  ) : (
                    (selectedTask.comments || []).map((c, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span className="text-slate-600">{c.sender}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="bg-slate-100/50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 leading-normal">
                          {c.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={submitComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type comments, review edits..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-slate-100/40 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
            Select a task ticket to inspect specs, modify status, and log collaborative feedback comments.
          </div>
        )}

      </div>

      <AddWorkModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

    </div>
  );
};

export default Tasks;
