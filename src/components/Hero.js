import React from 'react';
import { useTranslation } from 'react-i18next';
import Typical from 'react-typical';
import '../styles/Hero.css';

const PU = process.env.PUBLIC_URL;

function Hero() {
  const { t } = useTranslation();

  return (
    <>
      <section
        id="hero"
        className="landing-section hero-section"
        style={{ backgroundImage: `url(${PU}/background.jpg)` }}
      >
        <div className="hero-inner">

          <div className="hero-top">
            <div className="hero-left">
              <p className="hero-iam">{t('home.iam')}</p>
              <h1 className="hero-name">Jean de Almeida</h1>
              <div className="hero-name-underline" />

              <Typical
                steps={[
                  'Mobile Software Engineer', 2000,
                  'Android Developer',        2000,
                  'Flutter Developer',        2000,
                ]}
                loop={Infinity}
                wrapper="h2"
                className="hero-role"
              />

              <p className="hero-intro">{t('home.intro')}</p>
            </div>

            <div className="hero-right">
              <div className="hero-polaroid">
                <img src={`${PU}/profile-image.png`} alt="Jean Paulo" className="hero-image" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
