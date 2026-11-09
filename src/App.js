import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import LandingPage from './pages/LandingPage';
import CV from './pages/CV';

import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cv" element={<Navigate to="/cv/en" replace />} />
        <Route path="/cv/:lang" element={<CV />} />
      </Routes>
      <Analytics />
    </AppProvider>
  );
}

export default App;
