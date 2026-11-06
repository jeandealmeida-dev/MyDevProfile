import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

/** Full-screen sheet shown over the landing page for an experience with a `slug`. */
function ExperienceDetail({ exp, onClose }) {
  const { t } = useTranslation();
  const closeRef = useRef(null);
  const slug = exp.slug;
  const period = exp.periodKey ? t(exp.periodKey) : exp.period;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="exp-detail" role="dialog" aria-modal="true" aria-label={exp.company}>
      <div className="exp-detail-bar">
        <button ref={closeRef} type="button" className="exp-detail-back" onClick={onClose}>
          ← {t('experience.detail.back')}
        </button>
        <button type="button" className="exp-detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="exp-detail-inner">
        <header className="exp-detail-header">
          {exp.logoSrc && <img className="exp-detail-logo" src={exp.logoSrc} alt={exp.company} />}
          <div>
            <span className="section-tag">{`// ${exp.company}`}</span>
            <h2 className="section-heading">{t(`experience.detail.${slug}.heading`)}</h2>
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
            <h3 className="exp-detail-subtitle">{t('experience.detail.inAction')}</h3>
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
    </div>
  );
}

export default ExperienceDetail;
