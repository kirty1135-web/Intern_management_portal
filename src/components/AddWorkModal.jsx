import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';

const AddWorkModal = ({ isOpen, onClose }) => {
  const { users, addTask } = useContext(AppContext);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      project: '',
      title: '',
      description: '',
      assignTo: '',
      priority: 'Medium',
      status: 'Assigned',
      dueDate: '',
      attachments: '',
      tags: '',
      estimatedHours: '',
      firstComment: ''
    }
  });

  const onSubmit = (data) => {
    const taskComments = data.firstComment.trim() 
      ? [{ sender: 'System/Assigner', text: data.firstComment, time: 'Just now' }] 
      : [];

    const taskFields = {
      project: data.project.trim() || 'Internal Development',
      title: data.title.trim(),
      description: data.description.trim(),
      assignTo: data.assignTo,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      attachments: data.attachments.trim(),
      tags: data.tags.trim() || 'Task',
      estimatedHours: data.estimatedHours.trim() || '4',
      comments: taskComments
    };

    addTask(taskFields);
    reset();
    onClose();
  };

  // Filter interns for selection, or fall back to all users
  const interns = users.filter(u => u.role === 'intern');
  const assigneesList = interns.length > 0 ? interns : users;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Work Ticket">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-slate-800">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Project / Theme
          </label>
          <input
            type="text"
            {...register('project')}
            placeholder="e.g. Core API Integration"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'Task title is required' })}
            placeholder="e.g. Optimize Database Indexes"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
          />
          {errors.title && <span className="text-xs text-red-500 mt-1">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Explain the requirements and objectives..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              {...register('assignTo', { required: 'Please select an assignee' })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            >
              <option value="">Select Assignee</option>
              {assigneesList.map(u => (
                <option key={u.email} value={u.email}>{u.name} ({u.role})</option>
              ))}
            </select>
            {errors.assignTo && <span className="text-xs text-red-500 mt-1">{errors.assignTo.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('dueDate', { required: 'Due date is required' })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            />
            {errors.dueDate && <span className="text-xs text-red-500 mt-1">{errors.dueDate.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Attachments (URL/Filename)
            </label>
            <input
              type="text"
              {...register('attachments')}
              placeholder="e.g. spec_sheet.pdf"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              {...register('estimatedHours')}
              placeholder="e.g. 8"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              placeholder="e.g. Security, React, API"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              First Comment / Note
            </label>
            <input
              type="text"
              {...register('firstComment')}
              placeholder="Add an optional initial comment..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-500 text-white font-semibold text-sm rounded-xl hover:bg-orange-600 transition"
          >
            Save Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWorkModal;
