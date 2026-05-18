import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Hero.css';

const PU = process.env.PUBLIC_URL;

const ROLES = ['Mobile Software Engineer', 'Android Developer', 'Flutter Developer'];
const TYPING_MS   = 75;
const DELETING_MS = 45;
const PAUSE_MS    = 2200;

function useTypewriter(words) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];

    if (!deleting && display.length < word.length) {
      const t = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), TYPING_MS);
      return () => clearTimeout(t);
    }

    if (!deleting && display.length === word.length) {
      const t = setTimeout(() => setDeleting(true), PAUSE_MS);
      return () => clearTimeout(t);
    }

    if (deleting && display.length > 0) {
      const t = setTimeout(() => setDisplay(d => d.slice(0, -1)), DELETING_MS);
      return () => clearTimeout(t);
    }

    if (deleting && display.length === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
  }, [display, deleting, wordIdx, words]);

  return display;
}

function Hero() {
  const { t } = useTranslation();
  const role = useTypewriter(ROLES);

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

              <h2 className="hero-role">{role}</h2>

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
