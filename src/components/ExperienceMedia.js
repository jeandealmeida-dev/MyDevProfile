import React, { useRef, useState } from 'react';
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
          <img className="exp-phone-media" src={item.src} alt={alt} />
        )}
      </div>
    </div>
  </div>
);

/** One-slide-at-a-time carousel of phone recordings, shown inside the experience dialog. */
function ExperienceMedia({ media, noteKey }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const last = media.length - 1;
  const item = media[index];

  const go = (next) => setIndex(Math.min(last, Math.max(0, next)));

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      className="exp-media"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      <h3 className="exp-media-title">{t('experience.detail.inAction')}</h3>
      {noteKey && <p className="exp-media-note">{t(noteKey)}</p>}

      <div className="exp-carousel">
        <button
          type="button"
          className="exp-carousel-btn"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <figure
          key={item.src}
          className="exp-slide"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <PhoneMedia item={item} alt={t(item.titleKey)} />
          <figcaption>
            <strong>{t(item.titleKey)}</strong>
            <span>{t(item.captionKey)}</span>
          </figcaption>
        </figure>

        <button
          type="button"
          className="exp-carousel-btn"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className="exp-carousel-dots">
        {media.map((m, i) => (
          <button
            key={m.src}
            type="button"
            className={`exp-carousel-dot${i === index ? ' is-active' : ''}`}
            onClick={() => go(i)}
            aria-label={`${i + 1} / ${media.length}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  );
}

export default ExperienceMedia;
