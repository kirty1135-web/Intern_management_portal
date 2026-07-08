import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle2, AlertCircle, FileCheck, HelpCircle, MessageSquare, CornerDownRight, XCircle } from 'lucide-react';
import AttachmentSection from '../components/AttachmentSection';

const Approvals = () => {
  const { tasks, users, updateTask, addTaskComment, currentUser, triggerToast } = useContext(AppContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedbackVal, setFeedbackVal] = useState('');

  // If the user is an intern, block access to Approvals completely
  if (currentUser && currentUser.role === 'intern') {
    return (
      <div className="p-6 text-center text-slate-500 font-semibold bg-white border border-slate-100 rounded-3xl shadow-sm">
        Access Denied: Interns do not have access to the review page.
      </div>
    );
  }

  // Tasks in 'Review' status are pending approvals (filtered by role in AppContext)
  const pendingApprovals = tasks.filter(t => t.status === 'Review');

  const getUserName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  const handleApprove = (taskId) => {
    updateTask(taskId, { status: 'Completed' });
    triggerToast('Deliverable approved successfully! Task marked Completed.', 'success');
    setSelectedTask(null);
  };

  const handleRequestRevision = (e) => {
    e.preventDefault();
    if (!selectedTask || !feedbackVal.trim()) return;

    // Send task back to In Progress
    updateTask(selectedTask.id, { status: 'In Progress' });
    
    // Add feedback comment
    addTaskComment(selectedTask.id, `Revision Request: ${feedbackVal.trim()}`);

    triggerToast('Revision requested. Task returned to In Progress.', 'warning');
    setFeedbackVal('');
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Review & Approvals</h2>
        <p className="text-xs text-slate-400 font-medium">Verify submissions, deliver feedback reviews, and sign off completed tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Submissions List */}
        <div className="lg:col-span-2 space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400">
              <FileCheck className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold">No deliverables awaiting approval check</span>
            </div>
          ) : (
            pendingApprovals.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3 cursor-pointer hover:shadow transition ${
                  selectedTask && selectedTask.id === t.id ? 'ring-2 ring-orange-500' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.project}</span>
                    <h3 className="font-extrabold text-sm text-slate-800">{t.title}</h3>
                  </div>
                  
                  <span className="px-2 py-0.5 text-[10px] font-bold text-purple-650 bg-purple-55 border border-purple-100 rounded-full">
                    Awaiting Review
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-505 flex-wrap gap-2 pt-1">
                  <span className="font-bold text-slate-600">Submitted by: {getUserName(t.assignTo)}</span>
                  <span>Due date: {t.dueDate}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Panel Inspector */}
        {selectedTask ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inspect Submission</span>
                <h4 className="font-extrabold text-sm text-slate-800">{selectedTask.title}</h4>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-xs text-slate-450 hover:text-slate-600 font-bold"
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

              {/* Attachments Section */}
              <div className="border-t border-slate-50 pt-3">
                <AttachmentSection
                  task={selectedTask}
                  onUpdate={(fields) => {
                    updateTask(selectedTask.id, fields);
                    setSelectedTask(prev => ({ ...prev, ...fields }));
                  }}
                  readonly={false}
                />
              </div>

              {/* Mentor / Admin approval tools */}
              {currentUser && currentUser.role !== 'intern' ? (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedTask.id)}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Work
                    </button>
                  </div>

                  <form onSubmit={handleRequestRevision} className="space-y-2 border-t border-slate-50 pt-3">
                    <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block">Request Revision</span>
                    <input
                      type="text"
                      required
                      placeholder="Add revision requirements..."
                      value={feedbackVal}
                      onChange={e => setFeedbackVal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 border border-rose-100 hover:border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" /> Send Revision Request
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-3.5 bg-orange-50/50 border border-orange-100 text-orange-600 rounded-xl font-semibold leading-relaxed">
                  Awaiting sign-off review check from your cohort mentor. Notifications will trigger upon changes.
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="bg-slate-100/40 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 italic">
            Select a submitted work ticket from the list to review the deliverable files, approve progress, or request revision adjustments.
          </div>
        )}

      </div>

    </div>
  );
};

export default Approvals;
