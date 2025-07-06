import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { AUTH_ENDPOINTS } from '../services/api';

const ChangePassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await axios.post(AUTH_ENDPOINTS.SEND_RESET_PASSWORD_OTP, { email: formData.email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      await axios.post(AUTH_ENDPOINTS.VERIFY_RESET_PASSWORD_OTP, { email: formData.email, otp: formData.otp });
      toast.success('OTP verified successfully');
      setStep(3);
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/login');
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendOTP} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          {t('emailAddress')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder={t('enterEmail')}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('sendingOtp')}
          </div>
        ) : (
          t('sendVerificationCode')
        )}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{t('verifyEmail')}</h3>
        <p className="text-gray-600 mt-2">
          {t('verificationSent')} <span className="font-medium">{formData.email}</span>
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
          {t('verificationCode')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="otp"
            name="otp"
            type="text"
            required
            maxLength="6"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-center text-lg font-mono tracking-widest"
            placeholder={t('enterVerificationCode')}
            value={formData.otp}
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('verifyingOtp')}
          </div>
        ) : (
          t('verify')
        )}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{t('changePassword')}</h3>
        <p className="text-gray-600 mt-2">
          {t('createStrongPassword')}
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            {t('password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder={t('createStrongPassword')}
              value={formData.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            {t('confirmPassword')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder={t('confirmYourPassword')}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('loading')}
          </div>
        ) : (
          t('changePassword')
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">{t('email')}</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">{t('verify')}</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">{t('changePassword')}</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('changePassword')}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 && 'Enter your email to receive a reset code'}
              {step === 2 && 'Enter the verification code sent to your email'}
              {step === 3 && 'Create a new secure password'}
            </p>
          </div>

          {/* Form Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 