import React from "react";
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer-container">
      <div className="links-footer">
        <p>{t('footer.findMe')}</p>
        <a href="https://www.linkedin.com/in/jeanalmeida/" 
          target="_blank" 
          className="icon-container" 
          rel="noreferrer"
        >
          <BsLinkedin className="icon-footer"/>
        </a>
        <a href="https://github.com/jeandealmeida-dev" 
          target="_blank" 
          className="icon-container" 
          rel="noreferrer"
        >
          <BsGithub className="icon-footer"/>
        </a>
      </div>
      
      <p className="text-footer">{t('footer.developedBy')}</p>
      {/* <select className="select-language">
        <option>🇧🇷 pt-BR</option>
        <option>🇺🇸 en-US</option>
      </select> */}
    </footer>
  );
}

export default Footer;