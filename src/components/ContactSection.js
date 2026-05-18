import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDownload, FiChevronDown, FiMail } from 'react-icons/fi';
import '../styles/ContactSection.css';

function ContactSection() {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="contact-inner">

      <div className="contact-header section-header">
        <span className="section-tag">{'// contact'}</span>
        <h2 className="section-heading">{t('contact.sectionTitle')}</h2>
      </div>

      <div className="contact-email">
        <a href="mailto:jeandealmeida.dev@gmail.com" className="contact-email-link">
          <FiMail />
          jeandealmeida.dev@gmail.com
        </a>
      </div>

      <div className="contact-cv">
        <p className="contact-cv-label">{t('contact.cvLabel')}</p>
        <div className="cv-wrapper" ref={dropdownRef}>
          <button
            className="btn-cv"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <FiDownload />
            {t('home.downloadCv')}
            <FiChevronDown className={`chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="cv-dropdown">
              <a href="/cv_jeandealmeida.pdf" download onClick={() => setDropdownOpen(false)}>
                <FiDownload /> English
              </a>
              <a href="/cv_jeandealmeida.pdf" download onClick={() => setDropdownOpen(false)}>
                <FiDownload /> Português
              </a>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ContactSection;
