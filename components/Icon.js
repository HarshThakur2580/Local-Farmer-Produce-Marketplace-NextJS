const paths = {
  leaf: <><path d="M5 19C7 11 12 6 20 4c-1 8-6 13-14 15" /><path d="M7 16c3-1 6-3 9-7" /></>,
  cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c.5-3.5 2.5-5 6-5s5.5 1.5 6 5" /><path d="M16 5.5a3 3 0 0 1 0 5.8M17 15c2.5.4 3.8 2 4 5" /></>,
  farmer: <><circle cx="12" cy="8" r="3" /><path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" /><path d="M6 7h12M8 7l1-3h6l1 3" /></>,
  package: <><path d="m4 7 8-4 8 4v10l-8 4-8-4Z" /><path d="m4 7 8 4 8-4M12 11v10" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 13 4 4L19 7" />,
  warning: <><path d="M12 3 2.7 20h18.6Z" /><path d="M12 9v5M12 17h.01" /></>,
  truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z" /><path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8ZM5 13l.7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7Z" /></>,
  location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 7 5-3 5 3-1-7" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  eyeOff: <><path d="m3 3 18 18M10.5 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a18 18 0 0 1-2.2 3M6.5 6.5C4 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.5-.7" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  money: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h.01M17 12h.01" /><circle cx="12" cy="12" r="2.5" /></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M4 20h16" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 2.6 8 7 10 4.4-2 7-5.5 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
  document: <><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  megaphone: <><path d="m4 13 13-6v10L4 11Z" /><path d="m7 13 1 7h4l-1-8" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.5 1A8 8 0 0 0 14.8 6L14.5 3h-5L9.2 6a8 8 0 0 0-1.6 1.1l-2.5-1-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.5-1A8 8 0 0 0 9.2 18l.3 3h5l.3-3a8 8 0 0 0 1.6-1.1l2.5 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" /></>,
  refund: <><path d="M5 8H2v-3" /><path d="M3 8a9 9 0 1 1 2 9" /><path d="M12 7v10M15 9.5c-.7-1-1.7-1.5-3-1.5-1.7 0-3 1-3 2.3s1.3 2.1 3 2.1 3 .9 3 2.1-1.3 2.3-3 2.3c-1.3 0-2.4-.5-3.1-1.5" /></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9Z" />,
  arrowUpRight: <><path d="M7 17 17 7M8 7h9v9" /></>,
  organic: <><path d="M5 19C7 11 12 6 20 4c-1 8-6 13-14 15" /><path d="M7 16c3-1 6-3 9-7" /></>,
};

export default function Icon({ name = 'leaf', className = 'w-5 h-5', strokeWidth = 1.8, title }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      {paths[name] || paths.leaf}
    </svg>
  );
}
