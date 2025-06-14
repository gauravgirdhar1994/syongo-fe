import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, CalendarIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (
      credentials.email === DUMMY_CREDENTIALS.email &&
      credentials.password === DUMMY_CREDENTIALS.password
    ) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Info Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20 transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-white">SyonGo</h1>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Professional Event Excellence
          </h2>
          
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Elevate your professional events with our comprehensive platform. From international conferences to virtual seminars, manage every aspect of your event with precision and professionalism.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <CalendarIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Conference Management</h3>
                <p className="text-white/70 text-lg">Streamline international conferences, exhibitions, and professional seminars with our integrated management tools.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <UserGroupIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Virtual Event Solutions</h3>
                <p className="text-white/70 text-lg">Host seamless virtual seminars and hybrid events with our advanced digital infrastructure and engagement tools.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <BuildingOfficeIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Exhibition Management</h3>
                <p className="text-white/70 text-lg">Coordinate professional exhibitions with precision, from booth management to visitor tracking and analytics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative text-white/60 text-sm">
          © 2025 SyonGo. All rights reserved.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-lg text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white py-10 px-8 shadow-xl rounded-2xl animate-fade-in">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg" role="alert">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02] ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Demo Credentials
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
                <p className="font-medium">Email: admin@example.com</p>
                <p className="font-medium">Password: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 