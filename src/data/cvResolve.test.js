import cv from './cv';
import variants from './cvVariants';
import { resolveCv } from './cvResolve';

const FORBIDDEN = /NTT|HubXP|BEES|Afya|99717/i;

const sample = {
  slug: 'sample',
  lang: 'en',
  target: { company: 'Sample' },
  summary: { en: ['Custom summary.'], pt: ['Resumo.'] },
  experience: {
    omnichat: false,
    xp: { bullets: ['xp-tests', 'xp-sse'], intro: false },
  },
  rewrite: { 'tw-ai': { en: 'Reworded.', pt: 'Reescrito.' } },
  projects: ['playbook'],
  skills: [{ id: 'android', items: ['Kotlin', 'Jetpack Compose'] }, { id: 'cross' }],
};

describe('resolveCv', () => {
  it('returns the base CV when there is no variant', () => {
    expect(resolveCv(cv)).toBe(cv);
  });

  it('selects, reorders and rewords only existing content', () => {
    const out = resolveCv(cv, sample);
    expect(out.experience.find((e) => e.id === 'omnichat')).toBeUndefined();
    const xp = out.experience.find((e) => e.id === 'xp');
    expect(xp.bullets.map((b) => b.id)).toEqual(['xp-tests', 'xp-sse']);
    expect(xp.intro).toBeUndefined();
    const tw = out.experience.find((e) => e.id === 'thoughtworks');
    expect(tw.bullets.find((b) => b.id === 'tw-ai').text.en).toBe('Reworded.');
    expect(out.summary.en).toEqual(['Custom summary.']);
    expect(out.projects.map((p) => p.id)).toEqual(['playbook']);
    expect(resolveCv(cv, { slug: 'x', projects: [] }).projects).toEqual([]);
    expect(out.skills.map((g) => g.id)).toEqual(['android', 'cross']);
    expect(out.skills[0].items).toEqual(['Kotlin', 'Jetpack Compose']);
  });

  it('rejects ids and skills that are not in the base CV', () => {
    expect(() => resolveCv(cv, { slug: 'x', experience: { nope: false } })).toThrow(/unknown experience/);
    expect(() => resolveCv(cv, { slug: 'x', experience: { xp: { bullets: ['tw-ai'] } } })).toThrow(/not in experience/);
    expect(() => resolveCv(cv, { slug: 'x', rewrite: { nope: { en: '', pt: '' } } })).toThrow(/unknown bullet/);
    expect(() => resolveCv(cv, { slug: 'x', projects: ['nope'] })).toThrow(/unknown project/);
    expect(() => resolveCv(cv, { slug: 'x', skills: [{ id: 'android', items: ['COBOL'] }] })).toThrow(/is not in group/);
  });
});

describe('published CVs', () => {
  const all = [{ slug: 'base', data: cv }, ...variants.map((v) => ({ slug: v.slug, data: resolveCv(cv, v) }))];

  it('has unique variant slugs', () => {
    const slugs = variants.map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  all.forEach(({ slug, data }) => {
    it(`${slug}: no contractor names or phone number`, () => {
      expect(JSON.stringify(data)).not.toMatch(FORBIDDEN);
    });
  });
});
