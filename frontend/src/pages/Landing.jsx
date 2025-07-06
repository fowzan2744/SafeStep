import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              SafeStep
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              {t('signIn')}
            </Link>
            <Link 
              to={isAuthenticated() ? "/dashboard" : "/register"}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {isAuthenticated() ? t('goToDashboard') : t('getStarted')}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <div className="text-center py-12 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('staySafe')}
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {t('stayConnected')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              to={isAuthenticated() ? "/dashboard" : "/register"}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              {isAuthenticated() ? t('goToDashboard') : t('getProtectedNow')}
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="px-8 py-4 border-2 border-red-300 text-red-600 hover:bg-red-50 text-lg rounded-xl font-semibold transition-colors duration-200 flex items-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('emergency')}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-yellow-400 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>{t('trustIndicators.rating')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-pink-400 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{t('trustIndicators.protected')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{t('trustIndicators.available')}</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl hover:-translate-y-1 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{t('features.instantAlerts.title')}</h3>
            <p className="text-gray-600 text-sm">{t('features.instantAlerts.description')}</p>
          </div>
          
          <div className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl hover:-translate-y-1 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{t('features.liveLocation.title')}</h3>
            <p className="text-gray-600 text-sm">{t('features.liveLocation.description')}</p>
          </div>
          
          <div className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl hover:-translate-y-1 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{t('features.trustedNetwork.title')}</h3>
            <p className="text-gray-600 text-sm">{t('features.trustedNetwork.description')}</p>
          </div>
          
          <div className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl hover:-translate-y-1 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{t('features.alwaysReady.title')}</h3>
            <p className="text-gray-600 text-sm">{t('features.alwaysReady.description')}</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('readyToFeelSafer')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            {t('joinThousands')}
          </p>
          <Link 
            to={isAuthenticated() ? "/dashboard" : "/register"}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            {isAuthenticated() ? t('goToDashboard') : t('startFreeToday')}
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold">SafeStep</span>
          </div>
          <p className="text-gray-400">{t('empoweringSafety')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;