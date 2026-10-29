import React, { useState, useRef } from 'react';
import { AuthUser } from '../types';
import { Icon } from './Icons';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSave: (updatedUser: AuthUser) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
}) => {
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState(currentUser.name || '');
  const [identifier, setIdentifier] = useState(currentUser.identifier || '');
  const [department, setDepartment] = useState(currentUser.department || 'Department of Computer Engineering');
  const [bio, setBio] = useState(
    currentUser.bio ||
      (currentUser.role === 'student'
        ? '3rd Year Undergraduate Candidate'
        : currentUser.role === 'lecturer'
        ? 'Senior Lecturer & Course Module Coordinator'
        : 'System & Examination Administrator')
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentUser.avatarUrl);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 2MB. Please upload a smaller image.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updatedUser: AuthUser = {
        ...currentUser,
        name: name.trim(),
        identifier: currentUser.identifier || (currentUser.role === 'admin' ? 'ADM-001' : currentUser.role === 'lecturer' ? 'LEC-4307' : 'EG/2021/1001'),
        department: department.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl || undefined,
      };

      onSave(updatedUser);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg card liquid-glass border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(124, 58, 237, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono mb-2 bg-violet-500/15 border border-violet-500/30 text-violet-300">
            <Icon.Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile & Identity Settings</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Edit Your Profile</h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your profile photo, candidate credentials, and department specialization.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <Icon.AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload Section */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-violet-500/50 shadow-lg flex items-center justify-center bg-slate-800 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload new photo"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full gradient-violet flex items-center justify-center text-2xl font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Hover overlay with Camera Icon */}
                <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white">
                  <Icon.Camera className="w-5 h-5 text-violet-300" />
                  <span className="text-[10px] font-semibold">Change</span>
                </div>
              </div>

              {/* Little badge indicator */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-md hover:bg-violet-500 transition-colors"
                title="Upload Photo"
              >
                <Icon.Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs font-semibold text-white mb-1">Profile Photo</div>
              <p className="text-[11px] text-slate-400 mb-3">
                Upload a professional photo (JPG, PNG or WEBP up to 2MB).
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Icon.Upload className="w-3.5 h-3.5 text-violet-300" />
                  <span>Upload File</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Icon.Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Avatar Presets */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Or Choose an Academic Avatar Preset
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:scale-105 ${
                    avatarUrl === url
                      ? 'border-violet-500 ring-2 ring-violet-500/50 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              FULL NAME <span className="text-violet-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-all font-sans"
              placeholder="e.g. Ravindu Saranga"
            />
          </div>

          {/* Registration / Identification ID (Permanent & Locked) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-medium text-slate-400">
                  {currentUser.role === 'student' ? 'REGISTRATION / STUDENT ID' : 'STAFF ID'}
                </label>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  🔒 Locked
                </span>
              </div>
              <div className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono flex items-center justify-between cursor-not-allowed select-none">
                <span className="font-bold text-violet-300">
                  {currentUser.identifier || (currentUser.role === 'admin' ? 'ADM-001' : currentUser.role === 'lecturer' ? 'LEC-4307' : 'EG/2021/1001')}
                </span>
                <span className="text-[10px] text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10 font-sans">
                  System Assigned
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-1">
                Institutional ID assigned at registration and cannot be modified.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
                SYSTEM ROLE (FIXED)
              </label>
              <div className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 capitalize flex items-center justify-between font-mono">
                <span>{currentUser.role}</span>
                <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 font-bold">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-1">
                Access tier determined by university credential rubric.
              </p>
            </div>
          </div>

          {/* 2-Factor Authentication (2FA) Security Status */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Icon.Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-200">
                  Two-Factor Authentication (2FA)
                </div>
                <div className="text-[11px] text-emerald-400/80 font-sans">
                  Active • OTP verification secured with credential pairing
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Enabled
            </span>
          </div>

          {/* Department / Faculty */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              FACULTY / DEPARTMENT
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-all"
              placeholder="e.g. Faculty of Engineering, Department of Electrical & Computer Engineering"
            />
          </div>

          {/* Bio / Specialization */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              BIO / ACADEMIC SPECIALIZATION
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 transition-all resize-none"
              placeholder="Brief note about your academic focus or module specialization..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary py-2 px-6 text-xs font-semibold glow-violet flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Icon.RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Icon.CheckCircle className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
