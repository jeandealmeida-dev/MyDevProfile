import React, { useState, useRef, useEffect, useContext } from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import IconCloud from '../components/IconCloud';
import Typical from 'react-typical';
import { FiDownload, FiChevronDown, FiExternalLink, FiGithub } from 'react-icons/fi';
import { useTranslation, Trans } from 'react-i18next';
import projects from "../data/projects";
import experiences from "../data/experiences";
import recommendation from "../data/recommendation";
import contacts from "../data/contacts";
import myContext from "../context/AppContext";
import '../styles/Landing.css';
import '../styles/Home.css';
import '../styles/About.css';
import '../styles/Experience.css';
import '../styles/Projects.css';
import '../styles/Recommendation.css';
import '../styles/Contact.css';

const SECTIONS = ['home', 'about', 'experience', 'projects', 'recommendation', 'contact'];

function Landing() {
  const { t } = useTranslation();
  const { setActiveSection } = useContext(myContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [setActiveSection]);

  const filterProjects = () => {
    if (typeFilter === 'all') return projects;
    return projects.filter(({ type }) => type.includes(typeFilter));
  };

  return (
    <>
      <TitleBar />
      <section className="flex-container">
        <SideBar />
        <section className="main-container">
          <Header />
          <MenuMobile />

          {/* Home */}
          <section id="home" className="main-wrapper home">
            <div className="home-content">
              <p><span className="span">{'<'}</span>{t('home.greeting')}</p>
              <h1>Jean Paulo de Almeida<span className="span">{'/>'}</span></h1>
              <Typical
                steps={['Mobile Software Engineer', 1000, 'Android Developer', 1000, 'Enthusiast Backend Developer', 1000]}
                loop={Infinity}
                wrapper="h2"
              />
              <div className="cv-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="btn-download"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {t('home.downloadCv')}
                  <FiChevronDown className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="cv-dropdown">
                    <a href="/cv_jeandealmeida_en.pdf" download onClick={() => setDropdownOpen(false)}>
                      <FiDownload /> English
                    </a>
                    <a href="/cv_jeandealmeida_pt.pdf" download onClick={() => setDropdownOpen(false)}>
                      <FiDownload /> Português
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about" className="main-wrapper about">
            <div className="about-container">
              <h1 className="title-about">{t('about.title')}</h1>
              <p className="text-about">
                <Trans i18nKey="about.bio1" components={{ highlight: <span className="span-highlight" /> }} />
              </p>
              <p className="text-about">
                <Trans i18nKey="about.bio2" components={{ highlight: <span className="span-highlight" /> }} />
              </p>
              <p className="text-about">
                <Trans i18nKey="about.bio3" components={{ highlight: <span className="span-highlight" /> }} />
              </p>
              <p className="text-about last">
                <Trans i18nKey="about.bio4" components={{ highlight: <span className="span-highlight" /> }} />
              </p>
            </div>
            <IconCloud />
          </section>

          {/* Experience */}
          <section id="experience" className="main-wrapper experience">
            <h1 className="title-experience">{t('experience.title')}</h1>
            <div className="experience-list">
              {experiences.map(({ id, company, client, role, period, highlights }) => (
                <div className="experience-card" key={id}>
                  <div className="experience-card-header">
                    <p className="experience-role">{role}</p>
                    <p className="experience-company">
                      {client ? `${company} · ${client}` : company}
                    </p>
                    {period && <p className="experience-period">{period}</p>}
                  </div>
                  <ul className="experience-highlights">
                    {highlights.map((key) => (
                      <li key={key}>{t(key)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="main-wrapper projects">
            <h1 className="title-page-projects">{t('projects.title')}</h1>
            <div className="btn-container">
              <button
                type="button"
                className={`btn-filter ${typeFilter === 'all' && 'active'}`}
                onClick={() => setTypeFilter('all')}
              >
                {t('projects.filterAll')}
              </button>
              <button
                type="button"
                className={`btn-filter ${typeFilter === 'android' && 'active'}`}
                onClick={() => setTypeFilter('android')}
              >
                {t('projects.filterAndroid')}
              </button>
              <button
                type="button"
                className={`btn-filter ${typeFilter === 'flutter' && 'active'}`}
                onClick={() => setTypeFilter('flutter')}
              >
                {t('projects.filterFlutter')}
              </button>
            </div>
            <div className="projects-container">
              {filterProjects().map(({ id, name, descriptionKey, src, repository, site, technologies }) => (
                <div key={id} className="card-project">
                  <div className="img-container">
                    <img src={src} alt={`Screenshot of ${name} project`} className="img-project" />
                  </div>
                  <h2 className="title-project">{name}</h2>
                  <p>{t(descriptionKey)}</p>
                  <div className="technologies-container">
                    {technologies.map((tech) => (
                      <span key={tech} className="span-technologies">{tech}</span>
                    ))}
                  </div>
                  <div className="links-container">
                    <a href={repository} title="Github" target="_blank" rel="noreferrer"><FiGithub /></a>
                    <a href={site} title={t('projects.viewApp')} target="_blank" rel="noreferrer"><FiExternalLink /></a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation */}
          <section id="recommendation" className="main-wrapper recommendation">
            <h1 className="title-recommendation">{t('recommendation.title')}</h1>
            <div className="recommendation-container">
              {recommendation.map(({ name, messageKey, social }, index) => (
                <div className={`recommendation-card ${index === 1 && 'border'}`} key={name}>
                  <p>{t(messageKey)}</p>
                  <a href={social} target="_blank" rel="noreferrer"><h2>{name}</h2></a>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="main-wrapper contact">
            <div className="title-container">
              <h1 className="title-contact">{t('contact.title')}</h1>
              <h2 className="message-contact">{t('contact.quote')}</h2>
            </div>
            <div className="list-contact">
              <p className="class-name line">.contatos<span className="element">{' {'}</span></p>
              {contacts.map(({ social, href, text }) => (
                <p className="key-name line" key={social}>{social}:{' '}
                  <a href={href} target="_blank" rel="noreferrer">{text}</a>;
                </p>
              ))}
              <p className="element line">{'}'}</p>
            </div>
          </section>

        </section>
      </section>
      <Footer />
    </>
  );
}

export default Landing;
