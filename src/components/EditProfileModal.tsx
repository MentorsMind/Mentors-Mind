import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'details' | 'expertise';
}

export function EditProfileModal({ isOpen, onClose, initialTab = 'details' }: EditProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'expertise'>(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    about: '',
    image: '',
    phone: '',
    state: '',
    country: '',
    specializations: [] as { name: string; price: number }[]
  });
  
  // New specialization input state
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecPrice, setNewSpecPrice] = useState('');

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

  useEffect(() => {
    if (isOpen) {
        setActiveTab(initialTab);
    }
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        about: user.about || '',
        image: user.image || '',
        phone: user.phone || '',
        state: user.state || '',
        country: user.country || '',
        specializations: user.specializations || []
      });
    }
  }, [user, isOpen, initialTab]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSpecialization = () => {
    if (!newSpecName || !newSpecPrice) return;
    
    setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, { name: newSpecName, price: Number(newSpecPrice) }]
    }));
    setNewSpecName('');
    setNewSpecPrice('');
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
        ...prev,
        specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a2e22] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-100 dark:border-white/5">
            <button 
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            >
                Basic Details
            </button>
            {user?.role === 'mentor' && (
              <button 
                   onClick={() => setActiveTab('expertise')}
                   className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'expertise' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
              >
                  Expertise & Pricing
              </button>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {(activeTab === 'details' || user?.role !== 'mentor') ? (
                <>
                    <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 bg-cover bg-center border-2 border-white dark:border-[#1a2e22] shadow-md" style={{ backgroundImage: `url('${formData.image}')` }}></div>
                        <button type="button" className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg shadow-green-900/20 hover:bg-green-600 transition-colors">
                        <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo URL</label>
                        <input 
                        type="text" 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                        />
                    </div>
                    {user?.role === 'mentor' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                            <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                            />
                        </div>
                    )}
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About</label>
                    <textarea 
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none dark:text-white"
                        placeholder="Tell us about yourself..."
                    />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                <input 
                                    type="text" 
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                <input 
                                    type="text" 
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white" 
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Specialist Expertise</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Specialization</label>
                                    <select
                                        value={newSpecName}
                                        onChange={(e) => setNewSpecName(e.target.value)}
                                        className="w-full rounded-lg bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="">Select expertise...</option>
                                        {techSpecializations.map(spec => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Price (₦) / Month</label>
                                    <input 
                                        type="number"
                                        placeholder="0.00"
                                        value={newSpecPrice}
                                        onChange={(e) => setNewSpecPrice(e.target.value)}
                                        className="w-full rounded-lg bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button 
                                        type="button"
                                        onClick={handleAddSpecialization}
                                        disabled={!newSpecName || !newSpecPrice}
                                        className="w-full flex items-center justify-center gap-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">My Expertise</h3>
                            {formData.specializations.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No expertise added yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {formData.specializations.map((spec, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{spec.name}</p>
                                                <p className="text-sm text-primary font-bold">₦{spec.price}/month</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveSpecialization(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/5">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                form="profile-form"
                disabled={loading}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-green-600 transition-colors flex items-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
