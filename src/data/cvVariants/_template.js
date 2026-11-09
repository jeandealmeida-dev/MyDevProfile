// Template for a job-specific CV variant. Copy to <company>-<role>.js, edit,
// then add it to ./index.js. Everything except slug, lang and target is optional.
// Only ids that exist in ../cv.js are allowed; the tests fail on anything else.

const variant = {
  slug: 'company-role',
  lang: 'en',
  target: { company: 'Company', role: 'Senior Android Engineer', url: 'https://example.com/job' },

  // headline: { en: '', pt: '' },
  // summary: { en: ['', ''], pt: ['', ''] },

  // experience: {
  //   omnichat: false,                         // hide an experience
  //   xp: { bullets: ['xp-tests', 'xp-sse'] }, // keep these bullets, in this order
  // },

  // rewrite: { 'tw-ai': { en: '', pt: '' } },  // reword an existing bullet

  // skills: [
  //   { id: 'android', items: ['Kotlin', 'Jetpack Compose'] },
  //   { id: 'cross' },
  // ],
};

export default variant;
