import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import cv from '../data/cv';
import '../styles/CV.css';

const LANGS = ['en', 'pt'];
const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
};

// Strings are either plain or { en, pt }.
const tr = (value, lang) => (value && typeof value === 'object' ? value[lang] : value);

function formatDate(date, lang) {
  if (!date) return '';
  const [year, month] = date.split('-');
  return month ? `${MONTHS[lang][Number(month) - 1]} ${year}` : year;
}

function formatPeriod({ start, end }, lang) {
  const to = end ? formatDate(end, lang) : cv.ui.present[lang];
  return `${formatDate(start, lang)} – ${to}`;
}

function Entry({ item, lang }) {
  const company = tr(item.company, lang);
  const meta = [tr(item.client, lang), item.location].filter(Boolean).join(' · ');
  return (
    <article className="cv-entry">
      <header className="cv-entry-head">
        <h3 className="cv-entry-title">
          {company}
          <span className="cv-entry-role">{tr(item.role, lang)}</span>
        </h3>
        <span className="cv-entry-dates">{formatPeriod(item, lang)}</span>
      </header>
      {meta && <p className="cv-entry-meta">{meta}</p>}
      {item.intro && <p className="cv-entry-intro">{tr(item.intro, lang)}</p>}
      <ul className="cv-bullets">
        {item.bullets.map((b) => (
          <li key={b.id}>{tr(b.text, lang)}</li>
        ))}
      </ul>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section className="cv-section">
      <h2 className="cv-section-title">{title}</h2>
      {children}
    </section>
  );
}

function CV() {
  const { lang } = useParams();
  const valid = LANGS.includes(lang);

  useEffect(() => {
    if (!valid) return undefined;
    const previous = document.title;
    document.title = cv.ui.docTitle[lang]; // Chrome uses this as the PDF file name
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    return () => {
      document.title = previous;
    };
  }, [lang, valid]);

  if (!valid) return <Navigate to="/cv/en" replace />;

  const other = lang === 'en' ? 'pt' : 'en';
  const { person } = cv;

  return (
    <div className="cv-page">
      <nav className="cv-toolbar" aria-label="CV">
        <Link to="/" className="cv-tool-link">← {cv.ui.back[lang]}</Link>
        <div className="cv-tool-actions">
          <Link to={`/cv/${other}`} className="cv-tool-link">{other.toUpperCase()}</Link>
          <button type="button" className="cv-tool-btn" onClick={() => window.print()}>
            {cv.ui.savePdf[lang]}
          </button>
        </div>
      </nav>

      <main className="cv-sheet">
        <header className="cv-header">
          <h1 className="cv-name">{person.name}</h1>
          <p className="cv-headline">{tr(person.headline, lang)}</p>
          <p className="cv-contacts">
            <span>{person.location}</span>
            {person.contacts.map((c) => (
              <a key={c.href} href={c.href}>{c.label}</a>
            ))}
          </p>
        </header>

        <Section title={cv.ui.summary[lang]}>
          {cv.summary[lang].map((p) => (
            <p key={p} className="cv-summary">{p}</p>
          ))}
        </Section>

        <Section title={cv.ui.experience[lang]}>
          {cv.experience.map((item) => (
            <Entry key={item.id} item={item} lang={lang} />
          ))}
        </Section>

        <Section title={cv.ui.skills[lang]}>
          <dl className="cv-skills">
            {cv.skills.map((group) => (
              <div key={group.id} className="cv-skill-row">
                <dt>{tr(group.label, lang)}</dt>
                <dd>{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <div className="cv-columns">
          <Section title={cv.ui.education[lang]}>
            {cv.education.map((e) => (
              <div key={e.id} className="cv-edu">
                <p className="cv-edu-degree">{tr(e.degree, lang)}</p>
                <p className="cv-edu-school">
                  {e.school}, {e.start === e.end ? e.start : `${e.start} – ${e.end}`}
                </p>
              </div>
            ))}
          </Section>
          <Section title={cv.ui.languages[lang]}>
            <p className="cv-langs">
              {cv.languages.map((l) => `${tr(l.name, lang)} (${tr(l.level, lang)})`).join(' · ')}
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

export default CV;
