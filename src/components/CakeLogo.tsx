import React from 'react';

export const CakeLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="680" height="680" viewBox="50 156 580 580" role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Breads &amp; Bonds logo</title>
    <desc>Hand-drawn style cake on a stand with Breads and Bonds lettering</desc>
    <style>
      {`.logo-text { font-family: Georgia, 'Times New Roman', serif; fill: #4a2e1a; }`}
    </style>

    <g transform="translate(340, 330)">
      {/* cake stand base */}
      <ellipse cx="0" cy="128" rx="68" ry="10" fill="#e8d5b5" stroke="#7a5230" strokeWidth="2.2" strokeLinecap="round"/>
      {/* stand stem */}
      <path d="M-10,128 Q-7,110 -5,98" fill="none" stroke="#7a5230" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M10,128 Q7,110 5,98" fill="none" stroke="#7a5230" strokeWidth="2.2" strokeLinecap="round"/>

      {/* plate rim */}
      <ellipse cx="0" cy="98" rx="100" ry="13" fill="#f0e4c8" stroke="#7a5230" strokeWidth="2.2"/>

      {/* cake body bottom ellipse sitting ON the plate */}
      <ellipse cx="0" cy="88" rx="82" ry="10" fill="#f5edd8" stroke="#7a5230" strokeWidth="2"/>

      {/* cake sides */}
      <path d="M-82,88 L-80,0" fill="none" stroke="#7a5230" strokeWidth="2" strokeLinecap="round"/>
      <path d="M82,88 L80,0" fill="none" stroke="#7a5230" strokeWidth="2" strokeLinecap="round"/>

      {/* cake body fill */}
      <rect x="-82" y="0" width="164" height="88" fill="#f5edd8"/>

      {/* layer line */}
      <path d="M-82,46 Q0,52 82,46" fill="none" stroke="#c4a882" strokeWidth="1.4" strokeDasharray="4,3"/>

      {/* drizzle/icing on top */}
      <path d="M-80,0 Q-70,-18 -50,-13 Q-30,-8 -10,-16 Q10,-22 30,-14 Q50,-6 70,-12 Q85,-16 80,0 Q60,10 30,5 Q0,0 -30,5 Q-60,10 -80,0 Z"
            fill="#c9a47a" stroke="#7a5230" strokeWidth="2" strokeLinejoin="round"/>

      {/* drizzle drips */}
      <path d="M-55,0 Q-58,14 -53,22" fill="none" stroke="#c9a47a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M-20,1 Q-22,12 -18,18" fill="none" stroke="#c9a47a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M25,2 Q28,14 24,20" fill="none" stroke="#c9a47a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M58,1 Q61,12 57,18" fill="none" stroke="#c9a47a" strokeWidth="2.2" strokeLinecap="round"/>

      {/* bubble details on cake body */}
      <circle cx="-42" cy="62" r="3.5" fill="none" stroke="#c4a882" strokeWidth="1.5"/>
      <circle cx="35" cy="48" r="2.8" fill="none" stroke="#c4a882" strokeWidth="1.4"/>
      <circle cx="-10" cy="74" r="2.2" fill="none" stroke="#c4a882" strokeWidth="1.3"/>

      {/* berries on top */}
      <circle cx="5" cy="-22" r="6.5" fill="#c9a47a" stroke="#7a5230" strokeWidth="1.8"/>
      <circle cx="-8" cy="-25" r="5" fill="#c9a47a" stroke="#7a5230" strokeWidth="1.6"/>
      <circle cx="18" cy="-24" r="4.5" fill="#c9a47a" stroke="#7a5230" strokeWidth="1.5"/>

      {/* stem / twig */}
      <path d="M5,-28 Q3,-43 -2,-57" fill="none" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
      {/* leaves */}
      <path d="M-2,-57 Q-14,-69 -8,-77 Q0,-67 -2,-57" fill="#a8845a" stroke="#7a5230" strokeWidth="1.4"/>
      <path d="M-2,-57 Q10,-65 16,-73 Q5,-65 -2,-57" fill="#a8845a" stroke="#7a5230" strokeWidth="1.4"/>
      <path d="M-1,-47 Q-11,-54 -7,-61 Q-1,-51 -1,-47" fill="#a8845a" stroke="#7a5230" strokeWidth="1.2"/>
    </g>

    {/* BREADS */}
    <text x="195" y="555" className="logo-text" fontSize="42" fontWeight="700" letterSpacing="4" textAnchor="start" transform="rotate(-2, 195, 555)">BREADS</text>

    {/* ampersand */}
    <text x="336" y="586" className="logo-text" fontSize="34" fontWeight="400" textAnchor="middle" fontStyle="italic">＆</text>

    {/* BONDS */}
    <text x="362" y="612" className="logo-text" fontSize="42" fontWeight="700" letterSpacing="4" textAnchor="start" transform="rotate(1.5, 362, 612)">BONDS</text>

    {/* underline arc */}
    <path d="M185,625 Q340,640 500,625" fill="none" stroke="#c9a47a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

  </svg>
);
