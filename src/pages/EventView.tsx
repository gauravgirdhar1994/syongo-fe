import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  TagIcon, 
  GlobeAltIcon, 
  CurrencyDollarIcon, 
  EnvelopeIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  ClockIcon,
  ShareIcon,
  BookmarkIcon,
  BellIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { endpoints } from '../config/api';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

interface Event {
  id?: string;
  name: string;
  description: string;
  date: Date;
  endDate?: Date;
  platform: string;
  url?: string;
  isOnline: boolean;
  location?: string;
  tags?: string[];
  organizer: string;
  speakerIds?: string[];
  agendaItemIds?: string[];
  maxAttendees?: number;
  registeredAttendeesCount?: number;
  sponsorIds?: string[];
  status: 'upcoming' | 'live' | 'past' | 'cancelled' | 'postponed';
  bannerImage?: string;
  logoImage?: string;
  isPrivate?: boolean;
  entryFee?: number;
  currency?: string;
  contactEmail?: string;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Speaker {
  id: string;
  name: string;
  bio: string;
  expertise: string;
  company: string;
  position: string;
  image_url: string;
  social_media: {
    linkedin: string;
    twitter: string;
    github: string;
  };
}

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  position: string;
  ticket_type: string;
  status: string;
  image_url?: string;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  speaker_id: string;
  speaker_name: string;
  location: string;
  type: string;
  status: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const EventView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState<{
    event?: ApiError;
    speakers?: ApiError;
    attendees?: ApiError;
    agenda?: ApiError;
  }>({});

  const [stats, setStats] = useState({
    totalSpeakers: 0,
    totalAttendees: 0,
    totalAgendaItems: 0,
    registrationProgress: 0,
  });

  console.log('event id', id);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setErrors({});
      
      try {
        // Fetch event data first as it's the most critical
        const eventRes = await axios.get(`${endpoints.events}/${id}`);
        const eventData = eventRes.data;
        setEvent(eventData);

        // Fetch additional data in parallel
        const [speakersRes, attendeesRes, agendaRes] = await Promise.allSettled([
          axios.get(`${endpoints.speakers}?event_id=${id}`),
          axios.get(`${endpoints.attendees}?event_id=${id}`),
          axios.get(`${endpoints.agendaItems}?event_id=${id}`)
        ]);

        // Handle speakers data
        if (speakersRes.status === 'fulfilled') {
          const speakersData = speakersRes.value.data || [];
          setSpeakers(Array.isArray(speakersData) ? speakersData : []);
        } else {
          setErrors(prev => ({
            ...prev,
            speakers: { message: 'Failed to load speakers data' }
          }));
        }

        // Handle attendees data
        if (attendeesRes.status === 'fulfilled') {
          const attendeesData = attendeesRes.value.data || [];
          setAttendees(Array.isArray(attendeesData) ? attendeesData : []);
        } else {
          setErrors(prev => ({
            ...prev,
            attendees: { message: 'Failed to load attendees data' }
          }));
        }

        // Handle agenda data
        if (agendaRes.status === 'fulfilled') {
          const agendaData = agendaRes.value.data || [];
          setAgendaItems(Array.isArray(agendaData) ? agendaData : []);
        } else {
          setErrors(prev => ({
            ...prev,
            agenda: { message: 'Failed to load agenda data' }
          }));
        }

        // Calculate stats with safe fallbacks
        const speakersCount = speakersRes.status === 'fulfilled' && Array.isArray(speakersRes.value.data) 
          ? speakersRes.value.data.length 
          : 0;
        
        const attendeesCount = attendeesRes.status === 'fulfilled' && Array.isArray(attendeesRes.value.data)
          ? attendeesRes.value.data.length
          : 0;
        
        const agendaCount = agendaRes.status === 'fulfilled' && Array.isArray(agendaRes.value.data)
          ? agendaRes.value.data.length
          : 0;

        setStats({
          totalSpeakers: speakersCount,
          totalAttendees: attendeesCount,
          totalAgendaItems: agendaCount,
          registrationProgress: eventData.maxAttendees 
            ? (attendeesCount / eventData.maxAttendees) * 100 
            : 0,
        });

      } catch (error) {
        console.error('Error fetching event data:', error);
        setErrors(prev => ({
          ...prev,
          event: { 
            message: 'Failed to load event data',
            status: error.response?.status
          }
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const generateEventColor = (eventName: string) => {
    const colors = [
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-rose-500 to-pink-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-teal-500 to-blue-600',
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-sky-500 to-blue-600',
    ];
    
    const hash = eventName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="prose max-w-none">
            {/* Event Header with Hero Section */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform hover:scale-[1.01] transition-transform duration-300">
              {/* Event Banner */}
              <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
                {event?.bannerImage && (
                  <img
                    src={event.bannerImage}
                    alt={event.name}
                    className="w-full h-full object-cover opacity-75"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Event Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">{event?.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-white/90">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/20`}>
                        {event?.status}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'TBD'}
                      </span>
                      {event?.isOnline ? (
                        <span className="flex items-center">
                          <GlobeAltIcon className="h-4 w-4 mr-1.5" />
                          Online Event
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1.5" />
                          {event?.location || 'Location TBD'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                      title="Share Event"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                      title="Save Event"
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                      title="Set Reminder"
                    >
                      <BellIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                      title="Like Event"
                    >
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats with Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-indigo-50">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Attendees</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.totalAttendees}</p>
                    {event?.maxAttendees && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Registration Progress</span>
                          <span className="text-gray-900 font-medium">{Math.round(stats.registrationProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(stats.registrationProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-emerald-50">
                    <UserIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Speakers</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.totalSpeakers}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">View profiles →</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-violet-50">
                    <ChartBarIcon className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sessions</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.totalAgendaItems}</p>
                    <p className="text-xs text-violet-600 mt-1 font-medium">View schedule →</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-amber-50">
                    <TicketIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Entry Fee</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {event?.entryFee ? `${event.entryFee} ${event.currency || 'USD'}` : 'Free'}
                    </p>
                    {event?.entryFee && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">Register now →</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description with Tags */}
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">About the Event</h3>
                    {event?.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                          >
                            <TagIcon className="h-3.5 w-3.5 mr-1.5" />
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {event?.description || 'No description available.'}
                  </div>
                  {event?.additionalInfo && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {event.additionalInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Event Details */}
              <div className="space-y-6">
                {/* Date & Time with Location */}
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h3>
                  <div className="space-y-6">
                    {/* Date & Time */}
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-blue-50">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Date & Time</p>
                        <p className="text-sm text-gray-600">
                          {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'TBD'}
                        </p>
                        {event?.endDate && (
                          <p className="text-sm text-gray-600">
                            to {new Date(event.endDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    {event?.isOnline ? (
                      <div className="flex items-start">
                        <div className="p-3 rounded-xl bg-emerald-50">
                          <GlobeAltIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Online Event</p>
                          {event?.platform && (
                            <p className="text-sm text-gray-600">Platform: {event.platform}</p>
                          )}
                          {event?.url && (
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                            >
                              Join Event
                              <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <div className="p-3 rounded-xl bg-emerald-50">
                          <MapPinIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Venue</p>
                          <p className="text-sm text-gray-600">{event?.location || 'Location TBD'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact & Registration */}
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact & Registration</h3>
                  <div className="space-y-6">
                    {/* Organizer */}
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-violet-50">
                        <UserIcon className="h-6 w-6 text-violet-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Organizer</p>
                        <p className="text-sm text-gray-600">{event?.organizer || 'Not specified'}</p>
                        {event?.contactEmail && (
                          <a
                            href={`mailto:${event.contactEmail}`}
                            className="text-sm text-violet-600 hover:text-violet-500 font-medium"
                          >
                            {event.contactEmail}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Registration Status */}
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-amber-50">
                        <UserGroupIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Registration</p>
                        <p className="text-sm text-gray-600">
                          {event?.maxAttendees ? `${stats.totalAttendees} / ${event.maxAttendees} registered` : 'Unlimited'}
                        </p>
                        {event?.isPrivate && (
                          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                            Private Event
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'speakers':
        if (!speakers?.length) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">No speakers have been added to this event yet.</p>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {speaker.image_url ? (
                      <img
                        src={speaker.image_url}
                        alt={speaker.name}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-gray-500">
                          {speaker.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{speaker.name || 'Unnamed Speaker'}</h3>
                    <p className="text-sm text-gray-500">
                      {speaker.position || 'Position not specified'} at {speaker.company || 'Company not specified'}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{speaker.bio || 'No biography available.'}</p>
                {speaker.social_media && (
                  <div className="mt-4 flex space-x-4">
                    {speaker.social_media.linkedin && (
                      <a
                        href={speaker.social_media.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.social_media.twitter && (
                      <a
                        href={speaker.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.social_media.github && (
                      <a
                        href={speaker.social_media.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">GitHub</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'attendees':
        if (!attendees?.length) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendees have registered for this event yet.</p>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {attendee.image_url ? (
                      <img
                        src={attendee.image_url}
                        alt={`${attendee.first_name || ''} ${attendee.last_name || ''}`}
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          const name = `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim();
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'A')}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-gray-500">
                          {(attendee.first_name?.charAt(0) || 'A').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {attendee.first_name || 'First'} {attendee.last_name || 'Last'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {attendee.position || 'Position not specified'} at {attendee.company || 'Company not specified'}
                    </p>
                    <p className="text-sm text-gray-500">Ticket: {attendee.ticket_type || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'agenda':
        if (!agendaItems?.length) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">No agenda items have been added to this event yet.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {agendaItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.title || 'Untitled Session'}</h3>
                    {item.speaker_name && (
                      <p className="mt-1 text-sm text-gray-500">
                        Speaker: {item.speaker_name}
                      </p>
                    )}
                    <p className="mt-2 text-gray-600">{item.description || 'No description available.'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.start_time ? new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                      {' - '}
                      {item.end_time ? new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{item.location || 'Location TBD'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SkeletonLoader type="list" rows={1} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonLoader type="list" rows={4} />
        </div>
        <div className="mb-8">
          <SkeletonLoader type="table" rows={5} columns={4} />
        </div>
      </div>
    );
  }

  if (errors.event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Event</h2>
          <p className="mt-2 text-gray-600">{errors.event.message}</p>
          {errors.event.status === 404 && (
            <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          )}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      past: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      postponed: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'agenda', name: 'Agenda', icon: ClockIcon },
    { id: 'speakers', name: 'Speakers', icon: PresentationChartLineIcon },
    { id: 'attendees', name: 'Attendees', icon: UserGroupIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : errors.event ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{errors.event.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Event Header with Hero Section */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform hover:scale-[1.01] transition-transform duration-300">
            {/* Event Banner */}
            <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
              {event?.bannerImage && (
                <img
                  src={event.bannerImage}
                  alt={event.name}
                  className="w-full h-full object-cover opacity-75"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">{event?.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-white/90">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/20`}>
                      {event?.status}
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'TBD'}
                    </span>
                    {event?.isOnline ? (
                      <span className="flex items-center">
                        <GlobeAltIcon className="h-4 w-4 mr-1.5" />
                        Online Event
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1.5" />
                        {event?.location || 'Location TBD'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                    title="Share Event"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                    title="Save Event"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                    title="Set Reminder"
                  >
                    <BellIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                    title="Like Event"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats with Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-indigo-50">
                  <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Attendees</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.totalAttendees}</p>
                  {event?.maxAttendees && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Registration Progress</span>
                        <span className="text-gray-900 font-medium">{Math.round(stats.registrationProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(stats.registrationProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <UserIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Speakers</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.totalSpeakers}</p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">View profiles →</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-violet-50">
                  <ChartBarIcon className="h-6 w-6 text-violet-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Sessions</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.totalAgendaItems}</p>
                  <p className="text-xs text-violet-600 mt-1 font-medium">View schedule →</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-50">
                  <TicketIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Entry Fee</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {event?.entryFee ? `${event.entryFee} ${event.currency || 'USD'}` : 'Free'}
                  </p>
                  {event?.entryFee && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">Register now →</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description with Tags */}
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">About the Event</h3>
                  {event?.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                        >
                          <TagIcon className="h-3.5 w-3.5 mr-1.5" />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {event?.description || 'No description available.'}
                </div>
                {event?.additionalInfo && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {event.additionalInfo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Event Details */}
            <div className="space-y-6">
              {/* Date & Time with Location */}
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h3>
                <div className="space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-start">
                    <div className="p-3 rounded-xl bg-blue-50">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'TBD'}
                      </p>
                      {event?.endDate && (
                        <p className="text-sm text-gray-600">
                          to {new Date(event.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {event?.isOnline ? (
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-emerald-50">
                        <GlobeAltIcon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Online Event</p>
                        {event?.platform && (
                          <p className="text-sm text-gray-600">Platform: {event.platform}</p>
                        )}
                        {event?.url && (
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                          >
                            Join Event
                            <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-emerald-50">
                        <MapPinIcon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Venue</p>
                        <p className="text-sm text-gray-600">{event?.location || 'Location TBD'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Registration */}
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact & Registration</h3>
                <div className="space-y-6">
                  {/* Organizer */}
                  <div className="flex items-start">
                    <div className="p-3 rounded-xl bg-violet-50">
                      <UserIcon className="h-6 w-6 text-violet-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Organizer</p>
                      <p className="text-sm text-gray-600">{event?.organizer || 'Not specified'}</p>
                      {event?.contactEmail && (
                        <a
                          href={`mailto:${event.contactEmail}`}
                          className="text-sm text-violet-600 hover:text-violet-500 font-medium"
                        >
                          {event.contactEmail}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Registration Status */}
                  <div className="flex items-start">
                    <div className="p-3 rounded-xl bg-amber-50">
                      <UserGroupIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Registration</p>
                      <p className="text-sm text-gray-600">
                        {event?.maxAttendees ? `${stats.totalAttendees} / ${event.maxAttendees} registered` : 'Unlimited'}
                      </p>
                      {event?.isPrivate && (
                        <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Private Event
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventView; 