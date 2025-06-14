import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import SlideOver from '../components/SlideOver';
import { TextInput, SelectInput, TextArea, Checkbox, FormActions } from '../components/FormElements';
import { endpoints } from '../config/api';

function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo_url: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    sponsorship_level: 'silver',
    status: 'active',
    start_date: '',
    end_date: '',
    amount: '',
    benefits: '',
    is_featured: false,
    social_media: {
      linkedin: '',
      twitter: '',
      facebook: '',
    },
    notes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sponsorship_level', label: 'Level' },
    { key: 'contact_name', label: 'Contact' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
  ];

  useEffect(() => {
    fetchSponsors();
  }, [currentPage]);

  const fetchSponsors = async () => {
    try {
      const response = await axios.get(`${endpoints.sponsors}?page=${currentPage}`);
      setSponsors(response.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    }
  };

  const handleAdd = () => {
    setCurrentSponsor(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      logo_url: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      sponsorship_level: 'silver',
      status: 'active',
      start_date: '',
      end_date: '',
      amount: '',
      benefits: '',
      is_featured: false,
      social_media: {
        linkedin: '',
        twitter: '',
        facebook: '',
      },
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (sponsor) => {
    setCurrentSponsor(sponsor);
    setFormData(sponsor);
    setIsModalOpen(true);
  };

  const handleDelete = async (sponsor) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await axios.delete(`${endpoints.sponsors}/${sponsor.id}`);
        fetchSponsors();
      } catch (error) {
        console.error('Error deleting sponsor:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSponsor) {
        await axios.put(`${endpoints.sponsors}/${currentSponsor.id}`, formData);
      } else {
        await axios.post(endpoints.sponsors, formData);
      }
      setIsModalOpen(false);
      fetchSponsors();
    } catch (error) {
      console.error('Error saving sponsor:', error);
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

  return (
    <div>
      <DataTable
        title="Sponsors"
        columns={columns}
        data={sponsors}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <SlideOver isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentSponsor ? 'Edit Sponsor' : 'Add Sponsor'}>
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
              label="Website"
              id="website"
              name="website"
              type="url"
              required
              value={formData.website}
              onChange={handleInputChange}
            />

            <TextInput
              label="Logo URL"
              id="logo_url"
              name="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={handleInputChange}
            />

            <TextInput
              label="Contact Name"
              id="contact_name"
              name="contact_name"
              required
              value={formData.contact_name}
              onChange={handleInputChange}
            />

            <TextInput
              label="Contact Email"
              id="contact_email"
              name="contact_email"
              type="email"
              required
              value={formData.contact_email}
              onChange={handleInputChange}
            />

            <TextInput
              label="Contact Phone"
              id="contact_phone"
              name="contact_phone"
              type="tel"
              required
              value={formData.contact_phone}
              onChange={handleInputChange}
            />

            <SelectInput
              label="Sponsorship Level"
              id="sponsorship_level"
              name="sponsorship_level"
              required
              value={formData.sponsorship_level}
              onChange={handleInputChange}
            >
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </SelectInput>

            <SelectInput
              label="Status"
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </SelectInput>

            <TextInput
              label="Start Date"
              id="start_date"
              name="start_date"
              type="date"
              required
              value={formData.start_date}
              onChange={handleInputChange}
            />

            <TextInput
              label="End Date"
              id="end_date"
              name="end_date"
              type="date"
              required
              value={formData.end_date}
              onChange={handleInputChange}
            />

            <TextInput
              label="Amount"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
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
                label="Facebook"
                id="social_media.facebook"
                name="social_media.facebook"
                type="url"
                value={formData.social_media.facebook}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Checkbox
            label="Featured Sponsor"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
          />

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
            label="Benefits"
            id="benefits"
            name="benefits"
            rows={3}
            value={formData.benefits}
            onChange={handleInputChange}
          />

          <TextArea
            label="Notes"
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
          />

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={currentSponsor ? 'Update' : 'Create'}
          />
        </form>
      </SlideOver>
    </div>
  );
}

export default Sponsors; 