console.log('App.jsx loaded');
const { useState, useMemo, useEffect } = React;

// Minimal local UI primitives (same as cleaned page.jsx)
const Button = ({ children, className = "", ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>{children}</button>
);
const Card = ({ children, className = "" }) => (
  <div className={`p-5 bg-white/95 rounded-3xl lift-card ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="mb-2">{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={className}>{children}</h3>;
const Input = ({ className = "", ...props }) => <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
const Label = ({ children, ...props }) => <label {...props} className="block text-sm font-medium">{children}</label>;
const Textarea = ({ className = "", ...props }) => <textarea className={`border rounded px-3 py-2 ${className}`} {...props} />;
const Badge = ({ children, className = "" }) => <span className={`inline-block px-2 py-1 text-xs rounded ${className}`}>{children}</span>;
const Icon = ({ label, children, className = "w-5 h-5 inline-block" }) => (
  <span className={className} aria-hidden title={label}>{children}</span>
);
const Calendar = (p) => <Icon label="Calendar">📅</Icon>;
const MapPin = (p) => <Icon label="Map">📍</Icon>;
const Clock = (p) => <Icon label="Clock">⏰</Icon>;
const Mail = (p) => <Icon label="Mail">✉️</Icon>;
const Car = (p) => <Icon label="Car">🚗</Icon>;
const Plane = (p) => <Icon label="Plane">✈️</Icon>;
const Hotel = (p) => <Icon label="Hotel">🏨</Icon>;
const Gift = (p) => <Icon label="Gift">🎁</Icon>;
const HelpCircle = (p) => <Icon label="Help">❓</Icon>;
const ChevronRight = (p) => <Icon label="Chevron">›</Icon>;
const Camera = (p) => <Icon label="Camera">📷</Icon>;

const CONFIG = {
  couple: { primaryNames: "Elena & Dennie", fullNames: "Elena Fulton & Dennie" },
  date: { iso: "2026-10-16", pretty: "October 16, 2026", dayTime: "Friday 5:30 PM, PST" },
  venue: { name: "Lionsgate Event Center – The Gatehouse", address: "1055 US-287, Lafayette, CO 80026", cityState: "Lafayette, Colorado", mapsUrl: "https://maps.google.com/?q=Lionsgate+Event+Center+Gatehouse" },
  accommodations: { note: "We reserved a block at the Residence Inn Boulder Broomfield/Interlocken.", hotel: { name: "Residence Inn Boulder Broomfield/Interlocken", address: "455 Zang St, Broomfield, CO 80021", mapsUrl: "https://maps.google.com/?q=Residence+Inn+Boulder+Broomfield/Interlocken", shuttleNote: "Complimentary shuttle will run at set intervals between the hotel and venue on the wedding day." } },
  travel: { airport: { name: "Denver International Airport (DEN)", blurb: "From DEN, take I‑70 W → I‑270 W → US‑36 W toward Boulder, then exit to US‑287 S toward Lafayette. Typical drive ~40–55 min depending on traffic.", toHotel: "From DEN to the Residence Inn: I‑70 W → I‑270 W → US‑36 W to Interlocken Loop. Follow signs to Zang St.", toVenue: "From DEN to Lionsgate: I‑70 W → I‑270 W → US‑36 W → exit for US‑287 S toward Lafayette. Venue entrance is on US‑287.", parkingNote: "Venue has on‑site parking. Rideshare pickup is straightforward at the Gatehouse entrance." } },
  registry: [ { label: "Zola", url: "https://www.zola.com/registry/your-registry" }, { label: "Target", url: "https://www.target.com/gift-registry/" } ],
  colors: { bg: "#F8F5EF", accent: "#F3EEE6", primary: "#1F4C49", secondary: "#123417", highlight: "#7E3A22", text: "#1A1E23", wine: "#461326", plum: "#3E0B4D" },
  hero: {
    tagline: "Friday, October 16th 2026",
    backgroundUrl: "img/steph_1.jpg",
    height: { mobile: "95vh", desktop: "110vh" },
    focus: "left center",
    scale: 1,
    content: {
      align: "center",
      justify: "center",
      paddingTop: "var(--sticky-h, 20px)",
      paddingBottom: "3rem",
      paddingLeft: "0",
      paddingRight: "0",
      textAlign: "right",
      gap: "0rem"
    }
  },
  gallery: { images: [] },
  faq: [ { q: "Is there a dress code?", a: "Dressy cocktail with jewel tone accents encouraged!" }, { q: "Are kids welcome?", a: "We love your little ones, but this will be an adults‑only celebration." }, { q: "Is the venue accessible?", a: "Yes. The Gatehouse has accessible parking and entry." } ],
  schedule: [
    { t: "5:30 PM", label: "Guest Arrival & Seating", description: "Please arrive at Lionsgate by 5:30 so you have plenty of time to grab a blanket if you're chilly and find a seat." },
    { t: "6:00 PM", label: "Ceremony", description: "The ceremony will begin promptly at 6:00 pm. Please NO phones, photos, or videos during the ceremony. We will have professional videographers and photographers who have everything taken care of." },
    { t: "6:30 PM", label: "Cocktail Hour", description: "Enjoy some passed and stationed appetizers while the bridal party finishes taking photos. Don't forget to sign the guest book!" },
    { t: "7:15 PM", label: "Dinner & Toasts", description: "Dinner will be a full plated meal so grab a signature cocktail, find your assigned seat, and relax. Toasts will be given throughout dinner." },
    { t: "8:00 PM", label: "Formal Dances", description: "The bride and groom will share their first dance which will be followed by family dances with parents." },
    { t: "8:30 PM", label: "Cake Cutting", description: "Hopefully you left room for delicious wedding cake which will be paired with seasonal berries and cream!" },
    { t: "8:45 PM", label: "Dancing!", description: "Join the bride and groom on the dance floor!" },
    { t: "12:00 AM", label: "Last Shuttle to Hotel", description: "The shuttle service will run from 8:00 pm until 12:00 am every 30 minutes." }
  ],
  rsvp: { mode: "internal", externalUrl: "", embed: { src: "", height: 900 } },
  updates: { mode: "netlify", mailchimp: { actionUrl: "", fieldEmail: "EMAIL", fieldName: "FNAME" }, sheet: { endpoint: "/api/updates" } },
  sections: { schedule: true, updates: true, travel: true, accommodations: true, registry: true, gallery: true, faq: true, rsvp: true }
};

const FALLBACKS = { hero: "img/hero-fallback.jpg", gallery: "img/gallery-fallback.jpg" };

const ENGAGEMENT_IMAGES = [
  "img/engagement/IMG_3676.jpg",
  "img/engagement/IP_IMG_20250708_08411911.jpg",
  "img/engagement/IP_IMG_20250708_10532215.jpg",
  "img/engagement/IP_IMG_20250708_10532216.jpg",
  "img/engagement/IP_IMG_20250708_1357270.jpg",
  "img/engagement/PXL_20250708_134443758.jpg",
  "img/engagement/image2.jpeg"
];

const FUN_IMAGES = [
  "img/fun/DSCF8151.jpg",
  "img/fun/PXL_20221030_051451001.jpg",
  "img/fun/hero.jpg",
  "img/fun/img_1.jpg",
  "img/fun/img_2.jpg",
  "img/fun/original_ed5b7637-12cf-49ae-9b6b-f382c7b355d9_PXL_20230730_161651005.jpg",
  "img/fun/signal-2023-12-03-13-52-51-046-2.jpg"
];

const keywordToFraction = (token, axis) => {
  if (typeof token !== 'string') return null;
  const t = token.toLowerCase();
  const mapX = { left: 0, center: 0.5, right: 1 };
  const mapY = { top: 0, center: 0.5, bottom: 1 };
  if (axis === 'x' && t in mapX) return mapX[t];
  if (axis === 'y' && t in mapY) return mapY[t];
  return null;
};

const parseFocusComponent = (token, axis) => {
  if (token == null) return 0.5;
  if (typeof token === 'number' && isFinite(token)) {
    return Math.min(Math.max(token, 0), 1);
  }
  if (typeof token === 'string') {
    const trimmed = token.trim();
    if (trimmed.endsWith('%')) {
      const num = parseFloat(trimmed.slice(0, -1));
      if (isFinite(num)) return Math.min(Math.max(num / 100, 0), 1);
    }
    const keyword = keywordToFraction(trimmed, axis);
    if (keyword != null) return keyword;
  }
  return 0.5;
};

const parseFocus = (value) => {
  if (!value) return { x: 0.5, y: 0.5 };
  if (Array.isArray(value)) {
    return { x: parseFocusComponent(value[0], 'x'), y: parseFocusComponent(value[1], 'y') };
  }
  if (typeof value === 'string') {
    const tokens = value.trim().split(/\s+/);
    if (tokens.length === 1) {
      const token = tokens[0];
      const isVerticalKeyword = ['top', 'bottom'].includes(token.toLowerCase());
      if (isVerticalKeyword) {
        return { x: 0.5, y: parseFocusComponent(token, 'y') };
      }
      return { x: parseFocusComponent(token, 'x'), y: 0.5 };
    }
    return {
      x: parseFocusComponent(tokens[0], 'x'),
      y: parseFocusComponent(tokens[1], 'y')
    };
  }
  return { x: 0.5, y: 0.5 };
};

const NOUVEAU_BG = (color) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='none' stroke='${color}' stroke-width='0.8' stroke-linecap='round' stroke-linejoin='round' opacity='0.7'><path d='M10 100c40-60 140-60 180 0M10 120c40 60 140 60 180 0'/><path d='M40 20c12 8 18 20 18 30s-6 22-18 30c-12-8-18-20-18-30s6-22 18-30z'/><path d='M160 120c12 8 18 20 18 30s-6 22-18 30c-12-8-18-20-18-30s6-22 18-30z'/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const Ornament = ({ className = "", color = CONFIG.colors.wine }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1">
    <path d="M5 95 C30 70, 70 30, 95 5" />
    <circle cx="20" cy="80" r="2" />
    <circle cx="80" cy="20" r="2" />
  </svg>
);
const SideVines = ({ className = "", color = CONFIG.colors.wine }) => (
  <svg className={className} viewBox="0 0 24 400" preserveAspectRatio="none" fill="none">
    <path d="M12 0 C 8 50, 16 100, 12 150 C 8 200, 16 250, 12 300 C 8 340, 14 370, 12 400" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
    <g fill="none" stroke={color} strokeWidth="0.6">
      <path d="M12 60 c6 -6 8 -10 10 -18" />
      <path d="M12 120 c-6 -6 -8 -10 -10 -18" />
      <path d="M12 180 c6 -6 8 -10 10 -18" />
      <path d="M12 240 c-6 -6 -8 -10 -10 -18" />
      <path d="M12 300 c6 -6 8 -10 10 -18" />
    </g>
  </svg>
);
const HeroFlourish = ({ color = '#ffffff' }) => (
  <svg width="180" height="22" viewBox="0 0 180 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 11 C 30 2, 60 2, 90 11 C 120 20, 150 20, 178 11" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <circle cx="90" cy="11" r="2" fill={color} />
  </svg>
);

const Section = ({ id, title, children, show = true }) => (
  show ? (
    <section
      id={id}
      className="section-shell py-20 scroll-mt-24 relative overflow-hidden"
      style={{ minHeight: 'calc(100vh - var(--sticky-h, 72px) - 40px)' }}
    >
      <SideVines className="absolute inset-y-0 left-1 w-6 opacity-[.08] hidden lg:block" />
      <SideVines className="absolute inset-y-0 right-1 w-6 opacity-[.08] hidden lg:block rotate-180" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url(${NOUVEAU_BG(CONFIG.colors.accent)})`, backgroundSize: '260px 260px', opacity: 0.05 }} />
      <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center section-inner">
        <div className="flex justify-center mb-6">
          <div className="section-heading nouveau-script text-lg md:text-xl text-[var(--nouveau-deep)]">
            {title}
          </div>
        </div>
        <div className="section-divider" />
        <div className="flex-1 flex flex-col justify-start gap-8">
          {children}
        </div>
      </div>
    </section>
  ) : null
);

const Anchor = ({ href, children }) => (
  <a className="underline underline-offset-2 hover:no-underline" href={href} target="_blank" rel="noreferrer">{children}</a>
);

const prettyDate = (iso) => {
  const d = new Date(iso);
  const day = d.getDate();
  const sfx = (n) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };
  const weekday = d.toLocaleDateString(undefined, { weekday: 'long' });
  const month = d.toLocaleDateString(undefined, { month: 'long' });
  const year = d.getFullYear();
  return `${weekday}, ${month} ${day}${sfx(day)} ${year}`;
};

function App(){
  const [rsvp, setRsvp] = useState({ name: "", email: "", attending: "yes", guests: 1, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [updatesForm, setUpdatesForm] = useState({ name: "", email: "" });
  const [updatesSubmitted, setUpdatesSubmitted] = useState(false);
  const [updatesErrors, setUpdatesErrors] = useState({});

  const palette = useMemo(() => CONFIG.colors, []);
  const heroHeights = CONFIG.hero.height || {};
  const heroHeightMobile = heroHeights.mobile || '90vh';
  const heroHeightDesktop = heroHeights.desktop || '110vh';
  const heroFocusValue = CONFIG.hero.focus ?? 'center bottom';
  const heroFocusParts = parseFocus(heroFocusValue);
  const heroObjectPosition = typeof heroFocusValue === 'string'
    ? heroFocusValue
    : `${(heroFocusParts.x * 100).toFixed(2)}% ${(heroFocusParts.y * 100).toFixed(2)}%`;
  const rawScale = CONFIG.hero.scale;
  const heroScale = (typeof rawScale === 'number' && isFinite(rawScale) && rawScale > 0) ? rawScale : 1;
  const heroTransformOrigin = CONFIG.hero.transformOrigin || `${(heroFocusParts.x * 100).toFixed(2)}% ${(heroFocusParts.y * 100).toFixed(2)}%`;
  const heroTranslateX = CONFIG.hero.translateX ?? '0%';
  const heroTranslateY = CONFIG.hero.translateY ?? `${((heroScale - 1) * heroFocusParts.y * 100).toFixed(4)}%`;
  const heroContentConfig = CONFIG.hero.content || {};
  const heroContentStyle = {
    alignItems: heroContentConfig.align ?? 'flex-start',
    justifyContent: heroContentConfig.justify ?? 'flex-end',
    paddingTop: heroContentConfig.paddingTop ?? 'var(--sticky-h, 72px)',
    paddingBottom: heroContentConfig.paddingBottom ?? '3rem',
    paddingLeft: heroContentConfig.paddingLeft ?? '0',
    paddingRight: heroContentConfig.paddingRight ?? '0',
    textAlign: heroContentConfig.textAlign ?? 'left',
    gap: heroContentConfig.gap
  };
  const heroStyleVars = {
    '--hero-height-mobile': heroHeightMobile,
    '--hero-height-desktop': heroHeightDesktop,
    '--hero-object-position': heroObjectPosition,
    '--hero-focus-x': `${heroFocusParts.x}`,
    '--hero-focus-y': `${heroFocusParts.y}`,
    '--hero-transform-origin': heroTransformOrigin,
    '--hero-scale': `${heroScale}`,
    '--hero-translate-x': heroTranslateX,
    '--hero-translate-y': heroTranslateY
  };
  const [page, setPage] = useState('home');
  useEffect(()=>{
    const h = window.location.hash.replace('#','');
    if (h) setPage(h);
  },[]);
  const go = (p) => { setPage(p); window.location.hash = p; window.scrollTo(0,0); };

  const validate = () => {
    const e = {};
    if (!rsvp.name.trim()) e.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvp.email)) e.email = "Enter a valid email.";
    if (rsvp.guests < 1) e.guests = "At least 1 guest (you).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitForm = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const encode = (data) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

  const submitUpdatesNetlify = async (ev) => {
    ev.preventDefault();
    const emailOk = updatesForm.email.includes("@") && updatesForm.email.includes(".");
    if (!emailOk) { setUpdatesErrors({ email: "Enter a valid email." }); return; }
    try {
      await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encode({ "form-name": "Updates", name: updatesForm.name, email: updatesForm.email }), });
      setUpdatesSubmitted(true);
      setUpdatesErrors({});
    } catch (err) {
      setUpdatesErrors({ email: "Could not subscribe. Please try again." });
    }
  };

  // Render the updates section (extracted to avoid nested ternary JSX)
  const renderUpdatesContent = () => {
    if (!CONFIG.sections.updates) return null;
    const updatesInner = () => {
      if (CONFIG.updates.mode === "mailchimp") {
        return (
          <form action={CONFIG.updates.mailchimp.actionUrl} method="post" target="_blank" noValidate className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mc-email">Email</Label>
              <Input id="mc-email" name={CONFIG.updates.mailchimp.fieldEmail || "EMAIL"} type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mc-name">First name</Label>
              <Input id="mc-name" name={CONFIG.updates.mailchimp.fieldName || "FNAME"} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="lg" style={{ backgroundColor: palette.primary }}>Subscribe</Button>
            </div>
          </form>
        );
      }

      if (CONFIG.updates.mode === "netlify") {
        if (updatesSubmitted) {
          return (
            <div className="text-center space-y-3 py-10"><h3 className="text-xl font-semibold">You're on the list!</h3><p className="opacity-80">We’ll email flight/hotel reminders and planning updates.</p></div>
          );
        }
        return (
          <form name="Updates" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid md:grid-cols-2 gap-4" onSubmit={submitUpdatesNetlify}>
            <input type="hidden" name="form-name" value="Updates" />
            <p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
            <div className="space-y-2">
              <Label htmlFor="updates-name">First name</Label>
              <Input id="updates-name" name="name" value={updatesForm.name} onChange={(e) => setUpdatesForm({ ...updatesForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updates-email">Email</Label>
              <Input id="updates-email" name="email" type="email" required value={updatesForm.email} onChange={(e) => setUpdatesForm({ ...updatesForm, email: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end"><Button type="submit" size="lg" style={{ backgroundColor: palette.primary }}>Subscribe</Button></div>
          </form>
        );
      }

      // default (sheet endpoint)
      if (updatesSubmitted) {
        return (
          <div className="text-center space-y-3 py-10"><h3 className="text-xl font-semibold">You're on the list!</h3><p className="opacity-80">We’ll email flight/hotel reminders and planning updates.</p></div>
        );
      }
      return (
        <form onSubmit={async (e) => { e.preventDefault(); try { await fetch(CONFIG.updates.sheet.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatesForm) }); setUpdatesSubmitted(true); } catch (err) { setUpdatesErrors({ email: "Could not subscribe. Try again." }); } }} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="updates-name2">First name</Label><Input id="updates-name2" value={updatesForm.name} onChange={(e) => setUpdatesForm({ ...updatesForm, name: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="updates-email2">Email</Label><Input id="updates-email2" type="email" value={updatesForm.email} onChange={(e) => setUpdatesForm({ ...updatesForm, email: e.target.value })} /></div>
          <div className="md:col-span-2 flex justify-end"><Button type="submit" size="lg" style={{ backgroundColor: palette.primary }}>Subscribe</Button></div>
        </form>
      );
    };

    return (
        <Section show={page==='updates'} id="updates" title="Get Wedding Updates">
            <div className="detail-card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'left', background: 'rgba(31,76,73,0.9)', color: '#fff8f0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.55' }}>Join our list for travel reminders, hotel updates, and wedding weekend tips.</p>
              </div>
              {updatesInner()}
              <p className="text-xs opacity-70 mt-4">We only send occasional travel, hotel, and event reminders. Unsubscribe anytime.</p>
            </div>
          </Section>
    );
  };

  return (
    <div>
      <div className="page-ornament left" />
      <div className="page-ornament right" />
      <div style={{height: '100%', background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.accent} 100%)`, color: palette.text}}>
        <div className="sticky top-0 z-40 border-b border-black/10" style={{ background: 'linear-gradient(90deg, #fff8f0 0%, #f3eee6 100%)', boxShadow: '0 10px 25px rgba(70,19,38,0.10)', backdropFilter: 'blur(14px)', borderBottom: '2px solid #caa45a' }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" style={{ fontFamily: "'Italiana','Lora',serif", fontSize: '1.35rem', fontWeight: 700, letterSpacing: '.04em' }}>
            <a href="#" onClick={(e)=>{e.preventDefault(); go('home');}} className="tracking-wide nouveau-script" style={{ color: '#4b2e83', fontSize: 'inherit', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(202,164,90,0.08)' }}>Home</a>
            <nav className="hidden md:flex items-center gap-6 nav-links" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
              <a href="#" onClick={(e)=>{e.preventDefault(); go('details');}} className="nouveau-script" style={{ color: '#1F4C49', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(31,76,73,0.06)' }}>Details</a>
              {CONFIG.sections.schedule && <a href="#" onClick={(e)=>{e.preventDefault(); go('schedule');}} className="nouveau-script" style={{ color: '#4b2e83', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(75,46,131,0.06)' }}>Schedule</a>}
              {CONFIG.sections.travel && <a href="#" onClick={(e)=>{e.preventDefault(); go('travel');}} className="nouveau-script" style={{ color: '#caa45a', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(202,164,90,0.08)' }}>Travel</a>}
              {CONFIG.sections.accommodations && <a href="#" onClick={(e)=>{e.preventDefault(); go('accommodations');}} className="nouveau-script" style={{ color: '#461326', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(70,19,38,0.08)' }}>Stay</a>}
              {CONFIG.sections.registry && <a href="#" onClick={(e)=>{e.preventDefault(); go('registry');}} className="nouveau-script" style={{ color: '#7E3A22', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(126,58,34,0.08)' }}>Registry</a>}
              {CONFIG.sections.gallery && <a href="#" onClick={(e)=>{e.preventDefault(); go('gallery');}} className="nouveau-script" style={{ color: '#0c3c78', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(12,60,120,0.08)' }}>Gallery</a>}
              {CONFIG.sections.faq && <a href="#" onClick={(e)=>{e.preventDefault(); go('faq');}} className="nouveau-script" style={{ color: '#5a0e2e', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(90,14,46,0.08)' }}>FAQ</a>}
              {CONFIG.sections.updates && <a href="#" onClick={(e)=>{e.preventDefault(); go('updates');}} className="nouveau-script" style={{ color: '#0f6a5b', fontWeight: 'inherit', padding: '0.5rem 1.2rem', borderRadius: '999px', transition: 'background 180ms', background: 'rgba(15,106,91,0.08)' }}>Updates</a>}
            </nav>
            <Button className="hidden md:inline-flex btn-primary rsvp-btn nouveau-script" style={{ backgroundColor: palette.primary, fontFamily: "'Italiana','Lora',serif", fontSize: '1.35rem', fontWeight: 700, letterSpacing: '.04em', borderRadius: '999px', boxShadow: '0 8px 18px rgba(31,76,73,0.18)' }} onClick={()=>go('rsvp')}>RSVP</Button>
          </div>
        </div>

        {page==='home' && (
          <header id="top" className="relative" style={heroStyleVars}>
            <div 
              className="hero-inner flex flex-col md:flex-row h-[80vh] md:h-[90vh] w-screen"
              style={{ minHeight: '400px', height: 'clamp(400px,80vh,900px)', maxWidth: '100vw', margin: 0 }}
            >
              {/* Left: Image fills left half, always covers */}
              <div 
                className="hero-media relative w-full md:w-1/2 h-64 md:h-full overflow-hidden"
                style={{ minHeight: '300px', height: '100%' }}
              >
                <img
                  src={CONFIG.hero.backgroundUrl}
                  alt="Hero"
                  onError={(e) => (e.currentTarget.src = FALLBACKS.hero)}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: heroObjectPosition, minHeight: '300px' }}
                />
                <Ornament className="absolute top-4 left-4 w-24 h-24 opacity-20" color="#caa45a" />
                <Ornament className="absolute bottom-4 right-4 w-24 h-24 opacity-[.15] rotate-180" color="#4b2e83" />
              </div>
              {/* Right: Text on clean background, vertically centered */}
              <div
                className="flex flex-col justify-center items-end w-full md:w-1/2 py-8 md:py-0"
                style={{
                  background: 'rgba(255,255,255,0.98)',
                  borderTopRightRadius: '2rem',
                  borderBottomRightRadius: '2rem',
                  boxShadow: '0 8px 32px rgba(31,76,73,0.10)',
                  minHeight: '300px',
                  height: '100%',
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                }}
              >
                <h1 className="text-4xl md:text-6xl font-normal tracking-tight drop-shadow-md nouveau-script" style={{ color: '#4b2e83', fontFamily: "'Italiana','Lora',serif", animation: 'fadeIn 600ms ease both', margin: '0', marginBottom: '0.5rem', lineHeight: '1.08' }}>{CONFIG.couple.primaryNames}</h1>
                <p className="text-xl md:text-3xl font-normal nouveau-script" style={{ color: '#1F4C49', animation: 'fadeIn 700ms ease both', marginTop: '0', marginBottom: '1.5rem', lineHeight: '1.18' }}>{CONFIG.hero.tagline}</p>
                <div className="mt-4 opacity-90 flex justify-end"><HeroFlourish color="#caa45a" /></div>
              </div>
            </div>
          </header>
        )}

        {/* DETAILS */}
        <Section show={page==='details'} id="details" title="The Details">
          <div className="venue-feature">
            <header>The Venue</header>
            <p><a href={CONFIG.venue.mapsUrl} target="_blank" rel="noreferrer" className="underline hover:no-underline" style={{ fontWeight: 700, color: '#fff8f0' }}>Lionsgate Event Center</a></p>
            <p><a href={CONFIG.venue.mapsUrl} target="_blank" rel="noreferrer" className="underline hover:no-underline" style={{ color: '#fff8f0' }}>1055 US-287, Lafayette, CO 80026</a></p>
            <p>Both the ceremony and the reception will take place at Lionsgate. There is plenty of parking on the property!</p>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <header>Ceremony</header>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>Ceremony will be held on the lawn of the Gatehouse at sunset. Light blankets will be provided!</p>
              <div className="photo-frame mt-2" style={{ height: '18rem' }}>
                <img src="img/ceremony.jpg" alt="Ceremony location" />
              </div>
            </div>
            <div className="detail-card">
              <header>Reception</header>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>Reception will take place inside the Gatehouse following cocktail hour.</p>
              <div className="photo-frame mt-2" style={{ height: '18rem' }}>
                <img src="img/gatehouse.jpg" alt="Gatehouse reception" />
              </div>
            </div>
          </div>
        </Section>

        {/* SCHEDULE */}
        {CONFIG.sections.schedule && (
        <Section show={page==='schedule'} id="schedule" title="Schedule">
            <div className="space-y-6">
              <h3 className="nouveau-script text-center" style={{ color: CONFIG.colors.wine, fontSize: '2.2rem' }}>Wedding Day Events</h3>
              <div className="timeline">
                <div className="timeline-track"></div>
                {CONFIG.schedule.map((row, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-time">{row.t}</div>
                    <div className="timeline-node"></div>
                    <div className="timeline-detail">
                      <h4>{row.label}</h4>
                      <p>{row.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* TRAVEL */}
        {CONFIG.sections.travel && (
        <Section show={page==='travel'} id="travel" title="Travel & Getting Around">
            <div className="travel-grid">
              <div className="travel-info">
                <div className="travel-card" style={{ marginBottom: '1rem' }}>
                  <header>Arriving via {CONFIG.travel.airport.name}</header>
                  <p className="text-sm opacity-90" style={{ lineHeight: 1.55 }}>{CONFIG.travel.airport.blurb}</p>
                </div>
                <div className="travel-card">
                  <header>Routes We Recommend</header>
                  <ul className="travel-steps">
                    <li className="travel-step">
                      <span className="travel-step-title">To the Hotel Block</span>
                      <span>{CONFIG.travel.airport.toHotel}</span>
                    </li>
                    <li className="travel-step">
                      <span className="travel-step-title">To the Gatehouse</span>
                      <span>{CONFIG.travel.airport.toVenue}</span>
                    </li>
                  </ul>
                  <div className="travel-icons">
                    <span className="travel-tag">40–55 mins</span>
                    <span className="travel-tag">Rideshare friendly</span>
                    <span className="travel-tag">Easy parking</span>
                  </div>
                </div>
                <div className="travel-card">
                  <header>Local Tips</header>
                  <div className="travel-steps">
                    <div className="travel-step">
                      <span className="travel-step-title">Timing</span>
                      <span>Plan for afternoon traffic on US‑36 &amp; US‑287. Sunset shuttles depart from the hotel lobby every 30 minutes.</span>
                    </div>
                    <div className="travel-step">
                      <span className="travel-step-title">Venue Address</span>
                      <span><Anchor href={CONFIG.venue.mapsUrl}>{CONFIG.venue.address}</Anchor></span>
                    </div>
                    <div className="travel-step">
                      <span className="travel-step-title">Parking</span>
                      <span>{CONFIG.travel.airport.parkingNote}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="photo-frame travel-hero">
                <img src="img/balloon_1.jpg" alt="Hot air balloon view of Colorado" onError={(e) => (e.currentTarget.src = FALLBACKS.hero)} />
              </div>
            </div>
          </Section>
        )}

        {/* ACCOMMODATIONS */}
        {CONFIG.sections.accommodations && (
        <Section show={page==='accommodations'} id="accommodations" title="Where to Stay">
            <div className="accommodations-grid">
              <div className="stay-card" style={{ background: 'rgba(255,248,240,0.9)', color: '#2c150f', border: '2px solid rgba(217, 167, 60, 0.65)' }}>
                <header>{CONFIG.accommodations.hotel.name}</header>
                <div className="stay-features" style={{ fontSize: '0.95rem', lineHeight: 1.55 }}>
                  <div>{CONFIG.accommodations.note}</div>
                  <div><Anchor href={CONFIG.accommodations.hotel.mapsUrl}>{CONFIG.accommodations.hotel.address}</Anchor></div>
                  <div>{CONFIG.accommodations.hotel.shuttleNote}</div>
                  <div><Anchor href="https://www.marriott.com/en-us/hotels/bdrri-residence-inn-boulder-broomfield-interlocken/overview/">Book your room via the Residence Inn portal</Anchor></div>
                </div>
              </div>
              <div className="stay-secondary">
                <div className="photo-frame">
                  <img src="img/hotel.png" alt="Hotel exterior" onError={(e) => (e.currentTarget.src = FALLBACKS.gallery)} />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* REGISTRY */}
        {CONFIG.sections.registry && (
        <Section show={page==='registry'} id="registry" title="Registry">
            <div className="detail-grid">
              {CONFIG.registry.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="detail-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span>{r.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </header>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>Browse gifts and experiences we’ve curated for our home and honeymoon.</p>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* GALLERY */}
        {CONFIG.sections.gallery && (
        <Section show={page==='gallery'} id="gallery" title="Gallery">
            <div className="space-y-10">
              <div>
                <h3 className="nouveau-script text-xl md:text-2xl mb-4" style={{ color: CONFIG.colors.wine }}>Engagement!</h3>
                <div className="gallery-grid">
                  {ENGAGEMENT_IMAGES.map((src, i) => (
                    <figure key={`engagement-${i}`} className="gallery-card">
                      <img src={src} alt={`Engagement ${i + 1}`} onError={(e) => (e.currentTarget.src = FALLBACKS.gallery)} />
                      <figcaption className="nouveau-script">{CONFIG.couple.primaryNames}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="nouveau-script text-xl md:text-2xl mb-4" style={{ color: CONFIG.colors.wine }}>Other Fun Photos</h3>
                <div className="gallery-grid">
                  {FUN_IMAGES.map((src, i) => (
                    <figure key={`fun-${i}`} className="gallery-card">
                      <img src={src} alt={`Fun ${i + 1}`} onError={(e) => (e.currentTarget.src = FALLBACKS.gallery)} />
                      <figcaption className="nouveau-script">{CONFIG.couple.primaryNames}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* FAQ */}
        {CONFIG.sections.faq && (
        <Section show={page==='faq'} id="faq" title="FAQ">
            <div className="detail-grid">
              {CONFIG.faq.map((item, i) => (
                <div key={i} className="detail-card" style={{ textAlign: 'left' }}>
                  <header>{item.q}</header>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.55' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* UPDATES */}
        {renderUpdatesContent()}

        {/* RSVP */}
        {CONFIG.sections.rsvp && (
        <Section show={page==='rsvp'} id="rsvp" title="RSVP">
            <Card className="bg-white/95 border-black/10 rounded-3xl shadow-sm ring-1 ring-black/5"><CardContent className="pt-6">
              {CONFIG.rsvp.mode === "external" ? (
                <div className="text-center space-y-4 py-10"><p className="opacity-90">Please submit your RSVP via our Aisle Planner form.</p><a href={CONFIG.rsvp.externalUrl} target="_blank" rel="noreferrer"><Button size="lg" style={{ backgroundColor: palette.primary }}>Go to RSVP</Button></a></div>
              ) : CONFIG.rsvp.mode === "embed" ? (
                <div className="py-2"><iframe src={CONFIG.rsvp.embed.src} title="RSVP" className="w-full rounded-xl border" style={{ height: CONFIG.rsvp.embed.height }} /></div>
              ) : submitted ? (
                <div className="text-center space-y-3 py-10"><h3 className="text-xl font-semibold">Thanks for your RSVP!</h3><p className="opacity-80 max-w-prose mx-auto">We’ve recorded your response for {CONFIG.couple.fullNames}. If you need to make changes, just submit the form again.</p></div>
              ) : (
                <form onSubmit={submitForm} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Jane Doe" />{errors.name && <p className="text-red-300 text-xs">{errors.name}</p>}</div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={rsvp.email} onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })} placeholder="jane@example.com" />{errors.email && <p className="text-red-300 text-xs">{errors.email}</p>}</div>
                  <div className="space-y-2"><Label htmlFor="attending">Will you attend?</Label><select id="attending" className="w-full bg-transparent border rounded-md px-3 py-2" value={rsvp.attending} onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value })}><option value="yes">Happily accepts</option><option value="no">Regretfully declines</option></select></div>
                  <div className="space-y-2"><Label htmlFor="guests">Number of Guests (including you)</Label><Input id="guests" type="number" min={1} value={rsvp.guests} onChange={(e) => setRsvp({ ...rsvp, guests: Number(e.target.value) })} />{errors.guests && <p className="text-red-300 text-xs">{errors.guests}</p>}</div>
                  <div className="md:col-span-2 space-y-2"><Label htmlFor="message">Notes (allergies, songs, etc.)</Label><Textarea id="message" rows={4} value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} placeholder="Add any details we should know" /></div>
                  <div className="md:col-span-2 flex justify-end"><Button type="submit" size="lg" style={{ backgroundColor: palette.primary }}>Submit RSVP</Button></div>
                </form>
              )}
            </CardContent></Card>
          </Section>
        )}
      </div>
    </div>
  );
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
  console.info('React render invoked');
} catch (err) {
  console.error('Error during React render', err);
  try { document.getElementById('root').innerHTML = '<div style="padding:1rem;color:#a00">React render error: '+(err && err.message)+'. Check the console for stack trace.</div>'; } catch(e){/* swallow */}
}
