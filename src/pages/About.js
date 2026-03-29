import React from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import '../styles/About.css';
import IconCloud from '../components/IconCloud';
import { useTranslation, Trans } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  return (
    <>
      <TitleBar />
      <section className="flex-container">
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper about">
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
          </main>
        </section>
        <SideBar />
      </section>
      <Footer />
    </>
  );
}

export default About;