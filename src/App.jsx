import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Events from './pages/Events';
import Speakers from './pages/Speakers';
import Sponsors from './pages/Sponsors';
import Attendees from './pages/Attendees';
import EventView from './pages/EventView';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
			<Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventView />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/attendees" element={<Attendees />} />
      </Route>
    </Routes>
  );
}

export default App; 