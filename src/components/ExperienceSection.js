import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import experiences from '../data/experiences';
import '../styles/ExperienceSection.css';

const TAG_TYPE = {
  Android:       'tech',
  Flutter:       'tech',
  Kotlin:        'tech',
  SDK:           'tech',
  Web:           'tech',
  Senior:        'context',
  Consultancy:   'context',
  International: 'context',
  Leadership:    'context',
  Mentoring:     'context',
  Fintech:       'domain',
  'E-commerce':  'domain',
  Healthcare:    'domain',
  Education:     'domain',
  Logistics:     'domain',
};


function getYearRange(period) {
  if (!period) return null;
  const start = period.split(' ')[1];
  const endPart = period.split(' – ')[1];
  const end = endPart === 'Present' ? 'now' : endPart?.split(' ')[1];
  return start === end ? start : `${start} → ${end}`;
}

const JobCard = ({ exp, idx, onCardClick }) => {
  const isCurrent = exp.id === experiences[0].id;

  if (exp.sabbatical) {
    return (
      <div className="sm-state-wrap" id={`exp-card-${exp.id}`} style={{ '--idx': idx }}>
        {exp.period && (
          <span className="sm-year-badge">{getYearRange(exp.period)}</span>
        )}
        <button
          className="sm-state sm-state--sabbatical"
          onClick={() => onCardClick(exp)}
          aria-label="View career break details"
        >
          <div className="sm-card-top">
            <div className="sm-logo sm-logo--sabbatical">
              <span className="sm-sabbatical-icon">⏸</span>
            </div>
            <div className="sm-card-title">
              <span className="sm-name">{exp.company}</span>
              {exp.subtitle && <span className="sm-client">{exp.subtitle}</span>}
            </div>
          </div>
          <div className="sm-card-body">
            <span className="sm-role">{exp.role}</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="sm-state-wrap" id={`exp-card-${exp.id}`} style={{ '--idx': idx }}>
      {exp.period && (
        <span className={`sm-year-badge${isCurrent ? ' sm-year-badge--current' : ''}`}>
          {getYearRange(exp.period)}
        </span>
      )}
      <button
        className={`sm-state${isCurrent ? ' sm-state--current' : ''}${exp.parallel ? ' sm-state--parallel' : ''}`}
        onClick={() => onCardClick(exp)}
        aria-label={`View ${exp.company} details`}
      >
        <div className="sm-card-top">
          <div className="sm-logo">
            {exp.logoSrc
              ? <img src={exp.logoSrc} alt={exp.company} className="sm-logo-img" />
              : <span className="sm-logo-initials">{exp.company[0]}</span>
            }
          </div>
          <div className="sm-card-title">
            <span className="sm-name">{exp.company}</span>
            {exp.client && <span className="sm-client">@ {exp.client}</span>}
          </div>
          <div className={`sm-status-icon ${isCurrent ? 'sm-status-icon--running' : 'sm-status-icon--done'}`}>
            {!isCurrent && '✓'}
          </div>
        </div>

        <div className="sm-card-body">
          <span className="sm-role">{exp.role}</span>
        </div>

        {exp.tags && exp.tags.length > 0 && (
          <div className="sm-tags">
            {exp.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`sm-tag sm-tag--${TAG_TYPE[tag] ?? 'context'}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

function ExperienceSection() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const allDisplayed = [...experiences].reverse();
  const mainJobs     = allDisplayed.filter(e => !e.parallel);
  const parallelJobs = allDisplayed.filter(e => e.parallel);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current._dragOrigin = e.pageX;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!scrollRef.current._dragOrigin) return;
    if (Math.abs(e.pageX - scrollRef.current._dragOrigin) > 5) isDragging.current = true;
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const onMouseUp = () => {
    scrollRef.current._dragOrigin = null;
    scrollRef.current.style.cursor = 'grab';
  };

  const handleClick = (exp) => {
    if (!isDragging.current) setSelected(exp);
  };

  return (
    <div className="exp-inner">
      <div className="exp-header">
        <span className="section-tag">{'// career.yml'}</span>
        <h2 className="section-heading">{t('experience.title')}</h2>
      </div>

      <div className="pipeline-window">
        {/* Window chrome */}
        <div className="pipeline-window-header">
          <div className="pipeline-traffic-lights">
            <span className="tl-dot tl-dot--red" />
            <span className="tl-dot tl-dot--yellow" />
            <span className="tl-dot tl-dot--green" />
          </div>
          <span className="pipeline-window-title">career.yml</span>
          <span className="pipeline-status-badge">
            <span className="pipeline-status-dot" />
            passing
          </span>
        </div>
        <div className="pipeline-toolbar">
          <span>branch:<span className="ptb-val"> main</span></span>
          <span className="ptb-sep">·</span>
          <span>triggered by:<span className="ptb-val"> push</span></span>
          <span className="ptb-sep">·</span>
          <span>run<span className="ptb-val"> #7</span></span>
        </div>

        {/* Main career lane */}
        <div
          className="sm-scroll"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div className="sm-track">
            <div className="sm-initial">
              <div className="sm-initial-dot" />
            </div>
            <div className="sm-arrow sm-arrow--flat">
              <div className="sm-arrow-line" />
              <div className="sm-arrowhead" />
            </div>

            {mainJobs.map((exp, index) => {
              const isLast = index === mainJobs.length - 1;
              return (
                <React.Fragment key={exp.id}>
                  <JobCard exp={exp} idx={index} onCardClick={handleClick} />
                  {!isLast && (
                    <div className="sm-arrow">
                      <div className="sm-arrow-line" />
                      <div className="sm-arrowhead" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            <div className="sm-arrow sm-arrow--flat">
              <div className="sm-arrow-line" />
              <div className="sm-arrowhead" />
            </div>
            <div className="sm-final">
              <div className="sm-final-outer">
                <div className="sm-final-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* Parallel jobs lane */}
        <div className="pipeline-lane-header">
          <span className="pipeline-lane-label">contractors:</span>
        </div>

        <div className="sm-scroll sm-scroll--parallel">
          <div className="sm-track">
            {parallelJobs.map((exp, index) => (
              <JobCard key={exp.id} exp={exp} idx={mainJobs.length + index} onCardClick={handleClick} />
            ))}
          </div>
        </div>

      </div>{/* pipeline-window */}

      {selected && (
        <div className="sm-overlay" onClick={() => setSelected(null)}>
          <div className="sm-detail" onClick={(e) => e.stopPropagation()}>
            <button className="sm-detail-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>

            <div className="sm-detail-header">
              <div className={`sm-detail-logo${selected.sabbatical ? ' sm-logo--sabbatical' : ''}`}>
                {selected.sabbatical
                  ? <span className="sm-sabbatical-icon sm-sabbatical-icon--lg">⏸</span>
                  : selected.logoSrc
                    ? <img src={selected.logoSrc} alt={selected.company} />
                    : <span className="sm-logo-initials sm-logo-initials--lg">{selected.company[0]}</span>
                }
              </div>
              <div className="sm-detail-meta">
                <div className="exp-company-block">
                  <span className="exp-company">{selected.company}</span>
                  {selected.subtitle && <span className="exp-client">{selected.subtitle}</span>}
                  {selected.client && <span className="exp-client">@ {selected.client}</span>}
                  {selected.id === experiences[0].id && (
                    <span className="exp-badge current-badge">{t('experience.present')}</span>
                  )}
                </div>
                {selected.periodKey
                  ? <span className="exp-period">{t(selected.periodKey)}</span>
                  : selected.period && <span className="exp-period">{selected.period}</span>
                }
                <p className="exp-role">{selected.role}</p>
              </div>
            </div>

            {selected.tags && selected.tags.length > 0 && (
              <div className="exp-tags">
                {selected.tags.map((tag) => (
                  <span key={tag} className={`exp-tag exp-tag--${TAG_TYPE[tag] ?? 'context'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {selected.highlights.length > 0 && (
              <ul className="exp-highlights">
                {selected.highlights.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperienceSection;
