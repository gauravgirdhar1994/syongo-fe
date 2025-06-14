import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import SlideOver from '../components/SlideOver';
import { TextInput, SelectInput, TextArea, Checkbox, FormActions } from '../components/FormElements';
import { endpoints } from '../config/api';

function AgendaItems() {
  const [agendaItems, setAgendaItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    event_id: '',
    speaker_id: '',
    location: '',
    type: 'session',
    status: 'scheduled',
    capacity: '',
    is_featured: false,
    materials_url: '',
    recording_url: '',
    notes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'start_time', label: 'Start Time' },
    { key: 'end_time', label: 'End Time' },
    { key: 'event_name', label: 'Event' },
    { key: 'speaker_name', label: 'Speaker' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
  ];

  useEffect(() => {
    fetchAgendaItems();
    fetchEvents();
    fetchSpeakers();
  }, [currentPage]);

  const fetchAgendaItems = async () => {
    try {
      const response = await axios.get(`${endpoints.agendaItems}?page=${currentPage}`);
      setAgendaItems(response.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching agenda items:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(endpoints.events);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const response = await axios.get(endpoints.speakers);
      setSpeakers(response.data);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    }
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      event_id: '',
      speaker_id: '',
      location: '',
      type: 'session',
      status: 'scheduled',
      capacity: '',
      is_featured: false,
      materials_url: '',
      recording_url: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      ...item,
      event_id: item.event_id.toString(),
      speaker_id: item.speaker_id.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this agenda item?')) {
      try {
        await axios.delete(`/api/agenda-items/${item.id}`);
        fetchAgendaItems();
      } catch (error) {
        console.error('Error deleting agenda item:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await axios.put(`/api/agenda-items/${currentItem.id}`, formData);
      } else {
        await axios.post('/api/agenda-items', formData);
      }
      setIsModalOpen(false);
      fetchAgendaItems();
    } catch (error) {
      console.error('Error saving agenda item:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <DataTable
        title="Agenda Items"
        columns={columns}
        data={agendaItems}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <SlideOver isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Edit Agenda Item' : 'Add Agenda Item'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInput
              label="Title"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
            />

            <TextInput
              label="Start Time"
              id="start_time"
              name="start_time"
              type="datetime-local"
              required
              value={formData.start_time}
              onChange={handleInputChange}
            />

            <TextInput
              label="End Time"
              id="end_time"
              name="end_time"
              type="datetime-local"
              required
              value={formData.end_time}
              onChange={handleInputChange}
            />

            <TextInput
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />

            <SelectInput
              label="Type"
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="keynote">Keynote</option>
              <option value="session">Session</option>
              <option value="workshop">Workshop</option>
              <option value="break">Break</option>
              <option value="networking">Networking</option>
            </SelectInput>

            <SelectInput
              label="Status"
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </SelectInput>

            <TextInput
              label="Capacity"
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
            />

            <TextInput
              label="Materials URL"
              id="materials_url"
              name="materials_url"
              type="url"
              value={formData.materials_url}
              onChange={handleInputChange}
            />

            <TextInput
              label="Recording URL"
              id="recording_url"
              name="recording_url"
              type="url"
              value={formData.recording_url}
              onChange={handleInputChange}
            />
          </div>

          <Checkbox
            label="Featured Item"
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

          <FormActions
            onCancel={() => setIsModalOpen(false)}
            submitLabel={currentItem ? 'Update' : 'Create'}
          />
        </form>
      </SlideOver>
    </div>
  );
}

export default AgendaItems; 