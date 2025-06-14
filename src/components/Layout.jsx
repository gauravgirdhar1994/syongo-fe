import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Speakers', href: '/speakers', icon: UserGroupIcon },
  { name: 'Agenda Items', href: '/agenda-items', icon: ClockIcon },
  { name: 'Sponsors', href: '/sponsors', icon: BuildingOfficeIcon },
  { name: 'Attendees', href: '/attendees', icon: UserIcon },
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-16 lg:w-64 bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-primary-700/50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <span className="text-white font-semibold text-lg">S</span>
            </div>
            <h1 className="text-xl font-semibold text-white hidden lg:block">SyonGo</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-lg shadow-primary-900/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="ml-3 hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700/50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-white/70">admin@example.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg transition-colors duration-200 ml-auto"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-white shadow-sm border-b border-gray-100">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-500">Overview</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Notifications */}
              <button
                type="button"
                className="relative p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="animate-fade-in max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout; 