import React from 'react';

export const PastelCloud: React.FC<{ className?: string; fill?: string }> = ({
  className = 'w-20 h-12',
  fill = '#E0F2FE',
}) => (
  <svg
    viewBox="0 0 120 70"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M25 58H96C106.5 58 115 49.5 115 39C115 29.2 107.6 21.1 98.1 20.1C94.3 9.5 84.1 2 72 2C58.6 2 47.4 11.4 44.6 24C42.1 23 39.4 22.5 36.5 22.5C24.6 22.5 15 32.1 15 44C15 44.7 15 45.4 15.1 46.1C8.8 47.7 4 53.3 4 60C4 60 12 58 25 58Z"
      fill={fill}
    />
  </svg>
);

export const PastelStar: React.FC<{ className?: string; fill?: string }> = ({
  className = 'w-6 h-6',
  fill = '#FDE047',
}) => (
  <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
    <path
      d="M18 2L21.9 12.1L32.5 13L24.3 19.9L27 30.3L18 24.5L9 30.3L11.7 19.9L3.5 13L14.1 12.1L18 2Z"
      fill={fill}
      stroke="#F59E0B"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const CartoonOpenBook: React.FC<{ className?: string }> = ({
  className = 'w-14 h-12',
}) => (
  <svg viewBox="0 0 80 64" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8 14C8 10.7 10.7 8 14 8H36C38.2 8 40 9.8 40 12V54C40 51.8 38.2 50 36 50H12C9.8 50 8 48.2 8 46V14Z"
      fill="#EDE9FE"
      stroke="#7C3AED"
      strokeWidth="2.2"
    />
    <path
      d="M72 14C72 10.7 69.3 8 66 8H44C41.8 8 40 9.8 40 12V54C40 51.8 41.8 50 44 50H68C70.2 50 72 48.2 72 46V14Z"
      fill="#E0F2FE"
      stroke="#0284C7"
      strokeWidth="2.2"
    />
    <path d="M16 19H32M16 27H30M16 35H28" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M48 19H64M50 27H64M52 35H64" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const CartoonPencilEraser: React.FC<{ className?: string }> = ({
  className = 'w-16 h-12',
}) => (
  <svg viewBox="0 0 90 64" fill="none" aria-hidden="true" className={className}>
    <g transform="rotate(-14 32 34)">
      <rect x="14" y="22" width="42" height="14" rx="3" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <rect x="14" y="22" width="9" height="14" rx="2" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
      <path d="M56 22L68 29L56 36V22Z" fill="#FED7AA" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
      <path d="M64 26.7L68 29L64 31.3V26.7Z" fill="#261C42" />
    </g>
    <g transform="translate(56, 36) rotate(8)">
      <rect x="0" y="0" width="24" height="14" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
      <rect x="0" y="0" width="9" height="14" rx="3" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
    </g>
  </svg>
);

export const HappyStarMascot: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
    <path
      d="M32 5L39.5 21.5L57.5 23.6L44 35.8L47.8 53.5L32 44.5L16.2 53.5L20 35.8L6.5 23.6L24.5 21.5L32 5Z"
      fill="#FDE047"
      stroke="#CA8A04"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <circle cx="26.5" cy="30" r="2.2" fill="#261C42" />
    <circle cx="37.5" cy="30" r="2.2" fill="#261C42" />
    <circle cx="23.5" cy="34" r="2.2" fill="#FDA4AF" />
    <circle cx="40.5" cy="34" r="2.2" fill="#FDA4AF" />
    <path d="M27.5 35.5C29 38.2 35 38.2 36.5 35.5" stroke="#261C42" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const EncouragingCloudMascot: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg viewBox="0 0 72 64" fill="none" aria-hidden="true" className={className}>
    <path
      d="M17 48H55C61.6 48 67 42.6 67 36C67 29.8 62.3 24.7 56.3 24.1C53.9 17.4 47.5 12.6 40 12.6C31.6 12.6 24.6 18.5 22.8 26.4C21.2 25.8 19.5 25.5 17.7 25.5C10.1 25.5 4 31.6 4 39.2C4 44.1 9.8 48 17 48Z"
      fill="#FFEDD5"
      stroke="#EA580C"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="34" r="2" fill="#261C42" />
    <circle cx="43" cy="34" r="2" fill="#261C42" />
    <path d="M33 39.5C35 38 38 38 40 39.5" stroke="#261C42" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CornerSkyDecorations: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
    {/* Soft pastel background blobs */}
    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#EDE9FE]/55 blur-3xl" />
    <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#E0F2FE]/55 blur-3xl" />
    <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-[#FFEDD5]/50 blur-3xl" />

    {/* Floating Clouds & Twinkling Stars kept subtly in corners */}
    <div className="hidden sm:block absolute top-24 left-6 opacity-70 animate-drift-cloud">
      <PastelCloud className="w-20 h-12" fill="#E0F2FE" />
    </div>
    <div className="hidden lg:block absolute top-28 right-10 opacity-75 animate-float-slow">
      <PastelStar className="w-6 h-6" />
    </div>
    <div className="hidden lg:block absolute bottom-20 left-10 opacity-65 animate-twinkle-soft">
      <PastelStar className="w-5 h-5" fill="#FDE68A" />
    </div>
    <div className="hidden md:block absolute bottom-12 right-12 opacity-60 animate-drift-cloud">
      <PastelCloud className="w-24 h-14" fill="#EDE9FE" />
    </div>

    {/* Subtle floating Hijaiyah corner ornaments */}
    <span className="hidden xl:block font-arabic text-4xl text-[#C4B5FD]/50 absolute top-44 left-10 animate-float-slow select-none">
      أ
    </span>
    <span className="hidden xl:block font-arabic text-4xl text-[#7DD3FC]/55 absolute bottom-32 right-14 animate-gentle-bounce select-none">
      ق
    </span>
  </div>
);
