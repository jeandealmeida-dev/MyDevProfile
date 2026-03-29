import React, { useState } from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import projects from "../data/projects";
import "../styles/Projects.css";
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function Projects() {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState('all');
  const filterProjects = () => {
    if (typeFilter === 'all') return projects;
    return projects.filter(({type}) => type.includes(typeFilter));
  };

  return (
    <>
      <TitleBar />
      <section className="flex-container">
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper projects">
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
              {filterProjects().map(({id, name, descriptionKey, src, repository, site, technologies }) => (
                <div key={id} className="card-project">
                  <div className="img-container">
                    <img src={src} alt={`Screenshot of ${name} project`} className="img-project"/>
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
          </main>
        </section>
        <SideBar />
      </section>
      <Footer />
    </>
  );
}

export default Projects;