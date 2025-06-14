import React, { useState } from 'react';
import {
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const stats = [
  {
    name: 'Total Events',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: CalendarIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Speakers',
    value: '48',
    change: '+8%',
    trend: 'up',
    icon: UserGroupIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Total Sponsors',
    value: '16',
    change: '-2%',
    trend: 'down',
    icon: BuildingOfficeIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Registered Attendees',
    value: '1,234',
    change: '+24%',
    trend: 'up',
    icon: UserIcon,
    color: 'bg-orange-500',
  },
];

const upcomingEvents = [
  {
    id: 1,
    name: 'Tech Conference 2024',
    date: 'Mar 15, 2024',
    attendees: 234,
    status: 'upcoming',
  },
  {
    id: 2,
    name: 'Design Workshop',
    date: 'Mar 20, 2024',
    attendees: 156,
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'AI Summit',
    date: 'Mar 25, 2024',
    attendees: 312,
    status: 'upcoming',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'event',
    action: 'created',
    name: 'Tech Conference 2024',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'speaker',
    action: 'registered',
    name: 'John Doe',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'sponsor',
    action: 'joined',
    name: 'Tech Corp',
    time: '1 day ago',
  },
];

function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const eventTypeData = {
    labels: ['Conference', 'Workshop', 'Seminar', 'Networking'],
    datasets: [
      {
        label: 'Events by Type',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                <div className="mt-2 flex items-center">
                  {stat.trend === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`ml-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-80">
            <Line
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      drawBorder: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Event Types Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Events by Type</h3>
          <div className="h-80">
            <Bar
              data={eventTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      drawBorder: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{event.name}</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {event.attendees}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  {activity.type === 'event' && (
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                  )}
                  {activity.type === 'speaker' && (
                    <UserGroupIcon className="h-5 w-5 text-green-500" />
                  )}
                  {activity.type === 'sponsor' && (
                    <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.action} {activity.type}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 