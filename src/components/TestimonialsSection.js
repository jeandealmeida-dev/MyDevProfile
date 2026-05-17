import React from 'react';
import { useTranslation } from 'react-i18next';
import recommendation from '../data/recommendation';
import '../styles/TestimonialsSection.css';

const AVATAR_COLORS = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#9c27b0', '#ff6d00'];

function Avatar({ name, colorIndex }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <div className="test-avatar" style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}>
      {initials}
    </div>
  );
}

function TestimonialCard({ item, colorIndex, accent }) {
  const { t } = useTranslation();
  const message = t(item.messageKey).replace(/^"|"$/g, '');
  return (
    <div className={`test-card${accent ? ' test-card--accent' : ''}`}>
      <p className="test-card-text">{message}</p>
      <div className="test-card-footer">
        <Avatar name={item.name} colorIndex={colorIndex} />
        <div className="test-card-author">
          <span className="test-card-name">{item.name}</span>
          <span className="test-card-role">{item.project}</span>
        </div>
        <span className="test-card-quote-mark">"</span>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const { t } = useTranslation();

  const row1 = recommendation;
  const row2 = [...recommendation.slice(3), ...recommendation.slice(0, 3)];

  return (
    <div className="test-section">
      <div className="test-header">
        <span className="section-tag">{'// testimonials'}</span>
        <h2 className="section-heading">{t('recommendation.title')}</h2>
      </div>

      <div className="test-marquee-outer">
        <div className="test-marquee-row">
          <div className="test-marquee-track">
            {[...row1, ...row1].map((item, i) => (
              <TestimonialCard
                key={`r1-${i}`}
                item={item}
                colorIndex={i % row1.length}
                accent={(i % row1.length) % 2 === 1}
              />
            ))}
          </div>
        </div>

        <div className="test-marquee-row">
          <div className="test-marquee-track test-marquee-track--reverse">
            {[...row2, ...row2].map((item, i) => (
              <TestimonialCard
                key={`r2-${i}`}
                item={item}
                colorIndex={(i % row2.length + 2) % AVATAR_COLORS.length}
                accent={(i % row2.length) % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection;
