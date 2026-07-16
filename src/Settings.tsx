import { useState, useEffect, useRef } from 'react';
import { Camera, Save, Loader2, RefreshCw, User, Lock, Bell, Moon, LogOut, Plus, Trash2, Video, AlertTriangle, ShieldAlert, XCircle } from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useAuth, type NotificationPreferences } from './contexts/AuthContext';
import { requestNotificationPermission, getNotificationPermission } from './lib/pushNotifications';

export function Settings() {
  const { user, updateUser, logout, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Danger Zone state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    about: '',
    image: '',
    email: '',
    specializations: [] as { name: string; price: number }[]
  });/* State for new specialization input */
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecPrice, setNewSpecPrice] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'expertise'>('details');
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'danger'>('profile');
  
  // Default notification preferences
  const defaultPrefs: NotificationPreferences = {
    booking: true,
    message: true,
    reply: true,
    system: true,
    consultation: true,
    pushEnabled: false,
  };

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(defaultPrefs);

  // Load user's notification preferences
  useEffect(() => {
    if (user) {
      setNotificationPrefs({ ...defaultPrefs, ...user.notificationPreferences });
    }
  }, [user]);

  // Handle notification preference change
  const handlePrefChange = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
  };

  // Save notification preferences
  const handleSaveNotificationPrefs = async () => {
    setLoading(true);
    try {
      await updateUser({ notificationPreferences: notificationPrefs });
      setSuccessMessage('Notification preferences saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save preferences');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Security
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Appearance
  const [darkMode, setDarkMode] = useState(false);

  const techSpecializations = [
    'Frontend Development',
    'Backend Development',
    'Fullstack Development',
    'Mobile Development',
    'DevOps & Cloud',
    'Data Science & AI',
    'Cybersecurity',
    'UI/UX Design',
    'Product Management',
    'Blockchain / Web3',
    'Other'
  ];

  /* Load user data into form on mount or user change */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        about: user.about || '',
        image: user.image || '',
        email: user.email || '',
        specializations: user.specializations || []
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSpecialization = () => {
    if (!newSpecName || !newSpecPrice) return;
    
    setFormData(prev => ({
        ...prev,
        specializations: [...(prev.specializations || []), { name: newSpecName, price: Number(newSpecPrice) }]
    }));
    setNewSpecName('');
    setNewSpecPrice('');
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
        ...prev,
        specializations: (prev.specializations || []).filter((_, i) => i !== index)
    }));
  };

  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setFormData({ ...formData, image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setErrorMessage("Image too large. Please upload an image under 2MB.");
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateUser({
        name: formData.name,
        title: formData.title,
        about: formData.about,
        image: formData.image,
        specializations: formData.specializations
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to update profile', error);
      setErrorMessage(error.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 px-4 md:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar / Tabs */}
          <div className="md:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeSection === 'profile'
                  ? 'bg-white dark:bg-[#1a2e22] text-primary border border-primary/20 shadow-sm'
                  : 'hover:bg-white dark:hover:bg-[#1a2e22] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setActiveSection('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeSection === 'notifications'
                  ? 'bg-white dark:bg-[#1a2e22] text-primary border border-primary/20 shadow-sm'
                  : 'hover:bg-white dark:hover:bg-[#1a2e22] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
             <button 
               onClick={() => setActiveSection('security')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                 activeSection === 'security'
                   ? 'bg-white dark:bg-[#1a2e22] text-primary border border-primary/20 shadow-sm'
                   : 'hover:bg-white dark:hover:bg-[#1a2e22] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
               }`}
             >
              <Lock className="w-5 h-5" />
              <span>Security</span>
            </button>
             <button 
               onClick={() => setActiveSection('appearance')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                 activeSection === 'appearance'
                   ? 'bg-white dark:bg-[#1a2e22] text-primary border border-primary/20 shadow-sm'
                   : 'hover:bg-white dark:hover:bg-[#1a2e22] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
               }`}
             >
              <Moon className="w-5 h-5" />
              <span>Appearance</span>
            </button>
             <button 
               onClick={() => setActiveSection('danger')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                 activeSection === 'danger'
                   ? 'bg-white dark:bg-[#1a2e22] text-red-600 border border-red-200 shadow-sm'
                   : 'hover:bg-white dark:hover:bg-[#1a2e22] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
               }`}
             >
              <ShieldAlert className="w-5 h-5" />
              <span>Danger Zone</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-medium mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9">
            <div className="bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <>
                  {/* Internal Tabs for Profile */}
                  <div className="flex border-b border-gray-100 dark:border-white/5">
                    <button 
                      onClick={() => setActiveTab('details')}
                      className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      Basic Details
                    </button>
                    {user?.role === 'mentor' && (
                      <button 
                        onClick={() => setActiveTab('expertise')}
                         className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'expertise' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                      >
                        Expertise & Pricing
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="p-6 md:p-8">
                  {successMessage && (
                    <div className="mb-4 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold rounded-xl border border-green-200 dark:border-green-500/30">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mb-4 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold rounded-xl border border-red-200 dark:border-red-500/30">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                  </div>

                  <div className="space-y-6">
                    {/* Push Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Browser Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (!notificationPrefs.pushEnabled) {
                            const permission = await requestNotificationPermission();
                            if (permission === 'granted') {
                              handlePrefChange('pushEnabled', true);
                            }
                          } else {
                            handlePrefChange('pushEnabled', false);
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.pushEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-white/10 my-6"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Activity Alerts</h3>

                    {/* Booking Alerts */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Booking Alerts</p>
                        <p className="text-sm text-gray-500">New session bookings and updates</p>
                      </div>
                      <button
                        onClick={() => handlePrefChange('booking', !notificationPrefs.booking)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.booking ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.booking ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Message Alerts */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Message Alerts</p>
                        <p className="text-sm text-gray-500">New direct messages</p>
                      </div>
                      <button
                        onClick={() => handlePrefChange('message', !notificationPrefs.message)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.message ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.message ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Forum Replies */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Forum Replies</p>
                        <p className="text-sm text-gray-500">Replies to your forum posts</p>
                      </div>
                      <button
                        onClick={() => handlePrefChange('reply', !notificationPrefs.reply)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.reply ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.reply ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Consultation Alerts */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Consultation Alerts</p>
                        <p className="text-sm text-gray-500">Consultation session reminders</p>
                      </div>
                      <button
                        onClick={() => handlePrefChange('consultation', !notificationPrefs.consultation)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.consultation ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.consultation ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* System Updates */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">System Updates</p>
                        <p className="text-sm text-gray-500">Platform news and feature updates</p>
                      </div>
                      <button
                        onClick={() => handlePrefChange('system', !notificationPrefs.system)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationPrefs.system ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationPrefs.system ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveNotificationPrefs}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-900/10 flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security Settings</h2>
                    <p className="text-sm text-gray-500">Manage your password and account security</p>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      setErrorMessage('');
                      setSuccessMessage('');

                      // Validation
                    if (!passwords.current || !passwords.new || !passwords.confirm) {
                        setErrorMessage('All password fields are required');
                        setLoading(false);
                        return;
                    }

                    if (passwords.new.length < 8) {
                        setErrorMessage('New password must be at least 8 characters');
                        setLoading(false);
                        return;
                    }

                    if (passwords.new === passwords.current) {
                        setErrorMessage('New password must be different from current password');
                        setLoading(false);
                        return;
                    }

                    if (passwords.new !== passwords.confirm) {
                        setErrorMessage('Passwords do not match');
                        setLoading(false);
                        return;
                    }

                      try {
                        await changePassword(passwords.current, passwords.new);
                        setSuccessMessage('Password updated successfully!');
                        setPasswords({ current: '', new: '', confirm: '' });
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (error: any) {
                        setErrorMessage(error.message || 'Failed to update password');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="space-y-6 max-w-xl"
                  >
                    {successMessage && (
                      <div className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-xl border border-green-200 dark:border-green-500/30">
                        ✓ {successMessage}
                      </div>
                    )}

                    {errorMessage && (
                      <div className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-500/30">
                        ✕ {errorMessage}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                        placeholder="Enter current password"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                        placeholder="Enter new password"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters with numbers and symbols</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                        placeholder="Confirm new password"
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Management</h3>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Active Sessions</p>
                          <p className="text-sm text-gray-500">You're currently signed in on this device</p>
                        </div>
                        <button 
                          onClick={logout}
                          className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance Settings</h2>
                    <p className="text-sm text-gray-500">Customize how MentorMinds looks</p>
                  </div>

                  <div className="space-y-6">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-100 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 dark:from-yellow-400 dark:to-yellow-600 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-white dark:text-gray-900" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Dark Mode</p>
                          <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDarkMode(!darkMode);
                          document.documentElement.classList.toggle('dark');
                        }}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> Theme preferences are saved to your browser. You can also use your system's theme preference.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Section */}
              {activeSection === 'danger' && (
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Danger Zone</h2>
                    <p className="text-sm text-gray-500">Irreversible account actions</p>
                  </div>

                  <div className="space-y-4">
                    {/* Delete Account */}
                    <div className="p-6 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                          >
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Content (existing form) - Only show when profile is active */}
              {activeSection === 'profile' && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                      <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                              {activeTab === 'details' ? 'Public Profile' : 'Expertise & Pricing'}
                          </h2>
                          <p className="text-sm text-gray-500">
                              {activeTab === 'details' ? 'This information will be displayed publicly.' : 'Manage your specializations and hourly rates.'}
                          </p>
                      </div>
                      {successMessage && (
                          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold rounded-lg animate-in fade-in slide-in-from-right-4">
                              {successMessage}
                          </div>
                      )}
                      {errorMessage && (
                          <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold rounded-lg animate-in fade-in slide-in-from-right-4">
                              {errorMessage}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {(activeTab === 'details' || user?.role !== 'mentor') ? (
                        <>
                            {/* Avatar Section */}
                            <div className="flex items-start gap-6 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 bg-cover bg-center border-4 border-white dark:border-[#1a2e22] shadow-lg ring-1 ring-gray-200 dark:ring-white/10" style={{ backgroundImage: `url('${formData.image}')` }}></div>
                                    <button 
                                        type="button" 
                                        onClick={handleRandomizeAvatar}
                                        className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-[#1c2e24] shadow-md border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors"
                                        title="Generate New Avatar"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-1 pt-2">
                                    <h3 className="font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                                    <p className="text-sm text-gray-500 max-w-sm">
                                        We support PNGs, JPGS, and GIFs. You can also paste an image URL directly or randomize it.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        {/* Hidden File Input */}
                                        <input 
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Camera className="w-4 h-4" />
                                            Upload Photo
                                        </button>
                                        <input 
                                            type="text"
                                            name="image"
                                            value={formData.image?.startsWith('data:') ? '' : formData.image}
                                            onChange={handleChange}
                                            placeholder={formData.image?.startsWith('data:') ? "Image uploaded from device" : "Or paste Image URL..."}
                                            className="text-sm border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 bg-gray-50 dark:bg-white/5 w-full max-w-xs focus:ring-1 focus:ring-primary outline-none dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white font-medium" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Lock className="w-4 h-4" />
                                            </span>
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                disabled
                                                className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent px-4 py-2.5 pl-10 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {user?.role === 'mentor' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Professional Title</label>
                                        <input 
                                            type="text" 
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">About You</label>
                                    <textarea 
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none dark:text-white"
                                        placeholder="Tell us about your experience..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-right">0 / 500 characters</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Expertise & Pricing Tab Content */
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                                        <Plus className="w-3 h-3" />
                                    </span>
                                    Add New Expertise
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-6">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Specialization</label>
                                        <div className="relative">
                                            <select
                                                value={newSpecName}
                                                onChange={(e) => setNewSpecName(e.target.value)}
                                                className="w-full rounded-xl bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                                            >
                                                <option value="">Select expertise...</option>
                                                {techSpecializations.map(spec => (
                                                    <option key={spec} value={spec}>{spec}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Price (₦) / Month</label>
                                        <input 
                                            type="number"
                                            placeholder="0.00"
                                            value={newSpecPrice}
                                            onChange={(e) => setNewSpecPrice(e.target.value)}
                                            className="w-full rounded-xl bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button 
                                            type="button"
                                            onClick={handleAddSpecialization}
                                            disabled={!newSpecName || !newSpecPrice}
                                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/10 active:scale-95"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Current Expertise</h3>
                                {(!formData.specializations || formData.specializations.length === 0) ? (
                                    <div className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/5">
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No expertise added yet.</p>
                                        <p className="text-sm text-gray-400 mt-1">Add your skills above to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.specializations.map((spec: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <Video className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{spec.name}</p>
                                                        <p className="text-sm text-gray-500">Tech Category</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₦{spec.price}</p>
                                                        <p className="text-xs text-gray-400 font-medium">per month</p>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100 dark:bg-white/10 mx-2"></div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleRemoveSpecialization(index)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                        <button 
                            type="button"
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20 active:scale-[0.98] flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-red-500 to-red-600">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Delete Account</h2>
                  <p className="text-sm text-white/80">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To confirm, please type your email address <span className="font-bold text-gray-900 dark:text-white">{user?.email}</span> below.
              </p>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all dark:text-white"
              />
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Warning:</strong> All your data will be permanently deleted, including your profile, messages, bookings, and wallet balance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Verify email
                    if (deleteEmail !== user?.email) {
                      setErrorMessage('Email does not match');
                      return;
                    }
                    // Delete account data
                    localStorage.removeItem('currentUser');
                    // Remove user from users array
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const filteredUsers = users.filter((u: any) => u.email !== user.email);
                    localStorage.setItem('users', JSON.stringify(filteredUsers));
                    // Clear other user-related data (wallet, transactions, etc.)
                    localStorage.removeItem(`wallet_${user.id}`);
                    localStorage.removeItem(`transactions_${user.id}`);
                    localStorage.removeItem(`payouts_${user.id}`);
                    // Logout
                    logout();
                  }}
                  disabled={deleteEmail !== user?.email || loading}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
