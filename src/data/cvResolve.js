// Builds the CV shown on /cv/for/:slug from the base CV (cv.js) plus a variant.
//
// A variant can only SELECT and REORDER what already exists in cv.js, and
// reword existing bullets. It cannot add experiences, bullets or skills, so a
// tailored CV never claims more than the base CV does. Unknown ids throw, which
// the tests catch before a bad variant reaches production.
//
// Variant shape (all fields optional except slug, lang and target):
// {
//   slug: 'acme-android',
//   lang: 'en',                       // 'en' | 'pt'
//   target: { company: 'Acme', role: 'Senior Android Engineer' }, // for notes and the PDF name
//   headline: { en, pt },             // replaces the headline
//   summary: { en: [..], pt: [..] },  // replaces the summary paragraphs
//   experience: {                     // omitted experiences stay as in the base CV
//     omnichat: false,                // false hides it
//     xp: { bullets: ['xp-tests'], intro: false },  // keep these bullets, in this order
//   },
//   rewrite: { 'tw-ai': { en, pt } }, // reword an existing bullet
//   skills: [{ id: 'android', items: ['Kotlin', 'Jetpack Compose'] }], // groups/items to show, in order
// }

function fail(message) {
  throw new Error(`CV variant: ${message}`);
}

export function resolveCv(base, variant) {
  if (!variant) return base;

  const experienceById = new Map(base.experience.map((e) => [e.id, e]));
  const bulletIds = new Set(base.experience.flatMap((e) => e.bullets.map((b) => b.id)));
  const skillById = new Map(base.skills.map((g) => [g.id, g]));

  const overrides = variant.experience || {};
  Object.keys(overrides).forEach((id) => {
    if (!experienceById.has(id)) fail(`unknown experience "${id}" in ${variant.slug}`);
  });
  const rewrite = variant.rewrite || {};
  Object.keys(rewrite).forEach((id) => {
    if (!bulletIds.has(id)) fail(`unknown bullet "${id}" in rewrite of ${variant.slug}`);
  });

  const experience = base.experience
    .filter((e) => overrides[e.id] !== false)
    .map((e) => {
      const o = overrides[e.id];
      let bullets = e.bullets;
      if (o && o.bullets) {
        const byId = new Map(e.bullets.map((b) => [b.id, b]));
        bullets = o.bullets.map((id) => {
          if (!byId.has(id)) fail(`bullet "${id}" is not in experience "${e.id}" (${variant.slug})`);
          return byId.get(id);
        });
      }
      bullets = bullets.map((b) => (rewrite[b.id] ? { ...b, text: rewrite[b.id] } : b));
      return { ...e, bullets, intro: o && o.intro === false ? undefined : e.intro };
    });

  const skills = variant.skills
    ? variant.skills.map((s) => {
        const group = skillById.get(s.id);
        if (!group) fail(`unknown skill group "${s.id}" in ${variant.slug}`);
        const items = s.items || group.items;
        items.forEach((item) => {
          if (!group.items.includes(item)) fail(`skill "${item}" is not in group "${s.id}" (${variant.slug})`);
        });
        return { ...group, items };
      })
    : base.skills;

  return {
    ...base,
    person: variant.headline ? { ...base.person, headline: variant.headline } : base.person,
    summary: variant.summary || base.summary,
    experience,
    skills,
  };
}
