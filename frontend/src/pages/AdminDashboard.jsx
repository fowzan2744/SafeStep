import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [alertFilter, setAlertFilter] = useState('active'); // 'active', 'resolved', 'all'
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0
  });
  const navigate = useNavigate();

  // Admin authentication check
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin');
      return;
    }
    loadDashboardData();
  }, [navigate, adminToken]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load users, alerts, and stats in parallel
      const [usersRes, alertsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers: getAuthHeaders() }),
        axios.get('http://localhost:5000/api/admin/alerts', { headers: getAuthHeaders() }),
        axios.get('http://localhost:5000/api/admin/stats', { headers: getAuthHeaders() })
      ]);

      setUsers(usersRes.data.users || []);
      setAlerts(alertsRes.data.alerts || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
        return;
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics', { 
        headers: getAuthHeaders(),
        params: { period: analyticsPeriod }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAlertStatusUpdate = async (alertId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/alerts/${alertId}/status`, 
        { status }, 
        { headers: getAuthHeaders() }
      );
      toast.success('Alert status updated');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update alert status');
    }
  };

  const handleUserStatusToggle = async (userId, isActive) => {
    try {
      const payload = { isActive };
      if (!isActive && deactivationReason) {
        payload.reason = deactivationReason;
      }
      
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/status`, 
        payload, 
        { headers: getAuthHeaders() }
      );
      
      const action = isActive ? 'activated' : 'deactivated';
      toast.success(`User ${action} successfully`);
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleExportData = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/export`, {
        headers: getAuthHeaders(),
        params: { type, format: 'csv' },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${type} data exported successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getAlertStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_alarm': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredAlerts = () => {
    if (alertFilter === 'all') return alerts;
    return alerts.filter(alert => alert.status === alertFilter);
  };

  // Chart configurations
  const getAlertTrendsChartData = () => {
    if (!analyticsData?.alertTrends) return null;
    
    return {
      labels: analyticsData.alertTrends.map(item => {
        const date = new Date(item._id);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Emergency Alerts',
          data: analyticsData.alertTrends.map(item => item.count),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };

  const getAlertStatusChartData = () => {
    if (!analyticsData?.alertStatusDistribution) return null;
    
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#6b7280'];
    
    return {
      labels: analyticsData.alertStatusDistribution.map(item => 
        item._id.charAt(0).toUpperCase() + item._id.slice(1)
      ),
      datasets: [
        {
          data: analyticsData.alertStatusDistribution.map(item => item.count),
          backgroundColor: colors.slice(0, analyticsData.alertStatusDistribution.length),
          borderWidth: 2,
          borderColor: '#ffffff',
        }
      ]
    };
  };

  const getAlertsByHourChartData = () => {
    if (!analyticsData?.alertsByHour) return null;
    
    // Create array for all 24 hours
    const hourData = new Array(24).fill(0);
    analyticsData.alertsByHour.forEach(item => {
      hourData[item._id] = item.count;
    });
    
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Alerts by Hour',
          data: hourData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        }
      ]
    };
  };

  const getRecentActivityChartData = () => {
    if (!analyticsData?.recentActivity) return null;
    
    return {
      labels: analyticsData.recentActivity.map(item => {
        const date = new Date(item._id);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Total Alerts',
          data: analyticsData.recentActivity.map(item => item.alerts),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
        {
          label: 'Resolved',
          data: analyticsData.recentActivity.map(item => item.resolved),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
        },
        {
          label: 'Active',
          data: analyticsData.recentActivity.map(item => item.active),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  if (!adminToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SafeStep Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Monitor and manage the platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, {adminUser.name || 'Admin'}
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to App
              </button>
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'alerts', label: 'Alerts', icon: '🚨' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'system', label: 'System', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalAlerts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.activeAlerts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Resolved Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.resolvedAlerts}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
                    </div>
                    <div className="p-6">
                      {getFilteredAlerts().slice(0, 5).map((alert) => (
                        <div key={alert._id} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {alert.userId?.name || alert.userId || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(alert.createdAt)}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAlertStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
                    </div>
                    <div className="p-6">
                      {users.slice(0, 5).map((user) => (
                        <div key={user._id} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <button
                    onClick={() => handleExportData('users')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Users
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-indigo-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.isActive ? (
                              <button
                                onClick={() => {
                                  setShowDeactivateModal(true);
                                  setSelectedUser(user);
                                }}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserStatusToggle(user._id, true)}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Emergency Alerts</h3>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Filter:</label>
                      <select
                        value={alertFilter}
                        onChange={(e) => setAlertFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="active">Active Alerts</option>
                        <option value="resolved">Resolved Alerts</option>
                        <option value="all">All Alerts</option>
                      </select>
                      <button
                        onClick={() => handleExportData('alerts')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Alerts
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredAlerts().map((alert) => (
                        <tr key={alert._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {alert.userId?.name || alert.userId || 'Unknown User'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {alert.location?.latitude?.toFixed(4)}, {alert.location?.longitude?.toFixed(4)}
                            </div>
                            <div className="text-sm text-gray-500">{alert.location?.address || 'Unknown Location'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAlertStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(alert.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {alert.status === 'active' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAlertStatusUpdate(alert._id, 'resolved')}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleAlertStatusUpdate(alert._id, 'false_alarm')}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium hover:bg-yellow-200 transition-colors"
                                >
                                  Mark as False Alarm
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Analytics Controls */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Time Period:</label>
                      <select
                        value={analyticsPeriod}
                        onChange={(e) => {
                          setAnalyticsPeriod(e.target.value);
                          loadAnalyticsData();
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                      </select>
                      <button
                        onClick={loadAnalyticsData}
                        disabled={analyticsLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {analyticsLoading ? 'Loading...' : 'Refresh'}
                      </button>
                    </div>
                  </div>
                </div>

                {analyticsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Analytics Summary Cards */}
                    {analyticsData && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {analyticsData.alertTrends?.reduce((sum, item) => sum + item.count, 0) || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Resolved</p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {analyticsData.alertStatusDistribution?.find(item => item._id === 'resolved')?.count || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Active</p>
                              <p className="text-2xl font-semibold text-gray-900">
                                {analyticsData.alertStatusDistribution?.find(item => item._id === 'active')?.count || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Active Users</p>
                              <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalUsers || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Alert Trends Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Emergency Alert Trends (Last {analyticsPeriod === '7d' ? '7' : analyticsPeriod === '30d' ? '30' : '90'} Days)
                      </h3>
                      <div className="h-80">
                        {getAlertTrendsChartData() ? (
                          <Line data={getAlertTrendsChartData()} options={chartOptions} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No alert data available for the selected period
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Alert Status Distribution */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Status Distribution</h3>
                        <div className="h-80">
                          {getAlertStatusChartData() ? (
                            <Doughnut data={getAlertStatusChartData()} options={doughnutOptions} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              No status data available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Alerts by Hour */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts by Hour of Day</h3>
                        <div className="h-80">
                          {getAlertsByHourChartData() ? (
                            <Bar data={getAlertsByHourChartData()} options={chartOptions} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              No hourly data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity (Last 7 Days)</h3>
                      <div className="h-80">
                        {getRecentActivityChartData() ? (
                          <Bar data={getRecentActivityChartData()} options={chartOptions} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No recent activity data available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Users by Alerts */}
                    {analyticsData?.topUsersByAlerts && analyticsData.topUsersByAlerts.length > 0 && (
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Users by Alert Count</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Count</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {analyticsData.topUsersByAlerts.map((user, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-indigo-600">
                                          {user.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                      {user.alertCount} alerts
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API Status</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Database</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email Service</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="text-sm font-medium text-gray-900">~150ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="text-sm font-medium text-gray-900">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Sessions</span>
                        <span className="text-sm font-medium text-gray-900">247</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Logs</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div>2024-01-15 14:30:22 - User registration successful</div>
                      <div>2024-01-15 14:28:15 - Emergency alert sent</div>
                      <div>2024-01-15 14:25:08 - Email notification delivered</div>
                      <div>2024-01-15 14:22:45 - Database backup completed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

             {/* Deactivate User Modal */}
       {showDeactivateModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Deactivate User</h3>
             <p className="text-sm text-gray-600 mb-4">
               Are you sure you want to deactivate <strong>{selectedUser.name}</strong> ({selectedUser.email})?
             </p>
             <p className="text-xs text-gray-500 mb-4">
               This will prevent the user from logging in and sending emergency alerts.
             </p>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Deactivation Reason (Optional)
               </label>
               <textarea
                 value={deactivationReason}
                 onChange={(e) => setDeactivationReason(e.target.value)}
                 placeholder="Enter reason for deactivation..."
                 rows={3}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
               />
             </div>
             <div className="flex space-x-3">
               <button
                 onClick={() => {
                   setShowDeactivateModal(false);
                   setSelectedUser(null);
                   setDeactivationReason('');
                 }}
                 className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={() => {
                   handleUserStatusToggle(selectedUser._id, false);
                   setShowDeactivateModal(false);
                   setSelectedUser(null);
                   setDeactivationReason('');
                 }}
                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
               >
                 Deactivate User
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default AdminDashboard; 