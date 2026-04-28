import React from 'react';
import './App.css';
import Landing from './pages/Landing';
import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <Landing />
    </AppProvider>
  );
}

export default App;
