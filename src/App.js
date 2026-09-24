import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import LandingPage from './pages/LandingPage';

import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Analytics />
    </AppProvider>
  );
}

export default App;
