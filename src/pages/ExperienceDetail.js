import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBar from '../components/TitleBar';
import experiences from '../data/experiences';
import '../styles/LandingPage.css';
import '../styles/ProjectsSection.css';
import '../styles/ExperienceDetail.css';

const PhoneMedia = ({ item, alt }) => (
  <div className="phone-shell exp-phone">
    <div className="phone-btn phone-btn--vol-up" />
    <div className="phone-btn phone-btn--vol-down" />
    <div className="phone-btn phone-btn--power" />
    <div className="phone-screen">
      {item.type === 'video' ? (
        <video
          className="exp-phone-media"
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      ) : (
        <img className="exp-phone-media" src={item.src} alt={alt} loading="lazy" />
      )}
    </div>
  </div>
);

function ExperienceDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const exp = experiences.find((e) => e.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!exp) return <Navigate to="/" replace />;

  const period = exp.periodKey ? t(exp.periodKey) : exp.period;

  return (
    <>
      <TitleBar />
      <main className="landing-main exp-detail">
        <div className="exp-detail-inner">
          <Link to="/#experience" className="exp-detail-back">
            ← {t('experience.detail.back')}
          </Link>

          <header className="exp-detail-header">
            {exp.logoSrc && <img className="exp-detail-logo" src={exp.logoSrc} alt={exp.company} />}
            <div>
              <span className="section-tag">{`// ${exp.company}`}</span>
              <h1 className="section-heading">{t(`experience.detail.${slug}.heading`)}</h1>
              <p className="exp-detail-role">
                {exp.role} · {period}
              </p>
            </div>
          </header>

          <p className="exp-detail-intro">{t(`experience.detail.${slug}.intro`)}</p>

          <ul className="exp-detail-highlights">
            {exp.highlights.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>

          {exp.media?.length > 0 && (
            <>
              <h2 className="exp-detail-subtitle">{t('experience.detail.inAction')}</h2>
              <div className="exp-detail-media">
                {exp.media.map((item) => (
                  <figure key={item.src} className="exp-detail-figure">
                    <PhoneMedia item={item} alt={t(item.titleKey)} />
                    <figcaption>
                      <strong>{t(item.titleKey)}</strong>
                      <span>{t(item.captionKey)}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default ExperienceDetail;
