import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGithub } from 'react-icons/fi';
import projects from '../data/projects';
import '../styles/ProjectsSection.css';

const SignalIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
    <rect x="0"    y="6"  width="3" height="6"  rx="1" opacity="0.35"/>
    <rect x="4.5"  y="4"  width="3" height="8"  rx="1" opacity="0.55"/>
    <rect x="9"    y="2"  width="3" height="10" rx="1" opacity="0.75"/>
    <rect x="13.5" y="0"  width="3" height="12" rx="1"/>
  </svg>
);

const WifiIcon = () => (
  <svg width="17" height="13" viewBox="0 0 17 13" fill="currentColor">
    <path d="M8.5 10.5a1.5 1.5 0 100 2 1.5 1.5 0 000-2z"/>
    <path d="M5.1 7.9a4.8 4.8 0 016.8 0l1.2-1.2a6.5 6.5 0 00-9.2 0l1.2 1.2z" opacity="0.7"/>
    <path d="M2.3 5.1a8.8 8.8 0 0112.4 0l1.2-1.2A10.5 10.5 0 001.1 3.9l1.2 1.2z" opacity="0.4"/>
  </svg>
);

const BatteryIcon = () => (
  <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
    <rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <rect x="22" y="3.5" width="2" height="5" rx="1" opacity="0.5"/>
    <rect x="1.5" y="2.5" width="15" height="7" rx="1.5" opacity="0.9"/>
  </svg>
);

const PhoneFrame = ({ selected, exiting, onOpen, onClose }) => {

  return (
    <div className="phone-shell">
      <div className="phone-btn phone-btn--vol-up" />
      <div className="phone-btn phone-btn--vol-down" />
      <div className="phone-btn phone-btn--power" />

      <div className="phone-screen">
        {/* Punch-hole camera */}
        <div className="phone-punch-hole" />

        {/* Status bar — always on top */}
        <div className="phone-status">
          <span className="phone-time">9:41</span>
          <div className="phone-status-icons">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* Home screen */}
        <div className={`phone-home${selected && !exiting ? ' phone-home--behind' : ''}`}>
          <div className="phone-wallpaper" />
          <div className="app-grid">
            {projects.map(p => (
              <button key={p.id} className="app-icon-btn" onClick={() => onOpen(p)}>
                <div className="app-icon" style={{ background: p.color }}>
                  <span className="app-glyph">{p.icon}</span>
                </div>
                <span className="app-label">{p.shortName}</span>
              </button>
            ))}
          </div>
          <div className="android-nav">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="android-nav-icon">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="android-nav-home" />
            <div className="android-nav-recents" />
          </div>
        </div>

        {/* App view */}
        {selected && (
          <div className={`phone-app${exiting ? ' phone-app--exiting' : ''}`}>
            <div className="phone-app-topbar">
              <button className="phone-back-btn" onClick={onClose}>
                <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                  <path d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="phone-app-title">{selected.shortName}</span>
            </div>
            <div className="phone-app-body">
              {selected.gifSrc ? (
                <img src={selected.gifSrc} alt={selected.name} className="phone-app-media" />
              ) : (
                <div className="phone-app-placeholder" style={{ background: selected.color }}>
                  <span className="phone-placeholder-glyph">{selected.icon}</span>
                  <span className="phone-placeholder-label">{selected.name}</span>
                  <span className="phone-placeholder-hint">Preview coming soon</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function ProjectsSection() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [exiting, setExiting] = useState(false);

  const openApp = (project) => {
    if (exiting) return;
    setSelected(project);
  };

  const closeApp = () => {
    setExiting(true);
    setTimeout(() => {
      setSelected(null);
      setExiting(false);
    }, 280);
  };

  return (
    <div className="proj-inner">
      <div className="proj-header section-header">
        <span className="section-tag">{'// projects'}</span>
        <h2 className="section-heading">{t('projects.title')}</h2>
      </div>

      <div className="proj-stage">
        <div className="proj-device">
          <PhoneFrame
            selected={selected}
            exiting={exiting}
            onOpen={openApp}
            onClose={closeApp}
          />

        <div className="proj-panel">
          {selected ? (
            <div className="play-listing" key={selected.id}>
              <div className="play-header">
                <div className="play-icon" style={{ background: selected.color }}>
                  <span>{selected.icon}</span>
                </div>
                <div className="play-title-block">
                  <h3 className="play-app-name">{selected.name}</h3>
                  <span className="play-developer">Jean Paulo</span>
                  <span className="play-category">{selected.type === 'flutter' ? 'Flutter' : 'Android'}</span>
                </div>
              </div>

              <div className="play-divider" />

              <a
                href={selected.repository}
                target="_blank"
                rel="noreferrer"
                className="play-install-btn"
              >
                Install
              </a>

              <div className="play-about">
                <span className="play-about-label">About this app</span>
                <p className="play-about-text">{t(selected.descriptionKey)}</p>
              </div>

              <div className="play-chips">
                {selected.technologies.map(tech => (
                  <span key={tech} className="play-chip">{tech}</span>
                ))}
              </div>

              <div className="play-divider" />

              <a
                href={selected.repository}
                target="_blank"
                rel="noreferrer"
                className="play-source-link"
              >
                <FiGithub size={13} />
                <span>{t('projects.viewApp')}</span>
              </a>
            </div>
          ) : (
            <div className="proj-hint">
              <div className="proj-hint-arrow">←</div>
              <p>{t('projects.tapHint')}</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;
