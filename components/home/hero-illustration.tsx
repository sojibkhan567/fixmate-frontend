export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 440"
      role="img"
      aria-label="A smartphone with a cracked screen being repaired with a wrench"
      className={className}
    >
      <circle cx="240" cy="220" r="200" fill="#fef3c7" />
      <circle cx="240" cy="220" r="150" fill="#fde68a" opacity=".45" />

      {/* phone */}
      <rect x="160" y="60" width="160" height="320" rx="30" fill="#292524" />
      <rect x="170" y="74" width="140" height="292" rx="22" fill="#fffbeb" />
      <rect x="222" y="82" width="36" height="8" rx="4" fill="#292524" />
      {/* cracks */}
      <g stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M250 74 L236 140 L270 190 L240 250 L262 366" />
        <path d="M236 140 L190 170" />
        <path d="M270 190 L308 176" />
        <path d="M240 250 L186 276" />
      </g>
      {/* ui hints on screen */}
      <rect x="186" y="304" width="108" height="10" rx="5" fill="#fde68a" />
      <rect x="186" y="324" width="70" height="10" rx="5" fill="#fde68a" />

      {/* gear */}
      <g transform="translate(120 130)">
        <circle
          r="32"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="10"
          strokeDasharray="8 8.1"
        />
        <circle r="26" fill="#f59e0b" />
        <circle r="10" fill="#fef3c7" />
      </g>

      {/* wrench */}
      <g transform="rotate(-38 340 300)">
        <rect x="325" y="236" width="30" height="150" rx="15" fill="#f59e0b" />
        <circle cx="340" cy="228" r="36" fill="#f59e0b" />
        <rect x="327" y="186" width="26" height="40" rx="4" fill="#fde68a" />
        <circle cx="340" cy="372" r="6" fill="#fef3c7" />
      </g>

      {/* shield */}
      <g transform="translate(366 70)">
        <path
          d="M40 0 L78 14 V46 C78 70 62 86 40 96 C18 86 2 70 2 46 V14 Z"
          fill="#b45309"
        />
        <path
          d="M24 48 L36 60 L58 36"
          fill="none"
          stroke="#fffbeb"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
