import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { FiHeadphones, FiUsers, FiBook, FiTarget, FiTrendingUp } from 'react-icons/fi';
import '../styles/AboutSection.css';

const PU = process.env.PUBLIC_URL;

const companies = [
  { name: 'Thoughtworks', expId: 1, imgSrc: `${PU}/thoughtworks_logo.jpeg` },
  { name: 'Magalu',       expId: 2, imgSrc: `${PU}/luizalabs_logo.jpeg` },
  { name: 'XP Inc',       expId: 3, imgSrc: `${PU}/xpinc_logo.jpeg` },
  { name: 'NTT Data',     expId: 4, imgSrc: `${PU}/nttdata_logo.jpeg` },
  { name: 'AB InBev',     expId: 4, imgSrc: `${PU}/ab_inbev_logo.jpeg` },
  { name: 'HubXP',        expId: 5, imgSrc: `${PU}/hubxp_logo.jpeg` },
  { name: 'Afya',         expId: 5, imgSrc: `${PU}/afyamedicina_logo.jpeg` },
  { name: 'OmniChat',     expId: 6, imgSrc: `${PU}/omnichat_logo.jpeg` },
  { name: 'SnowmanLabs',  expId: 7, imgSrc: `${PU}/snowman_labs_logo.jpeg` },
  { name: 'TOTVS',        expId: 8, imgSrc: `${PU}/totvs_logo.jpeg` },
  { name: 'Softin',       expId: 9, imgSrc: `${PU}/softin_logo.jpeg` },
];

function scrollToExperience(expId) {
  if (!expId) return;
  const expSection = document.getElementById('experience');
  if (expSection) {
    const top = expSection.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  setTimeout(() => {
    const card = document.getElementById(`exp-card-${expId}`);
    if (!card) return;
    const scrollContainer = card.closest('.sm-scroll');
    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const targetScrollLeft =
        scrollContainer.scrollLeft +
        cardRect.left - containerRect.left -
        containerRect.width / 2 +
        cardRect.width / 2;
      scrollContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
    card.classList.add('exp-card--highlighted');
    setTimeout(() => card.classList.remove('exp-card--highlighted'), 2000);
  }, 700);
}

const softSkills = [
  { icon: FiHeadphones, labelKey: 'about.skillListening'    },
  { icon: FiUsers,      labelKey: 'about.skillCollaboration' },
  { icon: FiBook,       labelKey: 'about.skillMentoring'    },
  { icon: FiTarget,     labelKey: 'about.skillDetail'       },
  { icon: FiTrendingUp, labelKey: 'about.skillResilience'   },
];

function AboutSection() {
  const { t } = useTranslation();

  return (
    <div className="about-inner">

      <div className="about-header">
        <span className="section-tag">{'// about'}</span>
        <h2 className="section-heading">
          <Trans i18nKey="about.sectionTitle" components={{ accent: <span className="heading-accent" /> }} />
        </h2>
      </div>

      <div className="about-selection">
        <div className="selection-frame-group" aria-hidden="true">
        <div className="about-selection-frame" />
        <span className="frame-corner fc-tl" />
        <span className="frame-corner fc-tr" />
        <span className="frame-corner fc-bl" />
        <div className="selection-cursor">
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L1 17L5 12.5L7.5 19L10.5 17.8L8 11.5H14L1 1Z" fill="white" stroke="#1565C0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Photo + Bio */}
      <div className="bento-card bento-photo-bio">
        <div className="about-photo-wrapper">
          <img src={`${PU}/profile-image2.jpg`} alt="Jean Paulo" className="about-photo" />
        </div>
        <div className="bento-bio-text">
          <p className="about-paragraph">
            <Trans i18nKey="about.bio1" components={{ highlight: <span className="about-highlight" /> }} />
          </p>
          <p className="about-paragraph">
            <Trans i18nKey="about.bio2" components={{ highlight: <span className="about-highlight" /> }} />
          </p>
          <p className="about-paragraph">
            <Trans i18nKey="about.bio3" components={{ highlight: <span className="about-highlight" /> }} />
          </p>

          <div className="bio-skills">
            {softSkills.map(({ icon: Icon, labelKey }) => (
              <div key={labelKey} className="bio-skill-chip">
                <Icon className="bio-skill-icon" />
                <span>{t(labelKey)}</span>
              </div>
            ))}
          </div>

          <div className="bio-companies">
            <p className="companies-label">{t('home.workedAt')}</p>
            <div className="marquee-wrapper">
              <div className="marquee-track">
                {[...companies, ...companies].map((c, i) => (
                  <button
                    key={i}
                    className="company-chip"
                    onClick={() => scrollToExperience(c.expId)}
                    aria-label={`See ${c.name} experience`}
                  >
                    <div className="company-logo-badge">
                      <img src={c.imgSrc} alt={c.name} className="company-logo-img" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>{/* end about-selection */}

    </div>
  );
}

export default AboutSection;
