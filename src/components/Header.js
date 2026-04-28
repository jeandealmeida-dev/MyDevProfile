import React from "react";
import '../styles/Header.css';
import MenuBar from "../components/MenuBar";
import react_icon from '../images/react_icon.svg'
import js_icon from '../images/js_icon.svg'
import html_icon from '../images/html_icon.svg'
import css_icon from '../images/css_icon.svg'
import json_icon from '../images/json_icon.svg'
import markdown_icon from '../images/markdown_icon.svg'
import { useTranslation } from 'react-i18next';


function Header() {
  const { t } = useTranslation();
  return (
    <header className="header-container">
      <nav className="nav-container">
        <MenuBar
          icon={ react_icon }
          name={t('nav.home')}
          sectionId="home"
        />
        <MenuBar
          icon={ html_icon }
          name={t('nav.about')}
          sectionId="about"
        />
        <MenuBar
          icon={ markdown_icon }
          name={t('nav.experience')}
          sectionId="experience"
        />
        <MenuBar
          icon={ js_icon }
          name={t('nav.projects')}
          sectionId="projects"
        />
        <MenuBar
          icon={ json_icon }
          name={t('nav.recommendation')}
          sectionId="recommendation"
        />
        <MenuBar
          icon={ css_icon }
          name={t('nav.contact')}
          sectionId="contact"
        />
      </nav>
    </header>
  );
}

export default Header;