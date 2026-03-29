import React from "react";
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";

function MenuBar({name, icon, path}) {
  const { pathname } = useLocation();
  return ( 
    <Link
      type="button"
      to={path}
      className={`nav-bar ${ pathname === path && 'active' }`}
    >
      <span className="icon-nav"><img src={icon} alt="" /></span>
      <p>{ name }</p>
    </Link>
  );
}

MenuBar.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};

export default MenuBar;