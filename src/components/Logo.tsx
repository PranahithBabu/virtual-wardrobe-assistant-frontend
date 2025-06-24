import React from 'react';

const Logo = () => (
  <div className="flex items-center gap-2 overflow-hidden">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary flex-shrink-0"
    >
      <path
        d="M26 22.0002V24.6668C26 25.0343 25.8595 25.3881 25.6133 25.649C25.3672 25.9098 25.0348 26.0596 24.6842 26.0596H7.31579C6.96522 26.0596 6.63284 25.9098 6.38671 25.649C6.14058 25.3881 6 25.0343 6 24.6668V7.3335C6 6.96595 6.14058 6.61218 6.38671 6.3513C6.63284 6.09042 6.96522 5.94061 7.31579 5.94061H10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.94061L14.6667 11.2739H25.3333L20 5.94061Z"
        fill="currentColor"
      />
    </svg>
    <span className="text-xl font-bold text-sidebar-foreground font-headline group-data-[state=collapsed]:hidden">StyleAI</span>
  </div>
);

export default Logo;
