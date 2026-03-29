import React from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import recommendation from "../data/recommendation";
import "../styles/Recommendation.css";
import { useTranslation } from 'react-i18next';

function Recommendation() {
  const { t } = useTranslation();
  return (
    <>
      <TitleBar />
      <section className="flex-container">
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper recommendation">
            <h1 className="title-recommendation">{t('recommendation.title')}</h1>
            <div className="recommendation-container">
              {recommendation.map(({name, messageKey, social}, index) => (
                <div className={`recommendation-card ${index === 1 && 'border'}`} key={name}>
                  <p>{t(messageKey)}</p>
                  <a href={social} target="_blank" rel="noreferrer"><h2>{name}</h2></a>
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

export default Recommendation;