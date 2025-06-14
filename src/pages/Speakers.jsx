import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import SlideOver from '../components/SlideOver';
import SkeletonLoader from '../components/SkeletonLoader';
import { TextInput, SelectInput, TextArea, Checkbox, FormActions } from '../components/FormElements';
import { endpoints } from '../config/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Generate a random color based on the name
const generateColorFromName = (name) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

// Get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Avatar component with fallback
const Avatar = ({ name, imageUrl, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl'
  };

  if (imageError || !imageUrl) {
    return (
      <div className={`${sizeClasses[size]} ${generateColorFromName(name)} rounded-full flex items-center justify-center text-white font-semibold`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={`${sizeClasses[size]} rounded-full object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    expertise: '',
    company: '',
    rating: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    expertise: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    website: '',
    social_media: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    image_url: '',
    is_featured: false,
    availability: '',
    rating: 0,
    tags: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'expertise', label: 'Expertise' },
    { key: 'company', label: 'Company' },
    { key: 'position', label: 'Position' },
    { key: 'rating', label: 'Rating' },
  ];

  useEffect(() => {
    fetchSpeakers();
  }, [currentPage, searchQuery, filters]);

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
        ...filters,
      });
      const response = await axios.get(`${endpoints.speakers}?${queryParams}`);
      setSpeakers(response.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentSpeaker(null);
    setFormData({
      name: '',
      bio: '',
      expertise: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      website: '',
      social_media: {
        linkedin: '',
        twitter: '',
        github: '',
      },
      image_url: '',
      is_featured: false,
      availability: '',
      rating: 0,
      tags: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (speaker) => {
    setCurrentSpeaker(speaker);
    setFormData({
      ...speaker,
      tags: speaker.tags.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (speaker) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      try {
        await axios.delete(`${endpoints.speakers}/${speaker.id}`);
        fetchSpeakers();
      } catch (error) {
        console.error('Error deleting speaker:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      if (currentSpeaker) {
        await axios.put(`${endpoints.speakers}/${currentSpeaker.id}`, submitData);
      } else {
        await axios.post(endpoints.speakers, submitData);
      }
      setIsModalOpen(false);
      fetchSpeakers();
    } catch (error) {
      console.error('Error saving speaker:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('social_media.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [platform]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleViewDetails = (speaker) => {
    setSelectedSpeaker(speaker);
    setIsDetailsModalOpen(true);
  };

  const filteredSpeakers = speakers.filter(speaker => {
    return (
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSpeakers.map((speaker) => (
        <div
          key={speaker.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48 bg-gray-100">
            {speaker.image_url ? (
              <img
                src={speaker.image_url}
                alt={speaker.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add(generateColorFromName(speaker.name));
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="text-4xl font-bold text-white">${getInitials(speaker.name)}</span>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className={`w-full h-full ${generateColorFromName(speaker.name)} flex items-center justify-center`}>
                <span className="text-4xl font-bold text-white">{getInitials(speaker.name)}</span>
              </div>
            )}
            {speaker.is_featured && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{speaker.name}</h3>
            <p className="text-sm text-gray-600">{speaker.position}</p>
            <p className="text-sm text-gray-500">{speaker.company}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(speaker.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">({speaker.rating})</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewDetails(speaker)}
                  className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                  title="View Details"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(speaker)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  title="Edit Speaker"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(speaker)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Delete Speaker"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Speakers</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Speaker
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              } transition-colors duration-200`}
              title="Grid View"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              } transition-colors duration-200`}
              title="Table View"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          viewMode === 'grid' ? (
            <SkeletonLoader type="grid" rows={8} />
          ) : (
            <SkeletonLoader type="table" rows={5} columns={5} />
          )
        ) : (
          viewMode === 'grid' ? (
            renderGridView()
          ) : (
            <DataTable
              title="Speakers"
              columns={columns}
              data={speakers}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )
        )}
      </div>

      <SlideOver isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentSpeaker ? 'Edit Speaker' : 'Add Speaker'}>
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
              label="Expertise"
              id="expertise"
              name="expertise"
              required
              value={formData.expertise}
              onChange={handleInputChange}
            />

            <TextInput
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextInput
              label="Phone"
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />

            <TextInput
              label="Company"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />

            <TextInput
              label="Position"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />

            <TextInput
              label="Website"
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
            />

            <TextInput
              label="Image URL"
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleInputChange}
            />

            <TextInput
              label="Availability"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
            />

            <TextInput
              label="Rating"
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
            />

            <TextInput
              label="Tags (comma-separated)"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Social Media</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <TextInput
                label="LinkedIn"
                id="social_media.linkedin"
                name="social_media.linkedin"
                type="url"
                value={formData.social_media.linkedin}
                onChange={handleInputChange}
              />

              <TextInput
                label="Twitter"
                id="social_media.twitter"
                name="social_media.twitter"
                type="url"
                value={formData.social_media.twitter}
                onChange={handleInputChange}
              />

              <TextInput
                label="GitHub"
                id="social_media.github"
                name="social_media.github"
                type="url"
                value={formData.social_media.github}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Checkbox
            label="Featured Speaker"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
          />

          <TextArea
            label="Bio"
            id="bio"
            name="bio"
            rows={4}
            required
            value={formData.bio}
            onChange={handleInputChange}
          />

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={currentSpeaker ? 'Update' : 'Create'}
          />
        </form>
      </SlideOver>

      <SlideOver isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Speaker Details">
        {selectedSpeaker && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start space-x-4">
              <Avatar
                name={selectedSpeaker.name}
                imageUrl={selectedSpeaker.image_url}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSpeaker.name || 'Unnamed Speaker'}</h3>
                    <p className="text-sm text-gray-600">{selectedSpeaker.position || 'No position'}</p>
                    <p className="text-sm text-gray-500">{selectedSpeaker.company || 'No company'}</p>
                  </div>
                  {selectedSpeaker.is_featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured Speaker
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(selectedSpeaker?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({selectedSpeaker?.rating || 0})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleEdit(selectedSpeaker);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilSquareIcon className="h-4 w-4 mr-1.5" />
                Edit Profile
              </button>
              {selectedSpeaker.website && (
                <a
                  href={selectedSpeaker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Website
                </a>
              )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Bio Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {selectedSpeaker.bio || 'No bio available'}
                  </p>
                </div>

                {/* Expertise Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                  <p className="text-sm text-gray-600">
                    {selectedSpeaker.expertise || 'No expertise listed'}
                  </p>
                </div>

                {/* Tags Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedSpeaker.tags) && selectedSpeaker.tags.length > 0 ? (
                      selectedSpeaker.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No tags available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    {selectedSpeaker.email && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${selectedSpeaker.email}`} className="text-sm text-indigo-600 hover:text-indigo-900">
                          {selectedSpeaker.email}
                        </a>
                      </div>
                    )}
                    {selectedSpeaker.phone && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${selectedSpeaker.phone}`} className="text-sm text-indigo-600 hover:text-indigo-900">
                          {selectedSpeaker.phone}
                        </a>
                      </div>
                    )}
                    {!selectedSpeaker.email && !selectedSpeaker.phone && (
                      <p className="text-sm text-gray-600">No contact information available</p>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Social Media</h4>
                  <div className="space-y-3">
                    {selectedSpeaker.social_media?.linkedin && (
                      <a
                        href={selectedSpeaker.social_media.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                      >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedSpeaker.social_media?.twitter && (
                      <a
                        href={selectedSpeaker.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                      >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter Profile
                      </a>
                    )}
                    {selectedSpeaker.social_media?.github && (
                      <a
                        href={selectedSpeaker.social_media.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
                      >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Profile
                      </a>
                    )}
                    {!selectedSpeaker.social_media?.linkedin && 
                     !selectedSpeaker.social_media?.twitter && 
                     !selectedSpeaker.social_media?.github && (
                      <p className="text-sm text-gray-600">No social media links provided</p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                {selectedSpeaker.availability && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
                    <p className="text-sm text-gray-600">{selectedSpeaker.availability}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

export default Speakers; 