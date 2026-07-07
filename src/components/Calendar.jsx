import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, Video, Bell, Plus, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import AddWorkModal from './AddWorkModal';

const CalendarView = () => {
  const { tasks, meetings, scheduleMeeting, triggerToast } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [showAddWork, setShowAddWork] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Quick scheduler states
  const [meetTitle, setMeetTitle] = useState('');
  const [meetTime, setMeetTime] = useState('10:00 AM');
  const [meetDesc, setMeetDesc] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const getCalendarDays = () => {
    const days = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthTotalDays - i);
      days.push({ dayNum: prevMonthTotalDays - i, currentMonth: false, date: dayDate });
    }
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(year, month, i);
      days.push({ dayNum: i, currentMonth: true, date: dayDate });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const dayDate = new Date(year, month + 1, i);
      days.push({ dayNum: i, currentMonth: false, date: dayDate });
    }
    return days;
  };

  const getDayString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayEvents = (dateStr) => {
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const dayMeets = meetings.filter(m => m.date === dateStr);
    return { dayTasks, dayMeets };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const saveQuickMeeting = (e) => {
    e.preventDefault();
    if (!meetTitle.trim()) return;

    scheduleMeeting({
      title: meetTitle.trim(),
      description: meetDesc.trim(),
      date: selectedDate,
      time: meetTime,
      joinLink: 'https://meet.google.com/meet-link-' + Math.floor(Math.random() * 1000)
    });

    setMeetTitle('');
    setMeetDesc('');
    setShowMeetingModal(false);
  };

  const { dayTasks: selectedTasks, dayMeets: selectedMeets } = getDayEvents(selectedDate);

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Split Agenda Scheduler</h2>
        <p className="text-xs text-slate-400 font-medium">Select dates on the grid to inspect and manage schedules in the right deck panel</p>
      </div>

      {/* Two-Panel Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Month Grid Selector Card (span 7) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {daysOfWeek.map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {getCalendarDays().map((day, idx) => {
              const dateStr = getDayString(day.date);
              const { dayTasks, dayMeets } = getDayEvents(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === getDayString(new Date());

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-11 sm:h-12 border rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition select-none ${
                    day.currentMonth ? 'border-slate-50 hover:border-orange-200' : 'border-slate-50/20 opacity-30'
                  } ${isSelected ? 'ring-2 ring-orange-500 bg-orange-50/5' : ''} ${isToday ? 'bg-orange-500/5 text-orange-600 font-bold' : ''}`}
                >
                  <span className="text-xs font-bold">{day.dayNum}</span>
                  
                  {/* Indicators dots */}
                  <div className="flex gap-0.5 mt-1 absolute bottom-1.5">
                    {dayTasks.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    {dayMeets.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Date Agenda Details Deck (span 5) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1 border-b border-slate-50 pb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Schedule Log</span>
            <h3 className="font-extrabold text-sm text-slate-800">
              Agenda for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>

          {/* List scrollable container */}
          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-72">
            {selectedTasks.length === 0 && selectedMeets.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs italic bg-slate-50/20">
                No events scheduled for this date.
              </div>
            ) : (
              <>
                {selectedTasks.map(t => (
                  <div key={t.id} className="p-3.5 border border-slate-100 rounded-2xl bg-blue-50/10 space-y-1">
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">Task Deadline</span>
                    <h4 className="font-bold text-xs text-slate-700">{t.title}</h4>
                    <p className="text-[10px] text-slate-400">Project: {t.project} &bull; Est: {t.estimatedHours}h</p>
                  </div>
                ))}
                {selectedMeets.map(m => (
                  <div key={m.id} className="p-3.5 border border-slate-100 rounded-2xl bg-orange-50/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">Sync Call</span>
                      <span className="text-[10px] font-bold text-orange-500">{m.time}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-700">{m.title}</h4>
                    <a href={m.joinLink} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-orange-600 hover:underline inline-block">
                      Join Google Meet
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Creation Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => setShowAddWork(true)}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Task
            </button>
            <button
              onClick={() => setShowMeetingModal(true)}
              className="flex-1 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-orange-500" /> Meeting
            </button>
          </div>
        </div>

      </div>

      <AddWorkModal isOpen={showAddWork} onClose={() => setShowAddWork(false)} />

      {/* Quick Meeting Scheduler Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md p-6 shadow-xl space-y-4 text-slate-800">
            <h3 className="font-bold text-sm tracking-tight text-slate-800">Schedule Video Sync</h3>
            <form onSubmit={saveQuickMeeting} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Standup Review"
                  value={meetTitle}
                  onChange={e => setMeetTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={meetTime}
                    onChange={e => setMeetTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    disabled
                    value={selectedDate}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-450 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Agenda Description</label>
                <textarea
                  rows={2}
                  placeholder="Goals, agenda, checklist..."
                  value={meetDesc}
                  onChange={e => setMeetDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-xs transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarView;
