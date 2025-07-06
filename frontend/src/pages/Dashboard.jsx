import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import EmergencyServicesMap from '../components/EmergencyServicesMap.jsx';
import { 
  EMERGENCY_CONTACTS_ENDPOINTS, 
  EMERGENCY_ALERTS_ENDPOINTS, 
  USER_ENDPOINTS,
  getAuthHeaders 
} from '../services/api';

// Contact structure: { id: string, name: string, email: string }

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ contacts: 0, totalAlerts: 0, activeAlerts: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { logout, user, getToken } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    loadContacts();
    loadStats();
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(t('locationAccessError'));
        }
      );
    }
  }, [navigate, t]);

  const loadContacts = async () => {
    try {
      const response = await axios.get(EMERGENCY_CONTACTS_ENDPOINTS.GET_ALL, {
        headers: getAuthHeaders()
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error(t('failedToLoadContacts'));
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(USER_ENDPOINTS.DASHBOARD_STATS, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const validateContact = () => {
    const errors = {};
    if (!newContact.name.trim()) {
      errors.name = t('contactNameRequired');
    }
    if (!newContact.email.trim()) {
      errors.email = t('contactEmailRequired');
    } else if (!/\S+@\S+\.\S+/.test(newContact.email)) {
      errors.email = t('invalidEmail');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddContact = async () => {
    if (!validateContact()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(EMERGENCY_CONTACTS_ENDPOINTS.ADD, newContact, {
        headers: getAuthHeaders()
      });
      setContacts([...contacts, response.data]);
      setNewContact({ name: '', email: '' });
      setShowAddForm(false);
      setFormErrors({});
      toast.success(t('contactAdded'));
      loadStats(); // Refresh stats
    } catch (error) {
      const message = error.response?.data?.message || t('failedToAddContact');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setNewContact({ name: '', email: '' });
      setFormErrors({});
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(EMERGENCY_CONTACTS_ENDPOINTS.DELETE(id), {
        headers: getAuthHeaders()
      });
      setContacts(contacts.filter(c => c._id !== id));
      toast.success(t('contactRemoved'));
      loadStats(); // Refresh stats
    } catch (error) {
      const message = error.response?.data?.message || t('failedToRemoveContact');
      toast.error(message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleEmergencyAlert = async () => {
    if (contacts.length === 0) {
      toast.error(t('addContactsFirst'));
      return;
    }
    
    if (!userLocation) {
      toast.error(t('locationNotAvailable'));
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const alertData = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        address: 'Current location'
      };
      
      const response = await axios.post(EMERGENCY_ALERTS_ENDPOINTS.SEND, alertData, {
        headers: getAuthHeaders()
      });
      
      toast.success(t('emergencyAlertSent'));
      loadStats(); // Refresh stats
    } catch (error) {
      const message = error.response?.data?.message || t('failedToSendAlert');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                {t('dashboard')}
              </h1>
              <p className="text-lg text-gray-600">{t('personalSafetyCommand')}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('active')}
              </div>
              <Link
                to="/change-password"
                className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                {t('changePassword')}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
              >
                {t('logout')}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('emergencyContacts')}</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.contacts}</p>
                </div>
                <svg className="h-8 w-8 text-indigo-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('locationStatus')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {userLocation ? t('activeStatus') : t('inactiveStatus')}
                  </p>
                </div>
                <svg className="h-8 w-8 text-green-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('totalAlerts')}</p>
                  <p className="text-2xl font-bold text-red-600">{stats.totalAlerts}</p>
                </div>
                <svg className="h-8 w-8 text-red-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Alert Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleEmergencyAlert}
            disabled={loading || contacts.length === 0 || !userLocation}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {t('sendEmergencyAlert')}
            </div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {t('emergencyContacts')}
              </h2>
              <button
                onClick={toggleAddForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {showAddForm ? t('cancel') : t('addContact')}
              </button>
            </div>

            {/* Add Contact Form */}
            {showAddForm && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-3">{t('addNewContact')}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      {t('contactName')}
                    </label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder={t('enterContactName')}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      {t('contactEmail')}
                    </label>
                    <input
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder={t('enterContactEmail')}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddContact}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {loading ? t('addingContact') : t('addContact')}
                    </button>
                    <button
                      onClick={toggleAddForm}
                      className="px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact List */}
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-gray-500">{t('noContactsYet')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('addContactsToReceive')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact._id} className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-indigo-900">{contact.name}</h4>
                          <p className="text-sm text-indigo-700">{contact.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title={t('removeContact')}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Services Map */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Emergency Services Map
            </h2>
            <div className="min-h-[500px] rounded-lg overflow-hidden">
              <EmergencyServicesMap userLocation={userLocation} />
            </div>
          </div>
        </div>

        {/* Emergency Services Providers */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 mb-6">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('emergencyServicesDirectory')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('quickAccessDescription')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Police */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">{t('police')}</h4>
                    <p className="text-sm text-blue-700">{t('emergencyResponse')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-800">999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-blue-700">police@moi.gov.qa</span>
                  </div>
                </div>
              </div>

              {/* Fire Department */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900">{t('fireDepartment')}</h4>
                    <p className="text-sm text-red-700">{t('fireRescue')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-red-800">999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-red-700">fire@civildefense.gov.qa</span>
                  </div>
                </div>
              </div>

              {/* Ambulance */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">{t('ambulance')}</h4>
                    <p className="text-sm text-green-700">{t('medicalEmergency')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-green-700">emergency@hamad.qa</span>
                  </div>
                </div>
              </div>

              {/* Poison Control */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">{t('poisonControl')}</h4>
                    <p className="text-sm text-purple-700">{t('toxicExposure')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-800">999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-purple-700">poison@hamad.qa</span>
                  </div>
                </div>
              </div>

              {/* Domestic Violence Hotline */}
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-900">{t('domesticViolence')}</h4>
                    <p className="text-sm text-pink-700">{t('support247')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-pink-800">1-800-799-7233</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-pink-700">support@domesticviolence.org</span>
                  </div>
                </div>
              </div>

              {/* Suicide Prevention */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900">{t('suicidePrevention')}</h4>
                    <p className="text-sm text-indigo-700">{t('crisisSupport')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium text-indigo-800">988</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-indigo-700">crisis@988lifeline.org</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">{t('quickActions')}</h4>
              <div className="flex flex-wrap gap-3">
                                  <button 
                    onClick={() => window.open('tel:999', '_self')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t('call999')}
                  </button>
                  <button 
                    onClick={() => window.open('tel:999', '_self')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t('poisonControlCall')}
                  </button>
                  <button 
                    onClick={() => window.open('tel:999', '_self')}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t('crisisLine')}
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            {t('safetyPriority')}
          </p>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;