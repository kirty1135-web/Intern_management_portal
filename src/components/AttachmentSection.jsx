import React, { useState } from 'react';
import { Paperclip, FileText, File, Video, Image, Download, Eye, X } from 'lucide-react';

const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['docx', 'doc'].includes(ext)) return 'docx';
  if (['pptx', 'ppt'].includes(ext)) return 'pptx';
  if (['zip', 'rar', 'tar', 'gz'].includes(ext)) return 'zip';
  return 'document';
};

const AttachmentSection = ({ task, onUpdate, readonly = false }) => {
  const [showAll, setShowAll] = useState(false);
  const maxDisplay = 3;

  // Convert old string attachments format to standard array format dynamically
  const getAttachments = () => {
    if (!task.attachments) return [];
    if (Array.isArray(task.attachments)) return task.attachments;
    // Backwards compatibility with mock strings
    return [{ name: task.attachments, type: getFileType(task.attachments), size: 1024 * 150, data: '' }];
  };

  const attachments = getAttachments();


  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            type: file.type || getFileType(file.name),
            size: file.size,
            data: event.target.result, // base64 Data URL
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((newFiles) => {
      const updatedAttachments = [...attachments, ...newFiles];
      onUpdate({ attachments: updatedAttachments });
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedAttachments = attachments.filter((_, idx) => idx !== indexToRemove);
    onUpdate({ attachments: updatedAttachments });
  };

  const getFileIcon = (file) => {
    const isBase64Image = file.data && (file.data.startsWith('data:image/') || file.type.startsWith('image/'));
    if (isBase64Image || file.type === 'image') {
      return (
        <img
          src={file.data || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><rect width="24" height="24"/></svg>'}
          alt={file.name}
          className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
        />
      );
    }

    let color = 'bg-slate-50 text-slate-500 border border-slate-100';
    if (file.type === 'pdf' || file.name.endsWith('.pdf')) {
      color = 'bg-rose-50 text-rose-500 border border-rose-100';
    } else if (file.type === 'docx' || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      color = 'bg-blue-50 text-blue-500 border border-blue-100';
    } else if (file.type === 'pptx' || file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
      color = 'bg-orange-50 text-orange-550 border border-orange-100';
    } else if (file.type === 'zip' || file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
      color = 'bg-amber-50 text-amber-600 border border-amber-100';
    } else if (file.type === 'video' || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov')) {
      color = 'bg-indigo-50 text-indigo-500 border border-indigo-100';
    }

    const extension = file.name.split('.').pop().slice(0, 3).toUpperCase();

    return (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-[9px] uppercase tracking-wider flex-shrink-0 ${color}`}>
        {extension || 'FILE'}
      </div>
    );
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    if (file.data) {
      link.href = file.data;
    } else {
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('Mock content of ' + file.name)}`;
    }
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (file) => {
    if (file.data) {
      const win = window.open();
      win.document.write(`<iframe src="${file.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      alert(`Previewing simulated for template file: ${file.name}`);
    }
  };

  const displayedAttachments = showAll ? attachments : attachments.slice(0, maxDisplay);

  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
          Deliverable Attachments ({attachments.length})
        </span>
        {!readonly && (
          <label className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer border border-orange-100 hover:border-orange-200 px-2.5 py-1 rounded-xl bg-orange-50/50 hover:bg-orange-50 transition">
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.doc,.pptx,.ppt,.zip,.rar,.tar,.png,.jpg,.jpeg,.gif,.webp,.mp4,.webm,.mov"
            />
          </label>
        )}
      </div>

      {attachments.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {displayedAttachments.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-700 truncate max-w-[180px]" title={file.name}>
                      {file.name}
                    </h5>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Template Attachment'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownload(file)}
                    className="p-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-xl text-slate-650 hover:text-slate-800 transition shadow-sm"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  
                  {(file.data || file.name.endsWith('.pdf') || file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) && (
                    <button
                      type="button"
                      onClick={() => handlePreview(file)}
                      className="p-1.5 bg-orange-50 border border-orange-100 hover:border-orange-200 text-orange-600 rounded-xl transition shadow-xs"
                      title="Preview File"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!readonly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1.5 hover:bg-rose-50 text-rose-450 hover:text-rose-600 rounded-xl transition"
                      title="Remove Attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {attachments.length > maxDisplay && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
            >
              {showAll ? 'Collapse List' : `View All Files (${attachments.length})`}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/10">
          No files attached
        </div>
      )}
    </div>
  );
};

export default AttachmentSection;
