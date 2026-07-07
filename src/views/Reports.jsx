import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Download, FileSpreadsheet, FileText, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const { tasks, users, triggerToast, defaultAvatar } = useContext(AppContext);

  const interns = users.filter(u => u.role === 'intern');

  const internPerformanceData = interns.map(i => {
    const total = tasks.filter(t => t.assignTo.toLowerCase() === i.email.toLowerCase()).length;
    const completed = tasks.filter(t => t.assignTo.toLowerCase() === i.email.toLowerCase() && t.status === 'Completed').length;
    const rawGrade = parseFloat(i.grade) || 0;
    return {
      name: i.name.split(' ')[0],
      tasks: total,
      completed: completed,
      grade: rawGrade
    };
  });

  const taskCompletionData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#f59e0b' },
    { name: 'Review', value: tasks.filter(t => t.status === 'Review').length, color: '#8b5cf6' },
    { name: 'Assigned', value: tasks.filter(t => t.status === 'Assigned').length, color: '#3b82f6' }
  ];

  const handleExportCSV = () => {
    const headers = 'Name,Email,College,Grade,Tasks Assigned,Tasks Completed\r\n';
    const rows = interns.map(i => {
      const total = tasks.filter(t => t.assignTo.toLowerCase() === i.email.toLowerCase()).length;
      const completed = tasks.filter(t => t.assignTo.toLowerCase() === i.email.toLowerCase() && t.status === 'Completed').length;
      return `"${i.name}","${i.email}","${i.college || 'N/A'}","${i.grade || '0'}","${total}","${completed}"`;
    }).join('\r\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'InternVerse_Performance_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Report CSV exported successfully!', 'success');
  };

  const handleExportPDF = () => {
    triggerToast('PDF Report compiled successfully!', 'success');
    window.print();
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="z-10 space-y-1">
          <span className="text-[10px] bg-orange-500/20 text-orange-400 font-extrabold px-2 py-0.5 rounded-md border border-orange-500/30 uppercase tracking-widest">Analytics Dashboard</span>
          <h2 className="text-xl font-black">Performance Outputs & Logs</h2>
          <p className="text-xs text-slate-400 max-w-sm">Examine final grade score summaries and export spreadsheet files.</p>
        </div>

        <div className="flex gap-2 z-10 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Download Spreadsheet
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-orange-400" /> Export PDF
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Intern Performance Output</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Roster Overview</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(241,245,249,0.8)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip />
                <Legend style={{ fontSize: 10 }} />
                <Bar dataKey="tasks" name="Tasks Allocated" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={10} />
                <Bar dataKey="completed" name="Tasks Done" fill="#10b981" radius={[3, 3, 0, 0]} barSize={10} />
                <Bar dataKey="grade" name="Evaluation (Grade)" fill="#0891b2" radius={[3, 3, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Status Proportions</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">Workspace status proportions</span>
          </div>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
            {taskCompletionData.map(stat => (
              <div key={stat.name} className="p-1 border border-slate-50 rounded-xl bg-slate-50/20">
                <span className="block truncate">{stat.name}</span>
                <span className="text-slate-800 font-extrabold">{stat.value} tickets</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Roster table details */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-55 pb-3">
          <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Roster Grade Outputs</h3>
          <Award className="w-5 h-5 text-orange-500" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Intern Name</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Tasks Count</th>
                <th className="py-3 px-4">Grade Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {interns.map(i => {
                const total = tasks.filter(t => t.assignTo.toLowerCase() === i.email.toLowerCase()).length;
                return (
                  <tr key={i.id} className="border-b border-slate-50 hover:bg-slate-50/20 transition text-slate-700">
                    <td className="py-3.5 px-4 font-bold text-slate-850 flex items-center gap-2">
                      <img
                        src={i.avatar || defaultAvatar}
                        alt={i.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-100"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
                      <span>{i.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500">{i.college || 'IIT Bombay'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600">{total} tickets</td>
                    <td className="py-3.5 px-4 font-extrabold text-orange-500">{i.grade || 'Not Graded'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reports;
