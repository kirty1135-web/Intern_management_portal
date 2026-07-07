import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Video, Calendar, Clock, Link, Plus, Users, CheckCircle2 } from 'lucide-react';

const Meetings = () => {
  const { meetings, scheduleMeeting, users, currentUser } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [meetTitle, setMeetTitle] = useState('');
  const [meetTime, setMeetTime] = useState('10:00 AM');
  const [meetDate, setMeetDate] = useState('');
  const [meetDesc, setMeetDesc] = useState('');

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!meetTitle.trim() || !meetDate || !meetTime) return;

    scheduleMeeting({
      title: meetTitle.trim(),
      description: meetDesc.trim(),
      date: meetDate,
      time: meetTime,
      joinLink: 'https://meet.google.com/meet-sync-' + Math.floor(Math.random() * 1000)
    });

    setMeetTitle('');
    setMeetDesc('');
    setMeetDate('');
    setShowForm(false);
  };

  const getHostName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Video Sync Meetings</h2>
          <p className="text-xs text-slate-400 font-medium">Coordinate standups, reviews, and mentor onboarding calls</p>
        </div>

        {currentUser && currentUser.role !== 'intern' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/10"
          >
            <Plus className="w-4 h-4" /> Schedule Sync
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Meetings List */}
        <div className="lg:col-span-2 space-y-4">
          {meetings.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400">
              <Video className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold">No sync calls scheduled on calendar</span>
            </div>
          ) : (
            meetings.map(meet => (
              <div key={meet.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 hover:shadow transition">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">{meet.title}</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                      Hosted by: <span className="text-orange-500 font-bold">{getHostName(meet.host)}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" /> {meet.date}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-orange-500" /> {meet.time}
                    </span>
                  </div>
                </div>

                {meet.description && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {meet.description}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">Supports up to 50 active workspace members</span>
                  
                  <a
                    href={meet.joinLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" /> Join Google Meet
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Schedule form */}
        {showForm && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-orange-500" /> Host New Call
            </h3>

            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Cohort Review Sync"
                  value={meetTitle}
                  onChange={e => setMeetTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={meetTime}
                    onChange={e => setMeetTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={meetDate}
                    onChange={e => setMeetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Agenda Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe standup objectives, specs review items..."
                  value={meetDesc}
                  onChange={e => setMeetDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition shadow-md shadow-orange-500/10 cursor-pointer"
              >
                Schedule Video Call
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};

export default Meetings;
