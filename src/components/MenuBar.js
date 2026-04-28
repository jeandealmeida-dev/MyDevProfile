import React, { useContext } from "react";
import PropTypes from 'prop-types';
import myContext from "../context/AppContext";

function MenuBar({name, icon, sectionId}) {
  const { activeSection, setActiveSideBar } = useContext(myContext);
  return (
    <a
      href={`#${sectionId}`}
      className={`nav-bar ${ activeSection === sectionId ? 'active' : '' }`}
      onClick={() => setActiveSideBar(false)}
    >
      <span className="icon-nav"><img src={icon} alt="" /></span>
      <p>{ name }</p>
    </a>
  );
}

MenuBar.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  sectionId: PropTypes.string.isRequired,
};

export default MenuBar;