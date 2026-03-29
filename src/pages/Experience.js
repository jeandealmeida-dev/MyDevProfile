import React from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import experiences from "../data/experiences";
import "../styles/Experience.css";
import { useTranslation } from 'react-i18next';

function Experience() {
  const { t } = useTranslation();
  return (
    <>
      <TitleBar />
      <section className="flex-container">
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper experience">
            <h1 className="title-experience">{t('experience.title')}</h1>
            <div className="experience-list">
              {experiences.map(({ id, company, client, role, highlights }) => (
                <div className="experience-card" key={id}>
                  <div className="experience-card-header">
                    <p className="experience-role">{role}</p>
                    <p className="experience-company">
                      {client ? `${company} · ${client}` : company}
                    </p>
                  </div>
                  <ul className="experience-highlights">
                    {highlights.map((key) => (
                      <li key={key}>{t(key)}</li>
                    ))}
                  </ul>
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

export default Experience;
