import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Star,
  Check,
  Stethoscope,
  MapPin,
  Users,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { useMentors } from './hooks/useData';
import { ConsultationBookingModal } from './components/ConsultationBookingModal';
import { useMessages } from './contexts/MessageContext';

export function DoctorsDirectory() {
  const navigate = useNavigate();
  const mentors = useMentors();
  const { createThread } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Filter for Medical Professionals ONLY
  const medicalPros = mentors.filter(m => m.category === 'Medical');

  // Get unique specializations
  const allSpecializations = ['All', ...new Set(medicalPros.flatMap(pro => pro.tags))];

  const filteredPros = medicalPros.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pro.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pro.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || pro.tags.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/medical')}
                className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold hidden md:inline">Back to Medical Hub</span>
              </button>
              <div className="h-8 w-px bg-gray-300 dark:bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Our Medical Specialists</h1>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 hidden md:block">Browse and connect with verified doctors</p>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#29382f] text-emerald-600 shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#29382f] text-emerald-600 shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a2e22] text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Specialization Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter className="w-5 h-5 text-slate-600 dark:text-gray-400 flex-shrink-0" />
            {allSpecializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialization === spec
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white dark:bg-[#1a2e22] text-slate-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-gray-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredPros.length}</span> medical specialist{filteredPros.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Doctors Grid/List */}
        {filteredPros.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No specialists found</h3>
            <p className="text-slate-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPros.map((doctor: any) => (
              <div
                key={doctor.id}
                onClick={() => navigate(`/medical-profile/${doctor.id}`)}
                className={`bg-white dark:bg-[#1a2e22] rounded-2xl border border-red-100 dark:border-white/10 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group ${
                  viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'flex flex-col'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative h-24 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10">
                      {doctor.verified && (
                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/60 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" /> Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="px-5 pb-5 -mt-12 flex flex-col flex-1">
                      <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg mb-3 self-start ring-2 ring-white dark:ring-[#1a2e22]">
                        <img src={doctor.image} className="w-full h-full object-cover rounded-xl" alt={doctor.name} />
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-red-500 transition-colors">Dr. {doctor.name}</h3>
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{doctor.role}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                          <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{doctor.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.state}, {doctor.country}</span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{doctor.about}</p>
                      
                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            createThread(doctor.id, doctor.name, doctor.image);
                            navigate(`/messages`);
                          }}
                          className="py-2.5 rounded-xl border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMentor(doctor);
                            setIsBookingOpen(true);
                          }}
                          className="py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={doctor.image} className="w-full h-full object-cover" alt={doctor.name} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">Dr. {doctor.name}</h3>
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{doctor.role}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
                          <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                          <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{doctor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.state}, {doctor.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{doctor.sessions}+ patients</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{doctor.about}</p>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            createThread(doctor.id, doctor.name, doctor.image);
                            navigate(`/messages`);
                          }}
                          className="px-6 py-2 rounded-xl border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMentor(doctor);
                            setIsBookingOpen(true);
                          }}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 transition-all"
                        >
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Booking Modal */}
      {selectedMentor && (
        <ConsultationBookingModal
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedMentor(null);
          }}
          doctorId={selectedMentor.id}
          doctorName={selectedMentor.name}
          doctorImage={selectedMentor.image}
          consultationFee={selectedMentor.hourlyRate || 0}
          specializations={selectedMentor.tags || []}
        />
      )}
    </div>
  );
}
