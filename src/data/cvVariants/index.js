import v1 from './ciandt-senior-android-t0of';

// Registry of job-specific CV variants, served at /cv/for/:slug (noindex).
// One file per job in this folder; copy _template.js to start a new one and
// register it here. Variants only select, reorder and reword content from
// ../cv.js (see ../cvResolve.js).

const variants = [v1];

export default variants;
