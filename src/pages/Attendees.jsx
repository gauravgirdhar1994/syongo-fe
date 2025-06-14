import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import SlideOver from '../components/SlideOver';
import { TextInput, SelectInput, TextArea, Checkbox, FormActions } from '../components/FormElements';
import { endpoints } from '../config/api';

function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttendee, setCurrentAttendee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    ticket_type: 'regular',
    status: 'registered',
    registration_date: '',
    dietary_restrictions: '',
    special_requirements: '',
    is_vip: false,
    social_media: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    notes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' },
    { key: 'ticket_type', label: 'Ticket Type' },
    { key: 'status', label: 'Status' },
  ];

  useEffect(() => {
    fetchAttendees();
    fetchEvents();
  }, [currentPage]);

  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`${endpoints.attendees}?page=${currentPage}`);
      setAttendees(response.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(endpoints.events);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAdd = () => {
    setCurrentAttendee(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      ticket_type: 'regular',
      status: 'registered',
      registration_date: '',
      dietary_restrictions: '',
      special_requirements: '',
      is_vip: false,
      social_media: {
        linkedin: '',
        twitter: '',
        github: '',
      },
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (attendee) => {
    setCurrentAttendee(attendee);
    setFormData(attendee);
    setIsModalOpen(true);
  };

  const handleDelete = async (attendee) => {
    if (window.confirm('Are you sure you want to delete this attendee?')) {
      try {
        await axios.delete(`${endpoints.attendees}/${attendee.id}`);
        fetchAttendees();
      } catch (error) {
        console.error('Error deleting attendee:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAttendee) {
        await axios.put(`${endpoints.attendees}/${currentAttendee.id}`, formData);
      } else {
        await axios.post(endpoints.attendees, formData);
      }
      setIsModalOpen(false);
      fetchAttendees();
    } catch (error) {
      console.error('Error saving attendee:', error);
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
        title="Attendees"
        columns={columns}
        data={attendees}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <SlideOver isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAttendee ? 'Edit Attendee' : 'Add Attendee'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInput
              label="First Name"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleInputChange}
            />

            <TextInput
              label="Last Name"
              id="last_name"
              name="last_name"
              required
              value={formData.last_name}
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

            <SelectInput
              label="Ticket Type"
              id="ticket_type"
              name="ticket_type"
              required
              value={formData.ticket_type}
              onChange={handleInputChange}
            >
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
              <option value="student">Student</option>
              <option value="speaker">Speaker</option>
              <option value="sponsor">Sponsor</option>
            </SelectInput>

            <SelectInput
              label="Status"
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="registered">Registered</option>
              <option value="checked_in">Checked In</option>
              <option value="cancelled">Cancelled</option>
              <option value="waitlisted">Waitlisted</option>
            </SelectInput>

            <TextInput
              label="Registration Date"
              id="registration_date"
              name="registration_date"
              type="date"
              required
              value={formData.registration_date}
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
            label="VIP Attendee"
            id="is_vip"
            name="is_vip"
            checked={formData.is_vip}
            onChange={handleInputChange}
          />

          <TextArea
            label="Dietary Restrictions"
            id="dietary_restrictions"
            name="dietary_restrictions"
            rows={2}
            value={formData.dietary_restrictions}
            onChange={handleInputChange}
          />

          <TextArea
            label="Special Requirements"
            id="special_requirements"
            name="special_requirements"
            rows={2}
            value={formData.special_requirements}
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
            submitLabel={currentAttendee ? 'Update' : 'Create'}
          />
        </form>
      </SlideOver>
    </div>
  );
}

export default Attendees; 