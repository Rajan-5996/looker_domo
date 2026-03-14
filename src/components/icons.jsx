const LookerIcon = ({ size = 70 }) => (
  <img
    src="/looker-logo.png"
    alt="Looker"
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      borderRadius: 8,
      flexShrink: 0,
    }}
  />
);

const DomoIcon = ({ size = 45 }) => (
  <img
    src="/domo-logo.png"
    alt="Domo"
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      borderRadius: 8,
      flexShrink: 0,
    }}
  />
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect
      x="2"
      y="2"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="2"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="2"
      y="10"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="10"
      width="6"
      height="6"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const IdIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect
      x="1.5"
      y="3"
      width="11"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <circle cx="4.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M7.5 5.5h3M7.5 8.5h2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const TokenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5L7 1.5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M7 4v6M4.5 5.5l5 3M9.5 5.5l-5 3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const CalcIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect
      x="1"
      y="1"
      width="10"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M3.5 4h5M3.5 6h3M3.5 8h2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const FxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 2h5a2 2 0 012 2v1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M2 7h5M5 5v4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M8 9l4 4M12 9l-4 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export {
  DomoIcon,
  LookerIcon,
  DashboardIcon,
  IdIcon,
  TokenIcon,
  CalcIcon,
  FxIcon,
  GridIcon
};
