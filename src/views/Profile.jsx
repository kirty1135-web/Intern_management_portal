import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useForm } from 'react-hook-form';
import { Camera, User, Mail, Phone, GraduationCap, Code, FileText, Link, Lock, CheckCircle, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, triggerToast, defaultAvatar } = useContext(AppContext);
  const [photoPreview, setPhotoPreview] = useState(currentUser?.avatar || defaultAvatar);
  const [tfaEnabled, setTfaEnabled] = useState(currentUser?.twoFactorEnabled || false);
  const [activeTab, setActiveTab] = useState('general'); // general, academic, social, security

  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      college: currentUser?.college || '',
      branch: currentUser?.branch || '',
      skills: currentUser?.skills || '',
      bio: currentUser?.bio || '',
      github: currentUser?.github || '',
      linkedin: currentUser?.linkedin || ''
    }
  });

  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

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
      name: data.name,
      phone: data.phone,
      college: data.college,
      branch: data.branch,
      skills: data.skills,
      bio: data.bio,
      github: data.github,
      linkedin: data.linkedin
    });
  };

  const onPasswordSave = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      triggerToast('New passwords do not match.', 'error');
      return;
    }
    if (currentUser.password !== data.currPassword) {
      triggerToast('Current password is incorrect.', 'error');
      return;
    }
    updateProfile({ password: data.newPassword });
    resetPassword();
  };

  const toggleTfa = () => {
    const nextState = !tfaEnabled;
    setTfaEnabled(nextState);
    updateProfile({ twoFactorEnabled: nextState });
    triggerToast(
      nextState ? 'Two-Factor Authentication activated!' : 'Two-Factor Authentication deactivated.',
      nextState ? 'success' : 'warning'
    );
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'academic', label: 'Academic Credentials', icon: GraduationCap },
    { id: 'social', label: 'Social & Repos', icon: Link },
    { id: 'security', label: 'Access Security', icon: Lock }
  ];

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800">My Workspace Account</h2>
        <p className="text-xs text-slate-400 font-medium">Configure and inspect user profiles and console security parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Avatar & Tab Selector Pill Card (span 4) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest align-self-start">User Profile Photo</span>
            
            <div className="relative w-28 h-28 rounded-full border-4 border-slate-50 bg-slate-50 overflow-hidden group cursor-pointer">
              <img
                src={photoPreview}
                alt="Profile Preview"
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

            <div className="flex gap-2 w-full text-xs">
              <label className="flex-1 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer text-center">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleRemovePhoto}
                className="flex-1 py-1.5 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Tab Selector Links */}
          <div className="flex flex-col gap-1 pt-4 border-t border-slate-100">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition ${
                  activeTab === t.id ? 'bg-orange-500/5 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <t.icon className="w-4.5 h-4.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tab Forms Sheets (span 8) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs lg:col-span-8 flex flex-col justify-between">
          <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-6 flex-1 flex flex-col justify-between">
            
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2">General Roster Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      {...regProfile('name')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      {...regProfile('email')}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-450 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      {...regProfile('phone')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Short Profile Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your background and expertise..."
                    {...regProfile('bio')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2">Academic & Tech Credentials</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">College / University</label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Delhi"
                      {...regProfile('college')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Branch / Major</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      {...regProfile('branch')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Skills tag-list (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js, Express, React"
                    {...regProfile('skills')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm tracking-tight text-slate-800 border-b border-slate-50 pb-2">Web Links & Code Repos</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">GitHub Account URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/profile"
                      {...regProfile('github')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">LinkedIn Account Profile</label>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com/in/profile"
                      {...regProfile('linkedin')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* 2FA Section */}
                <div className="p-4 bg-orange-500/5 border border-orange-100 rounded-2xl flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-orange-500" /> Multi-Factor Security Checks
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Require secondary code logins on other browsers</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTfa}
                    className={`w-11 h-6 rounded-full transition-colors relative outline-none flex items-center ${
                      tfaEnabled ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm absolute ${
                      tfaEnabled ? 'transform translate-x-6' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Password update form */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5"><Lock className="w-4.5 h-4.5" /> Modify Password</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => {}}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 text-xs"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => triggerToast('Password update simulated successfully.', 'success')}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Update Password key
                  </button>
                </div>

              </div>
            )}

            {/* Save trigger */}
            {activeTab !== 'security' && (
              <div className="pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Save Profile Details
                </button>
              </div>
            )}

          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
