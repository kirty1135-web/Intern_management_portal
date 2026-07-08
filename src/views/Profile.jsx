import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useForm } from 'react-hook-form';
import { Camera, CheckCircle, Mail, User, Shield } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, triggerToast, defaultAvatar } = useContext(AppContext);
  const [photoPreview, setPhotoPreview] = useState(currentUser?.avatar || defaultAvatar);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || 'intern'
    }
  });

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        callback(dataUrl);
      };
    };
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('Image is too large. Max 5MB allowed.', 'error');
        return;
      }
      compressImage(file, (dataUrl) => {
        setPhotoPreview(dataUrl);
        updateProfile({ avatar: dataUrl });
      });
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(defaultAvatar);
    updateProfile({ avatar: '' });
  };

  const onProfileSave = (data) => {
    updateProfile({
      name: data.name
    });
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">My Profile</h2>
        <p className="text-xs text-slate-400 font-medium">Manage your basic workspace credentials</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Avatar Photo Selection */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-28 h-28 rounded-full border-4 border-slate-50 bg-slate-50 overflow-hidden group cursor-pointer shadow-sm">
            <img
              src={photoPreview}
              alt="Profile Avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2 text-xs">
            <label className="px-4 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer text-center">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-1.5 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
            </label>
            <input
              type="text"
              required
              {...register('name')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              disabled
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-450 text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" /> Account Role
            </label>
            <input
              type="text"
              disabled
              {...register('role')}
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-450 text-xs cursor-not-allowed font-bold uppercase tracking-widest"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default Profile;
