import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import '../styles/Home.css';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import MenuMobile from "../components/MenuMobile";
import Typical from 'react-typical';
import { useTranslation } from 'react-i18next';

function Home() {
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
    <>
      <TitleBar />
      <section className="flex-container">
        <SideBar />
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper home">
            <div className="home-content">
              <p><span className="span">{'<'}</span>{t('home.greeting')}</p>
              <h1>Jean Paulo de Almeida<span className="span">{'/>'}</span> </h1>
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
            
          </main>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default Home;