import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Folder, CheckCircle2, Clock, Users, ChevronDown, ChevronUp, AlertCircle, PlayCircle } from 'lucide-react';

const ProjectsList = () => {
  const { tasks, users, currentUser } = useContext(AppContext);
  const [expandedProject, setExpandedProject] = useState(null);

  const projects = [
    {
      name: 'Core API Integration',
      desc: 'Optimizing and refactoring express routers, validation layers and API security middleware tools.',
      lead: 'jane@internverse.com'
    },
    {
      name: 'User Onboarding Flow',
      desc: 'Mocking prototypes, UX wireframes and implementing interactive dashboard panels.',
      lead: 'sarah@internverse.com'
    },
    {
      name: 'Database Optimization',
      desc: 'Analyzing PostgreSQL execution profiles, indexing parameters and secondary clusters configuration.',
      lead: 'jane@internverse.com'
    }
  ];

  // Filter projects: Interns only see projects assigned to them
  const visibleProjects = projects.filter(proj => {
    if (currentUser?.role === 'intern') {
      return tasks.some(t => t.project === proj.name);
    }
    return true;
  });

  const getLeadName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  const getProjectStatus = (projTasks) => {
    if (projTasks.length === 0) return 'Active';
    const completedCount = projTasks.filter(t => t.status === 'Completed' || t.status === 'Closed').length;
    if (completedCount === projTasks.length) return 'Completed';
    
    const reviewCount = projTasks.filter(t => t.status === 'Review' || t.status === 'Testing').length;
    if (reviewCount > 0) return 'Under Review';

    return 'In Progress';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Review':
        return 'bg-purple-50 text-purple-650 border-purple-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const handleRowClick = (projName) => {
    setExpandedProject(prev => (prev === projName ? null : projName));
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Projects Progress Center</h2>
        <p className="text-xs text-slate-400 font-medium">Monitor deliverables status and track development milestones progress</p>
      </div>

      {visibleProjects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm text-slate-400">
          <Folder className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <span className="text-sm font-semibold">No assigned projects found</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {visibleProjects.map(proj => {
            const projTasks = tasks.filter(t => t.project === proj.name);
            const completedTasks = projTasks.filter(t => t.status === 'Completed' || t.status === 'Closed');
            const inProgressTasks = projTasks.filter(t => ['In Progress', 'Review', 'Testing'].includes(t.status));
            const pendingTasks = projTasks.filter(t => ['Assigned', 'Unassigned', 'Open'].includes(t.status) || !t.status);
            
            const completedCount = completedTasks.length;
            const pct = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
            const status = getProjectStatus(projTasks);
            const isExpanded = expandedProject === proj.name;

            return (
              <div key={proj.name} className="transition duration-150">
                {/* Initial Row */}
                <div
                  onClick={() => handleRowClick(proj.name)}
                  className="flex items-center justify-between px-6 py-4.5 hover:bg-slate-50/50 cursor-pointer select-none transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                      <Folder className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm text-slate-800 truncate">{proj.name}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Lead: {getLeadName(proj.lead)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-xl ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 bg-slate-50/30 border-t border-slate-50 space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-450 leading-relaxed max-w-2xl">{proj.desc}</p>
                      
                      {/* Overall progress bar */}
                      <div className="space-y-1.5 pt-2 max-w-md">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span>Overall Progress</span>
                          <span className="text-orange-500">{pct}% Completed</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                          <div
                            className="bg-orange-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Roster lists columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      {/* Completed Work */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[10px] uppercase text-emerald-600 tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed Work ({completedTasks.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {completedTasks.length === 0 ? (
                            <div className="text-[10px] text-slate-400 italic py-2">No completed tickets.</div>
                          ) : (
                            completedTasks.map(t => (
                              <div key={t.id} className="p-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 shadow-2xs">
                                {t.title}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Work Currently In Progress */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[10px] uppercase text-amber-600 tracking-wider flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5" /> In Progress ({inProgressTasks.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {inProgressTasks.length === 0 ? (
                            <div className="text-[10px] text-slate-400 italic py-2">No active tickets in progress.</div>
                          ) : (
                            inProgressTasks.map(t => (
                              <div key={t.id} className="p-2.5 bg-white border border-slate-105 rounded-xl text-[11px] font-semibold text-slate-700 shadow-2xs">
                                <div className="flex justify-between items-center gap-2">
                                  <span className="truncate">{t.title}</span>
                                  <span className="text-[9px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-bold uppercase tracking-wider">{t.status}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Pending Work */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[10px] uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Pending Work ({pendingTasks.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {pendingTasks.length === 0 ? (
                            <div className="text-[10px] text-slate-400 italic py-2">No pending tasks remaining.</div>
                          ) : (
                            pendingTasks.map(t => (
                              <div key={t.id} className="p-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-semibold text-slate-700 shadow-2xs">
                                {t.title}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ProjectsList;
