import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MoodProvider } from './contexts/MoodContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CapsuleComposer from './pages/CapsuleComposer';
import PublicFeed from './pages/PublicFeed';
import Settings from './pages/Settings';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/compose" element={<CapsuleComposer />} />
                <Route path="/public" element={<PublicFeed />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </MoodProvider>
    </AuthProvider>
  );
}

export default App;