import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ChevronDown } from 'lucide-react';

const HelpSupport = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    
    setShowToast(true);
    setTicketSubject('');
    setTicketMsg('');
    setTimeout(() => setShowToast(false), 3000);
  };

  const faqs = [
    { q: 'How do I submit my completed task deliverables?', a: 'Go to the tasks list, select your active task, and check if there is an attachment field or comment option. Alternatively, submit a review request under the Approvals tab.' },
    { q: 'Can I reschedule video sync meetings?', a: 'Only mentors and admins have the scheduling options privilege. Please contact your coordinator to request changes.' },
    { q: 'What should I do if my local storage is full?', a: 'If dashboard reports fail to save, go to settings and perform an environment purge or clear browser caches.' }
  ];

  return (
    <div className="space-y-6 text-slate-800 relative">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Help & Support Desk</h2>
        <p className="text-xs text-slate-400 font-medium">Browse guide files or open a support request ticket</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* FAQs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-orange-500" /> Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">{faq.q}</h4>
                <p className="leading-relaxed text-slate-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Creator form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-orange-500" /> Open Support Ticket
          </h3>

          <form onSubmit={handleTicketSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Cannot upload file link"
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Detail Description</label>
              <textarea
                rows={4}
                required
                placeholder="Explain the error or question..."
                value={ticketMsg}
                onChange={e => setTicketMsg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition shadow-md shadow-orange-500/10 cursor-pointer"
            >
              Submit Ticket
            </button>
          </form>
        </div>

      </div>

      {/* Floating success alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 border border-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold z-50 flex items-center gap-2">
          Ticket submitted successfully! Support will reply shortly.
        </div>
      )}

    </div>
  );
};

export default HelpSupport;
