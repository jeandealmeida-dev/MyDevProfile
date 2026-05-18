import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import recommendation from '../data/recommendation';
import '../styles/TestimonialsSection.css';

const AVATAR_COLORS = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#9c27b0', '#ff6d00'];

function highlightText(text, phrases) {
  if (!phrases || phrases.length === 0) return [text];
  const escaped = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text.split(regex).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function Avatar({ name, colorIndex }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <div className="test-avatar" style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}>
      {initials}
    </div>
  );
}

function TestimonialModal({ item, colorIndex, message, highlights, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="test-modal-overlay" onClick={onClose}>
      <div className="test-modal" onClick={e => e.stopPropagation()}>
        <button className="test-modal-close" onClick={onClose} aria-label="Close">×</button>
        <span className="test-modal-quote">"</span>
        <p className="test-modal-text">{highlightText(message, highlights)}</p>
        <div className="test-modal-footer">
          <Avatar name={item.name} colorIndex={colorIndex} />
          <div className="test-card-author">
            <span className="test-card-name">{item.name}</span>
            <span className="test-card-role">{item.project}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item, colorIndex, accent, onOpen }) {
  const { t } = useTranslation();
  const personKey = item.messageKey.split('.').pop();
  const message = t(item.messageKey).replace(/^"|"$/g, '');
  const highlights = t(`recommendation.highlights.${personKey}`, { returnObjects: true });

  return (
    <div
      className={`test-card${accent ? ' test-card--accent' : ''}`}
      onClick={() => onOpen({ item, colorIndex, message, highlights })}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen({ item, colorIndex, message, highlights })}
    >
      <p className="test-card-text">{highlightText(message, highlights)}</p>
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
  const [modal, setModal] = useState(null);

  const row1 = recommendation.slice(0, 3);
  const row2 = recommendation.slice(3);

  return (
    <div className="test-section">
      <div className="test-header section-header">
        <span className="section-tag">{'// testimonials'}</span>
        <h2 className="section-heading">{t('recommendation.title')}</h2>
      </div>

      <div className="test-marquee-outer">
        <div className="test-marquee-row">
          <div className="test-marquee-track">
            {[...row1, ...row1, ...row1, ...row1].map((item, i) => (
              <TestimonialCard
                key={`r1-${i}`}
                item={item}
                colorIndex={i % row1.length}
                accent={(i % row1.length) % 2 === 1}
                onOpen={setModal}
              />
            ))}
          </div>
        </div>

        <div className="test-marquee-row">
          <div className="test-marquee-track test-marquee-track--reverse">
            {[...row2, ...row2, ...row2, ...row2].map((item, i) => (
              <TestimonialCard
                key={`r2-${i}`}
                item={item}
                colorIndex={(i % row2.length + 2) % AVATAR_COLORS.length}
                accent={(i % row2.length) % 2 === 0}
                onOpen={setModal}
              />
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <TestimonialModal
          item={modal.item}
          colorIndex={modal.colorIndex}
          message={modal.message}
          highlights={modal.highlights}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default TestimonialsSection;
