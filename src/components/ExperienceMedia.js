import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ProjectsSection.css';
import '../styles/ExperienceMedia.css';

const PhoneMedia = ({ item, alt }) => (
  <div className="exp-phone-wrap">
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
  </div>
);

/** Compact row of phone mock-ups with captions, shown inside the experience dialog. */
function ExperienceMedia({ media, noteKey }) {
  const { t } = useTranslation();

  return (
    <section className="exp-media">
      <h3 className="exp-media-title">{t('experience.detail.inAction')}</h3>
      {noteKey && <p className="exp-media-note">{t(noteKey)}</p>}
      <div className="exp-media-row">
        {media.map((item) => (
          <figure key={item.src} className="exp-media-figure">
            <PhoneMedia item={item} alt={t(item.titleKey)} />
            <figcaption>
              <strong>{t(item.titleKey)}</strong>
              <span>{t(item.captionKey)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default ExperienceMedia;
