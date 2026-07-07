import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Folder, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsList = () => {
  const { tasks, users } = useContext(AppContext);
  const navigate = useNavigate();

  const projects = [
    {
      name: 'Core API Integration',
      desc: 'Optimizing and refactoring express routers, validation layers and API security middleware tools.',
      lead: 'kirty@internverse.com'
    },
    {
      name: 'User Onboarding Flow',
      desc: 'Mocking prototypes, UX wireframes and implementing interactive dashboard panels.',
      lead: 'sarah@internverse.com'
    },
    {
      name: 'Database Optimization',
      desc: 'Analyzing PostgreSQL execution profiles, indexing parameters and secondary clusters configuration.',
      lead: 'kirty@internverse.com'
    }
  ];

  const getLeadName = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? found.name : email;
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Active Projects Catalog</h2>
        <p className="text-xs text-slate-400 font-medium">Observe project rosters, leads assignments, and completion states</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(proj => {
          const projTasks = tasks.filter(t => t.project === proj.name);
          const completed = projTasks.filter(t => t.status === 'Completed').length;
          const pct = projTasks.length > 0 ? Math.round((completed / projTasks.length) * 100) : 0;

          return (
            <div key={proj.name} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow transition flex flex-col justify-between h-72">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Folder className="w-5 h-5" />
                  </div>
                  
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                    {projTasks.length} Task Tickets
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-800 leading-snug truncate">{proj.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{proj.desc}</p>
              </div>

              <div className="space-y-3.5 pt-3 border-t border-slate-55">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Overall Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Lead: {getLeadName(proj.lead)}</span>
                  <button
                    onClick={() => navigate('/dashboard/tasks')}
                    className="text-orange-500 hover:text-orange-600 font-bold inline-flex items-center gap-1"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProjectsList;
