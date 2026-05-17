import React from 'react';

const VARIANTS = {
  // About (warm cream) → Experience (dark charcoal)
  // Asymmetric S-curve: dips on the right, swells on the left — fabric draping effect
  aboutExp: {
    h: 72,
    d: 'M0,0 L1440,0 L1440,48 C1200,28 960,68 720,42 C480,16 240,60 0,36 Z',
  },
  // Experience (dark charcoal) → Projects (terminal black)
  // Angular blade cut: sharp left bias, like an IDE panel sliding under
  expProj: {
    h: 60,
    d: 'M0,0 L1440,0 L1440,20 C1100,56 780,6 500,48 C290,78 80,22 0,52 Z',
  },
  // Projects (terminal black) → Testimonials (warm cream)
  // Dramatic multi-peak wave: warm section erupts from below with full contrast
  projTest: {
    h: 96,
    d: 'M0,0 L1440,0 L1440,68 C1300,38 1100,82 880,50 C700,24 500,72 280,44 C140,26 40,58 0,48 Z',
  },
};

export default function WaveDivider({ variant, topColor, bottomColor }) {
  const { h, d } = VARIANTS[variant];
  return (
    <div style={{ lineHeight: 0, background: bottomColor }}>
      <svg
        viewBox={`0 0 1440 ${h}`}
        preserveAspectRatio="none"
        width="100%"
        height={h}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <path fill={topColor} d={d} />
      </svg>
    </div>
  );
}
