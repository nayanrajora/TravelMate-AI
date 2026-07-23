'use client';

import React, { useState } from 'react';
import { User, Mail, Globe, Phone, Camera, Save, Lock, Trash2, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    country: user?.country || '',
    phone: '+1 (555) 234-5678',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
        phone: '+1 (555) 234-5678',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProfile) {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Please Log In</h2>
        <p className="text-slate-400">You need to be logged in to view your profile.</p>
        <a href="/login" className="px-6 py-2 rounded-full btn-primary font-bold">Log In</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-100">User Account Settings</h1>
        <p className="text-xs text-slate-400">Manage your profile info, avatar, security, and travel preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Card */}
        <div className="glass-card p-6 border border-cyan-500/20 text-center space-y-4 h-fit">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-cyan-400 shadow-xl"
            />
            <button
              onClick={() => alert("Upload custom avatar dialog triggered.")}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-400 text-slate-950 hover:scale-110 transition-transform shadow-md"
              title="Change Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">{formData.name}</h3>
            <p className="text-xs text-cyan-400 font-mono">{formData.email}</p>
          </div>

          <div className="pt-2 border-t border-cyan-500/10 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-bold">Pro Member</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-mono text-slate-300">Jan 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="md:col-span-2 glass-card p-6 border border-cyan-500/20 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Home Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Traveler Bio & Preferences</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-cyan-500/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 rounded-full btn-primary text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>

          {/* Security & Danger Zone */}
          <div className="pt-6 border-t border-cyan-500/10 space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Account Security</h4>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => alert("Password reset link sent to your registered email.")}
                className="px-4 py-2 rounded-xl glass-panel border border-cyan-500/20 text-xs font-semibold text-slate-200 hover:border-cyan-400 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-cyan-400" /> Change Password
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl glass-panel border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Account Modal Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 border border-red-500/30 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Delete Account</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete your TravelMate AI account? This action cannot be undone and will permanently remove all your saved itineraries.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full glass-panel border border-cyan-500/20 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Account deleted.");
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 rounded-full bg-red-500 text-slate-950 text-xs font-bold hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
