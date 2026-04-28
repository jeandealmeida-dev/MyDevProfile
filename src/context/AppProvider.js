import PropTypes from "prop-types"
import React, { useState } from 'react';
import AppContext from './AppContext';

function Provider({children}) {
  const [activeSideBar, setActiveSideBar] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const state = {
    activeSideBar,
    setActiveSideBar,
    activeSection,
    setActiveSection,
  }
  return ( 
    <AppContext.Provider value={ state }>
      {children}
    </AppContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Provider;