import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';

import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
