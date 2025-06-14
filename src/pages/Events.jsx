import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SlideOver from '../components/SlideOver';
import { TextInput, SelectInput, TextArea, Checkbox, FormActions } from '../components/FormElements';
import { endpoints } from '../config/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [failedImages, setFailedImages] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    endDate: '',
    platform: '',
    url: '',
    isOnline: false,
    location: '',
    tags: '',
    organizer: '',
    speakerIds: [],
    agendaItemIds: [],
    maxAttendees: '',
    registeredAttendeesCount: 0,
    sponsorIds: [],
    status: 'upcoming',
    bannerImage: '',
    logoImage: '',
    isPrivate: false,
    entryFee: '',
    currency: 'USD',
    contactEmail: '',
    additionalInfo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${endpoints.events}?page=${currentPage}`);
      setEvents(response.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAdd = () => {
    setCurrentEvent(null);
    setFormData({
      name: '',
      description: '',
      date: '',
      endDate: '',
      platform: '',
      url: '',
      isOnline: false,
      location: '',
      tags: '',
      organizer: '',
      speakerIds: [],
      agendaItemIds: [],
      maxAttendees: '',
      registeredAttendeesCount: 0,
      sponsorIds: [],
      status: 'upcoming',
      bannerImage: '',
      logoImage: '',
      isPrivate: false,
      entryFee: '',
      currency: 'USD',
      contactEmail: '',
      additionalInfo: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      ...event,
      date: formatDateForInput(event.date),
      endDate: formatDateForInput(event.endDate),
      tags: event.tags ? event.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (event) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${endpoints.events}/${event.id}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        maxAttendees: parseInt(formData.maxAttendees),
        entryFee: parseFloat(formData.entryFee),
        date: new Date(formData.date).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (currentEvent) {
        await axios.put(`${endpoints.events}/${currentEvent.id}`, submitData);
      } else {
        await axios.post(endpoints.events, submitData);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleView = (event) => {
    navigate(`/events/${event.id}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      past: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      postponed: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.upcoming;
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const generateEventColor = (eventName) => {
    // Generate a consistent color based on the event name
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
    
    // Use the event name to generate a consistent index
    const hash = eventName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleImageError = (eventId) => {
    setFailedImages(prev => new Set([...prev, eventId]));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Event
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
          <option value="postponed">Postponed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              {event.bannerImage && !failedImages.has(event.id) ? (
                <img
                  src={event.bannerImage}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(event.id)}
                />
              ) : (
                <div className={`w-full h-full ${generateEventColor(event.name)} flex items-center justify-center`}>
                  <span className="text-white text-2xl font-bold px-4 text-center">
                    {event.name}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.isOnline ? 'Online Event' : event.location}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {event.registeredAttendeesCount} / {event.maxAttendees} attendees
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit Event"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Event"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleView(event)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Event Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>

      <SlideOver isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEvent ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInput
              label="Name"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <TextInput
              label="Date"
              id="date"
              name="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={handleInputChange}
            />

            <TextInput
              label="End Date"
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleInputChange}
            />

            <TextInput
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />

            <TextInput
              label="Platform"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
            />

            <TextInput
              label="URL"
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
            />

            <TextInput
              label="Max Attendees"
              id="maxAttendees"
              name="maxAttendees"
              type="number"
              value={formData.maxAttendees}
              onChange={handleInputChange}
            />

            <TextInput
              label="Entry Fee"
              id="entryFee"
              name="entryFee"
              type="number"
              step="0.01"
              value={formData.entryFee}
              onChange={handleInputChange}
            />

            <TextInput
              label="Currency"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
            />

            <TextInput
              label="Organizer"
              id="organizer"
              name="organizer"
              required
              value={formData.organizer}
              onChange={handleInputChange}
            />

            <TextInput
              label="Contact Email"
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              value={formData.contactEmail}
              onChange={handleInputChange}
            />

            <TextInput
              label="Banner Image URL"
              id="bannerImage"
              name="bannerImage"
              type="url"
              value={formData.bannerImage}
              onChange={handleInputChange}
            />

            <TextInput
              label="Logo Image URL"
              id="logoImage"
              name="logoImage"
              type="url"
              value={formData.logoImage}
              onChange={handleInputChange}
            />

            <SelectInput
              label="Status"
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </SelectInput>

            <TextInput
              label="Tags (comma-separated)"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Online Event"
              id="isOnline"
              name="isOnline"
              checked={formData.isOnline}
              onChange={handleInputChange}
            />

            <Checkbox
              label="Private Event"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleInputChange}
            />
          </div>

          <TextArea
            label="Description"
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleInputChange}
          />

          <TextArea
            label="Additional Information"
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            value={formData.additionalInfo}
            onChange={handleInputChange}
          />

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={currentEvent ? 'Update' : 'Create'}
          />
        </form>
      </SlideOver>
    </div>
  );
}

export default Events; 