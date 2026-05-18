import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

const navItems = [
  { id: 'about',        labelKey: 'nav.about' },
  { id: 'experience',   labelKey: 'nav.experience' },
  { id: 'projects',     labelKey: 'nav.projects' },
  { id: 'testimonials', labelKey: 'nav.testimonials' },
  { id: 'contact',      labelKey: 'nav.contact' },
];

function Navbar() {
  const { t, i18n } = useTranslation();
  const [active, setActive]   = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -30% 0px' }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en-US' ? 'pt-BR' : 'en-US');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {navItems.map(({ id, labelKey }) => (
          <button
            key={id}
            className={`nav-link ${active === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button className="lang-toggle" onClick={toggleLang}>
          {i18n.language === 'en-US' ? 'PT' : 'EN'}
        </button>
      </div>

      <button
        className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {navItems.map(({ id, labelKey }) => (
            <button
              key={id}
              className={`mobile-nav-link ${active === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {t(labelKey)}
            </button>
          ))}
          <button className="lang-toggle mobile-lang" onClick={toggleLang}>
            {i18n.language === 'en-US' ? 'PT' : 'EN'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
