import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminSignup from './pages/AdminSignup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/change-password" 
                element={<ChangePassword />} 
              />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          {/* Global Language Switcher - Fixed at bottom */}
          <footer className="fixed bottom-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3">
              <LanguageSwitcher />
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
