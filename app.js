/**
 * Vishwa AI Tools Hub – app.js  (v2 – fully functional tools)
 */

// ─── Tool Definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 'app-builder',
    icon: '📱',
    title: 'App Builder AI',
    badge: 'Popular',
    badgeClass: '',
    accentColor: 'linear-gradient(90deg, #6c63ff, #a89eff)',
    description:
      'Design, prototype, and generate code for mobile and desktop applications using natural language instructions.',
    features: ['UI Generation', 'Code Export', 'React / Flutter', 'Cross-platform'],
    capabilities: [
      'Generate React, Flutter, or SwiftUI components from descriptions',
      'Create responsive UI layouts with accessibility in mind',
      'Export production-ready code with clean architecture',
      'Suggest app architecture patterns (MVC, MVVM, Clean)',
      'Generate REST API integration boilerplate',
    ],
  },
  {
    id: 'web-dev',
    icon: '🌐',
    title: 'Website Development AI',
    badge: 'Popular',
    badgeClass: '',
    accentColor: 'linear-gradient(90deg, #43b89c, #6c63ff)',
    description:
      'Build full-stack websites and landing pages. From wireframes to deployed code — all with AI assistance.',
    features: ['HTML/CSS/JS', 'Next.js', 'SEO Ready', 'Responsive'],
    capabilities: [
      'Generate complete HTML, CSS, and JavaScript from a prompt',
      'Create Next.js, Nuxt, or SvelteKit project scaffolds',
      'Write SEO-optimized meta tags and structured data',
      'Build accessible, WCAG-compliant UI components',
      'Generate backend routes and database schemas',
    ],
  },
  {
    id: 'design-ai',
    icon: '🎨',
    title: 'Design AI',
    badge: 'New',
    badgeClass: 'new',
    accentColor: 'linear-gradient(90deg, #ff6584, #ffb347)',
    description:
      'Generate stunning visuals, UI kits, color palettes, and design system tokens with AI-powered suggestions.',
    features: ['Color Palettes', 'UI Kits', 'Icons', 'Typography'],
    capabilities: [
      'Generate color palettes from brand keywords or images',
      'Suggest typography pairings for any design mood',
      'Create design system tokens (Tailwind / CSS variables)',
      'Generate SVG icons and illustration concepts',
      'Write Figma plugin scripts to automate repetitive tasks',
    ],
  },
  {
    id: 'post-maker',
    icon: '✍️',
    title: 'Post Maker AI',
    badge: 'New',
    badgeClass: 'new',
    accentColor: 'linear-gradient(90deg, #ff6584, #6c63ff)',
    description:
      'Create scroll-stopping social media posts, captions, and content calendars for any platform in seconds.',
    features: ['Instagram', 'LinkedIn', 'Twitter/X', 'Captions'],
    capabilities: [
      'Write platform-optimized captions for Instagram, LinkedIn, X, and TikTok',
      'Generate 30-day content calendars with post ideas',
      'Create hashtag strategies for maximum reach',
      'Craft engaging story scripts and carousel copy',
      'A/B test different headline and hook variations',
    ],
  },
  {
    id: 'editor-ai',
    icon: '✂️',
    title: 'Content Editor AI',
    badge: '',
    badgeClass: '',
    accentColor: 'linear-gradient(90deg, #43b89c, #ffb347)',
    description:
      'Rewrite, refine, and polish any text or code. Fix grammar, improve tone, summarize, and translate with ease.',
    features: ['Grammar Fix', 'Tone Control', 'Summarise', 'Translate'],
    capabilities: [
      'Fix grammar, spelling, and punctuation errors instantly',
      'Rewrite content in a different tone (professional, casual, witty)',
      'Summarise long articles or documents in bullet points',
      'Translate content across 50+ languages',
      'Improve code readability and add inline documentation',
    ],
  },
  {
    id: 'creative-ai',
    icon: '🚀',
    title: 'Creative Studio AI',
    badge: 'Beta',
    badgeClass: '',
    accentColor: 'linear-gradient(90deg, #a89eff, #ff6584)',
    description:
      'Brainstorm ideas, write scripts, craft pitch decks, and produce creative briefs for any project or campaign.',
    features: ['Brainstorm', 'Scripts', 'Pitch Decks', 'Campaigns'],
    capabilities: [
      'Generate creative briefs for marketing campaigns',
      'Write YouTube / podcast scripts and show notes',
      'Draft pitch deck narratives and slide-by-slide outlines',
      'Brainstorm product names, taglines, and brand voices',
      'Create mood boards and concept descriptions',
    ],
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
let activeToolId = null;   // currently active tool context

// ─── Utility ──────────────────────────────────────────────────────────────────
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Message Formatter (handles code blocks + markdown) ──────────────────────
function formatMessage(raw) {
  const segments = raw.split(/(```[\s\S]*?```)/g);
  return segments.map(seg => {
    if (seg.startsWith('```') && seg.endsWith('```')) {
      const inner   = seg.slice(3, -3);
      const nlIndex = inner.indexOf('\n');
      const lang    = nlIndex !== -1 ? inner.slice(0, nlIndex).trim() : '';
      const code    = nlIndex !== -1 ? inner.slice(nlIndex + 1) : inner;
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const uid = 'cb-' + Math.random().toString(36).slice(2, 8);
      return (
        `<div class="code-block">` +
        `<div class="code-header">` +
        `<span class="code-lang">${lang || 'code'}</span>` +
        `<button class="copy-btn" data-target="${uid}">📋 Copy</button>` +
        `</div>` +
        `<pre id="${uid}"><code>${escaped}</code></pre>` +
        `</div>`
      );
    }
    // Plain text – escape then apply markdown
    return seg
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/\n/g, '<br>');
  }).join('');
}

// ─── Copy-to-clipboard (event delegation) ────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const pre = document.getElementById(btn.dataset.target);
  if (!pre) return;
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
  });
});

// ─── Website Generator ───────────────────────────────────────────────────────
function generateWebsite(message) {
  const lower = message.toLowerCase();

  // Detect type
  let siteType = 'landing';
  if (/portfolio|personal/.test(lower))          siteType = 'portfolio';
  else if (/restaurant|cafe|food|bakery/.test(lower)) siteType = 'restaurant';
  else if (/gym|fitness|sport|workout/.test(lower))   siteType = 'fitness';
  else if (/shop|store|ecommerce|product/.test(lower)) siteType = 'ecommerce';
  else if (/blog|news|article/.test(lower))       siteType = 'blog';
  else if (/saas|software|startup/.test(lower))   siteType = 'saas';
  else if (/agency|studio/.test(lower))           siteType = 'agency';

  const cfgs = {
    landing:    { title:'My Business',    tagline:'Your Vision, Our Mission',      color:'#6c63ff', em:'🚀', features:['Premium Quality','Expert Team','Fast Delivery'],   cta:'Get Started Today',      desc:'We help businesses grow with innovative solutions.' },
    portfolio:  { title:'Your Name',      tagline:'Designer & Developer',           color:'#2d2d2d', em:'💼', features:['Web Design','UI/UX Design','Development'],         cta:'View My Work',           desc:'Creating digital experiences that matter.' },
    restaurant: { title:'The Golden Fork',tagline:'Fresh Food, Made with Love',     color:'#e63946', em:'🍽️', features:['Fresh Ingredients','Cozy Atmosphere','Daily Specials'], cta:'Reserve a Table',   desc:'Experience the finest flavours from around the world.' },
    fitness:    { title:'FitLife Studio', tagline:'Transform Your Body & Mind',     color:'#2d6a4f', em:'💪', features:['Expert Trainers','Modern Equipment','Flexible Plans'], cta:'Start Your Journey', desc:'We help you achieve your fitness goals, one rep at a time.' },
    ecommerce:  { title:'ShopWave',       tagline:'Quality Products, Delivered Fast',color:'#f4a261',em:'🛒', features:['Free Shipping','Easy Returns','24/7 Support'],      cta:'Shop Now',               desc:'Discover thousands of products at unbeatable prices.' },
    blog:       { title:'The Daily Read', tagline:'Stories That Inspire',           color:'#219ebc', em:'📝', features:['Featured Articles','Categories','Newsletter'],       cta:'Read Latest',            desc:'Your go-to source for insightful articles and stories.' },
    saas:       { title:'AppFlow',        tagline:'Work Smarter, Not Harder',       color:'#4361ee', em:'⚡', features:['Powerful Dashboard','Team Collaboration','Free Trial'], cta:'Start Free Trial',   desc:'The all-in-one platform to manage your workflow.' },
    agency:     { title:'Creative Agency',tagline:'We Build Digital Experiences',   color:'#9b5de5', em:'🎯', features:['Brand Strategy','Web Design','Digital Marketing'], cta:"Let's Work Together",    desc:'Award-winning creative solutions for ambitious brands.' },
  };

  const cfg = cfgs[siteType];
  const c   = cfg.color;

  const code = `\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cfg.title}</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; }
    a { text-decoration: none; }

    /* NAV */
    nav { display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 6%; background: #fff;
          box-shadow: 0 1px 12px rgba(0,0,0,.07); position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 1.4rem; font-weight: 800; color: ${c}; }
    nav ul { display: flex; gap: 2rem; list-style: none; }
    nav ul a { color: #555; font-weight: 500; transition: color .2s; }
    nav ul a:hover { color: ${c}; }
    .nav-cta { background: ${c}; color: #fff !important; padding: .5rem 1.2rem;
                border-radius: 8px; font-weight: 600; }

    /* HERO */
    .hero { min-height: 88vh; display: flex; align-items: center; padding: 5rem 6%; gap: 3rem;
            background: linear-gradient(135deg, ${c}18 0%, #fff 55%); }
    .hero-text { flex: 1; max-width: 600px; }
    .hero-badge { display: inline-block; background: ${c}20; color: ${c};
                  padding: .3rem .9rem; border-radius: 20px; font-size: .85rem;
                  font-weight: 600; margin-bottom: 1.5rem; }
    .hero h1 { font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.2rem; }
    .hero h1 .accent { color: ${c}; }
    .hero p { font-size: 1.15rem; color: #666; line-height: 1.7; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary { background: ${c}; color: #fff; padding: .85rem 2rem; border-radius: 10px;
                   font-weight: 700; font-size: 1rem; transition: opacity .2s, transform .15s; }
    .btn-primary:hover { opacity: .9; transform: translateY(-1px); }
    .btn-outline { border: 2px solid ${c}; color: ${c}; padding: .85rem 2rem;
                   border-radius: 10px; font-weight: 700; font-size: 1rem; transition: .2s; }
    .btn-outline:hover { background: ${c}10; }
    .hero-visual { flex: 1; max-width: 460px; background: linear-gradient(135deg,${c}30,${c}60);
                   border-radius: 24px; height: 380px; display: flex; align-items: center;
                   justify-content: center; font-size: 6rem; }

    /* FEATURES */
    .features { padding: 5rem 6%; background: #f8f9fc; text-align: center; }
    .section-label { display: inline-block; color: ${c}; font-weight: 600; font-size: .85rem;
                     letter-spacing: .08em; text-transform: uppercase; margin-bottom: .7rem; }
    .features h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: .7rem; }
    .features .sub { color: #777; font-size: 1.05rem; margin-bottom: 3rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .card { background: #fff; padding: 2rem; border-radius: 14px; text-align: left;
            box-shadow: 0 4px 20px rgba(0,0,0,.05); transition: transform .2s, box-shadow .2s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,.1); }
    .card-icon { font-size: 2.2rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: .5rem; }
    .card p { color: #777; line-height: 1.6; }

    /* CTA BAND */
    .cta-band { padding: 5rem 6%; text-align: center;
                background: linear-gradient(135deg, ${c}, ${c}aa); color: #fff; }
    .cta-band h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem; }
    .cta-band p { opacity: .9; font-size: 1.05rem; margin-bottom: 2rem; }
    .btn-white { background: #fff; color: ${c}; padding: .9rem 2.5rem; border-radius: 10px;
                 font-weight: 700; font-size: 1rem; transition: .2s; }
    .btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }

    /* FOOTER */
    footer { background: #111; color: #aaa; text-align: center;
             padding: 2.5rem 6%; font-size: .9rem; line-height: 1.8; }
    footer .footer-logo { color: ${c}; font-weight: 700; font-size: 1.2rem; margin-bottom: .5rem; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero { flex-direction: column; min-height: auto; padding-top: 3rem; }
      .hero-visual { display: none; }
      nav ul { display: none; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="logo">${cfg.title}</div>
    <ul>
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="#cta" class="btn-primary nav-cta">${cfg.cta}</a>
  </nav>

  <section class="hero">
    <div class="hero-text">
      <div class="hero-badge">✦ Welcome to ${cfg.title}</div>
      <h1>${cfg.tagline.split(' ').slice(0,3).join(' ')}<br>
          <span class="accent">${cfg.tagline.split(' ').slice(3).join(' ')}</span></h1>
      <p>${cfg.desc}</p>
      <div class="hero-actions">
        <a href="#features" class="btn-primary">${cfg.cta} →</a>
        <a href="#about" class="btn-outline">Learn More</a>
      </div>
    </div>
    <div class="hero-visual">${cfg.em}</div>
  </section>

  <section class="features" id="features">
    <div class="section-label">⚡ What We Offer</div>
    <h2>Built for your success</h2>
    <p class="sub">Everything you need, all in one place.</p>
    <div class="cards">
      ${cfg.features.map((f, i) => `
      <div class="card">
        <div class="card-icon">${['✨','🚀','🎯'][i]}</div>
        <h3>${f}</h3>
        <p>We deliver ${f.toLowerCase()} that exceeds expectations and drives real results.</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="cta-band" id="cta">
    <h2>Ready to get started?</h2>
    <p>Join thousands of satisfied customers today.</p>
    <a href="#" class="btn-white">${cfg.cta}</a>
  </section>

  <footer>
    <div class="footer-logo">${cfg.title}</div>
    <p>© 2025 ${cfg.title}. All rights reserved.</p>
    <p>Built with ❤️ using Vishwa AI</p>
  </footer>

</body>
</html>
\`\`\``;

  return `Here's your complete **${siteType} website**! 🌐\n\n${code}\n\n✅ **Ready to use!** Save as \`index.html\` and open in any browser.\n\nWant me to customise it?\n• 🎨 Change colours or fonts\n• ➕ Add pricing, FAQ, or testimonials sections\n• ⚡ Convert to React / Next.js\n• 📱 Add a mobile hamburger menu`;
}

// ─── App Builder Generator ────────────────────────────────────────────────────
function generateApp(message) {
  const lower = message.toLowerCase();

  // Detect framework
  let framework = 'react';
  if (/flutter/.test(lower))              framework = 'flutter';
  else if (/react native/.test(lower))    framework = 'react-native';
  else if (/vue/.test(lower))             framework = 'vue';
  else if (/html|vanilla|plain js/.test(lower)) framework = 'html';

  // Detect app type
  let appType = 'todo';
  if (/login|auth|sign[- ]?in/.test(lower))     appType = 'login';
  else if (/calculator|calc/.test(lower))        appType = 'calculator';
  else if (/weather/.test(lower))                appType = 'weather';
  else if (/chat|messag/.test(lower))            appType = 'chat';
  else if (/dashboard|admin/.test(lower))        appType = 'dashboard';
  else if (/quiz/.test(lower))                   appType = 'quiz';
  else if (/todo|task|list/.test(lower))         appType = 'todo';

  // ── React templates ──────────────────────────────────────────────────────
  const reactTodo = `\`\`\`jsx
import React, { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Design the UI', done: false },
    { id: 2, text: 'Write the logic', done: true },
  ]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggle = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = id => setTodos(todos.filter(t => t.id !== id));

  return (
    <div style={S.container}>
      <h1 style={S.title}>📝 My Todo App</h1>
      <div style={S.row}>
        <input
          style={S.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task…"
        />
        <button style={S.addBtn} onClick={addTodo}>Add</button>
      </div>
      <ul style={S.list}>
        {todos.map(t => (
          <li key={t.id} style={S.item}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ ...S.text, ...(t.done ? S.done : {}) }}>{t.text}</span>
            <button style={S.delBtn} onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p style={S.count}>{todos.filter(t => !t.done).length} task(s) remaining</p>
    </div>
  );
}

const S = {
  container: { maxWidth: 480, margin: '40px auto', padding: '2rem', fontFamily: 'system-ui',
               background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,.1)' },
  title:     { fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1a1a2e' },
  row:       { display: 'flex', gap: 8, marginBottom: '1.5rem' },
  input:     { flex: 1, padding: '10px 14px', border: '2px solid #e2e8f0',
               borderRadius: 8, fontSize: 16, outline: 'none' },
  addBtn:    { background: '#6c63ff', color: '#fff', border: 'none', padding: '10px 18px',
               borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  list:      { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 },
  item:      { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
               background: '#f8f9fc', borderRadius: 10 },
  text:      { flex: 1, fontSize: 15 },
  done:      { textDecoration: 'line-through', opacity: .45 },
  delBtn:    { background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', fontSize: 16 },
  count:     { marginTop: '1rem', color: '#888', fontSize: '.9rem', textAlign: 'right' },
};
\`\`\``;

  const reactLogin = `\`\`\`jsx
import React, { useState } from 'react';

export default function LoginForm() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const update = key => e => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1400));   // simulated API
    setLoading(false);
    alert(\`Welcome back, \${form.email}!\`);
  };

  return (
    <div style={S.page}>
      <form style={S.card} onSubmit={handleSubmit}>
        <h1 style={S.title}>Welcome back 👋</h1>
        <p style={S.sub}>Sign in to your account</p>
        {error && <div style={S.error}>{error}</div>}
        <label style={S.label}>Email</label>
        <input style={S.input} type="email"    value={form.email}    onChange={update('email')}    placeholder="you@example.com" />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" value={form.password} onChange={update('password')} placeholder="••••••••" />
        <button style={S.btn} disabled={loading}>{loading ? 'Signing in…' : 'Sign In →'}</button>
        <p style={S.link}>Don't have an account? <a href="#">Sign up</a></p>
      </form>
    </div>
  );
}

const S = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff' },
  card:  { background: '#fff', padding: '2.5rem', borderRadius: 16,
           boxShadow: '0 8px 40px rgba(0,0,0,.1)', width: '100%', maxWidth: 400,
           display: 'flex', flexDirection: 'column', gap: 12 },
  title: { fontSize: '1.8rem', color: '#1a1a2e', margin: 0 },
  sub:   { color: '#888', margin: '-4px 0 8px' },
  label: { fontSize: '.88rem', fontWeight: 600, color: '#555' },
  input: { padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 15, outline: 'none' },
  btn:   { marginTop: 8, background: '#6c63ff', color: '#fff', border: 'none',
           padding: 12, borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '.9rem' },
  link:  { textAlign: 'center', color: '#888', fontSize: '.9rem' },
};
\`\`\``;

  const reactCalc = `\`\`\`jsx
import React, { useState } from 'react';

const KEYS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev]       = useState(null);
  const [op, setOp]           = useState(null);
  const [fresh, setFresh]     = useState(false);

  const press = key => {
    if ('0123456789.'.includes(key)) {
      setDisplay(d => fresh || d === '0' ? key : d + key);
      setFresh(false);
    } else if ('÷×−+'.includes(key)) {
      setPrev(parseFloat(display)); setOp(key); setFresh(true);
    } else if (key === '=') {
      const cur = parseFloat(display);
      const res = op === '÷' ? prev / cur : op === '×' ? prev * cur
                : op === '−' ? prev - cur : prev + cur;
      setDisplay(String(parseFloat(res.toFixed(10))));
      setPrev(null); setOp(null); setFresh(true);
    } else if (key === 'C') {
      setDisplay('0'); setPrev(null); setOp(null); setFresh(false);
    } else if (key === '±') {
      setDisplay(d => String(-parseFloat(d)));
    } else if (key === '%') {
      setDisplay(d => String(parseFloat(d) / 100));
    }
  };

  return (
    <div style={S.calc}>
      <div style={S.display}>{display}</div>
      {KEYS.map((row, r) => (
        <div key={r} style={S.row}>
          {row.map(k => (
            <button key={k} style={{
              ...S.key,
              ...(k === '0' ? S.wide : {}),
              ...('÷×−+='.includes(k) ? S.opKey : {}),
              ...(k === 'C' || k === '±' || k === '%' ? S.funcKey : {}),
            }} onClick={() => press(k)}>{k}</button>
          ))}
        </div>
      ))}
    </div>
  );
}

const S = {
  calc:    { width: 320, margin: '60px auto', background: '#1c1c1e', borderRadius: 24,
             padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,.5)', fontFamily: 'system-ui' },
  display: { color: '#fff', fontSize: '3rem', textAlign: 'right', padding: '1rem .5rem', minHeight: 80 },
  row:     { display: 'flex', gap: 10, marginBottom: 10 },
  key:     { flex: 1, padding: '1rem', borderRadius: 50, border: 'none', background: '#3a3a3c',
             color: '#fff', fontSize: '1.4rem', cursor: 'pointer', transition: 'opacity .1s' },
  wide:    { flex: 2 },
  opKey:   { background: '#ff9f0a', color: '#fff' },
  funcKey: { background: '#636366', color: '#fff' },
};
\`\`\``;

  const reactChat = `\`\`\`jsx
import React, { useState, useRef, useEffect } from 'react';

const BOT_REPLIES = [
  "That's a great point! 😊",
  "Interesting! Tell me more.",
  "I see what you mean! 👍",
  "Got it! Is there anything else?",
  "Thanks for sharing that!",
];

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hello! How can I help you today? 👋' },
  ]);
  const [input, setInput]   = useState('');
  const bottomRef           = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, from: 'bot',
        text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)] }]);
    }, 800);
  };

  return (
    <div style={S.app}>
      <div style={S.header}>💬 Chat App</div>
      <div style={S.messages}>
        {messages.map(msg => (
          <div key={msg.id} style={{ ...S.msg, ...(msg.from === 'user' ? S.userMsg : S.botMsg) }}>
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={S.inputRow}>
        <input style={S.input} value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && send()}
               placeholder="Type a message…" />
        <button style={S.sendBtn} onClick={send}>➤</button>
      </div>
    </div>
  );
}

const S = {
  app:      { maxWidth: 420, margin: '30px auto', background: '#fff', borderRadius: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,.12)', overflow: 'hidden', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', height: 580 },
  header:   { background: '#6c63ff', color: '#fff', padding: '1rem 1.4rem', fontWeight: 700, fontSize: '1.1rem' },
  messages: { flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 },
  msg:      { maxWidth: '75%', padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.5 },
  userMsg:  { background: '#6c63ff', color: '#fff', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botMsg:   { background: '#f0f0f5', color: '#1a1a2e', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  inputRow: { display: 'flex', gap: 8, padding: '1rem', borderTop: '1px solid #eee' },
  input:    { flex: 1, padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 24, fontSize: 14, outline: 'none' },
  sendBtn:  { background: '#6c63ff', color: '#fff', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem' },
};
\`\`\``;

  const flutterTodo = `\`\`\`dart
import 'package:flutter/material.dart';

void main() => runApp(const TodoApp());

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Todo App',
    theme: ThemeData(colorSchemeSeed: const Color(0xFF6C63FF), useMaterial3: true),
    home: const TodoScreen(),
  );
}

class TodoItem {
  String text;
  bool done;
  TodoItem(this.text, this.done);
}

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});
  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  final List<TodoItem> _todos = [
    TodoItem('Design the UI', false),
    TodoItem('Write the logic', true),
  ];
  final _ctrl = TextEditingController();

  void _add() {
    if (_ctrl.text.trim().isEmpty) return;
    setState(() { _todos.add(TodoItem(_ctrl.text.trim(), false)); _ctrl.clear(); });
  }

  @override
  Widget build(BuildContext context) {
    final remaining = _todos.where((t) => !t.done).length;
    return Scaffold(
      appBar: AppBar(title: const Text('📝 My Todo App'), centerTitle: true),
      body: Column(children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Expanded(child: TextField(
              controller: _ctrl,
              decoration: const InputDecoration(hintText: 'Add a new task…', border: OutlineInputBorder()),
              onSubmitted: (_) => _add(),
            )),
            const SizedBox(width: 8),
            ElevatedButton(onPressed: _add, child: const Text('Add')),
          ]),
        ),
        Expanded(child: ListView.builder(
          itemCount: _todos.length,
          itemBuilder: (_, i) => ListTile(
            leading: Checkbox(
              value: _todos[i].done,
              onChanged: (v) => setState(() => _todos[i].done = v!),
            ),
            title: Text(_todos[i].text,
              style: TextStyle(decoration: _todos[i].done ? TextDecoration.lineThrough : null,
                               color: _todos[i].done ? Colors.grey : null)),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline, color: Colors.red),
              onPressed: () => setState(() => _todos.removeAt(i)),
            ),
          ),
        )),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text('$remaining task(s) remaining',
            style: const TextStyle(color: Colors.grey)),
        ),
      ]),
    );
  }
}
\`\`\``;

  // Pick code
  let code, frameworkLabel, instructions;
  if (framework === 'flutter') {
    code = flutterTodo;
    frameworkLabel = 'Flutter (Dart)';
    instructions  = 'Add to a Flutter project and run with `flutter run`.';
  } else if (framework === 'react-native') {
    code = reactTodo.replace('export default function TodoApp', 'export default function App');
    frameworkLabel = 'React Native';
    instructions  = 'Use inside an Expo or React Native CLI project.';
  } else {
    // React (default) – pick template by appType
    code = appType === 'login' ? reactLogin
         : appType === 'calculator' ? reactCalc
         : appType === 'chat' ? reactChat
         : reactTodo;
    frameworkLabel = 'React';
    instructions  = 'Create a new app with `npx create-react-app my-app`, then paste into `App.jsx`.';
  }

  return `Here's your **${appType} app** built with **${frameworkLabel}**! 📱\n\n${code}\n\n✅ **Ready to run!** ${instructions}\n\nWant me to:\n• 🔌 Add API integration / backend calls\n• 🎨 Restyle with Tailwind CSS\n• 📦 Generate a Flutter or React Native version\n• ➕ Add more features (auth, database, routing)`;
}

// ─── Post Maker Generator ─────────────────────────────────────────────────────
function generatePost(message) {
  const lower = message.toLowerCase();

  // Detect platform
  let platform = 'instagram';
  if (/linkedin/.test(lower))               platform = 'linkedin';
  else if (/twitter|tweet|x\.com/.test(lower)) platform = 'twitter';
  else if (/tiktok|tik tok/.test(lower))    platform = 'tiktok';
  else if (/facebook|fb/.test(lower))       platform = 'facebook';

  // Extract topic
  const topicMatch = message.match(/(?:about|for|on|regarding|promote|my)\s+(.{3,60}?)(?:\s*$|[.!?])/i);
  const topic      = topicMatch ? topicMatch[1].trim() : 'my brand';

  const instagramPost = () => {
    const hooks = [
      `✨ Something exciting is happening with ${topic}!`,
      `🔥 You need to hear this about ${topic}…`,
      `💡 Here's something most people don't know about ${topic}:`,
    ];
    const bodies = [
      `We've been working hard to bring you the very best, and we can't wait to share it with you.\n\nWhether you're a long-time fan or just discovering us, there's never been a better time to join our community. 🙌`,
      `Quality, passion, and a whole lot of love goes into everything we do with ${topic}. We believe in creating something that truly makes a difference.\n\nAre you ready? Because we definitely are! 💪`,
    ];
    const ctas = [
      '👉 Tap the link in bio to learn more!',
      '💬 Drop a comment below — we love hearing from you!',
      '❤️ Save this post and share with a friend who needs to see this!',
    ];
    const hashtagSets = [
      `#${topic.replace(/\s+/g,'').toLowerCase()} #trending #viral #explorepage #contentcreator #smallbusiness #socialmedia #instagram #reels #motivation`,
      `#growth #inspire #lifestyle #business #entrepreneurship #success #community #brand #marketing #digitalmarketing`,
    ];
    return (
      `**📸 Instagram Caption — Option 1:**\n` +
      `${pickRandom(hooks)}\n\n${pickRandom(bodies)}\n\n${pickRandom(ctas)}\n\n` +
      `.\n.\n.\n${pickRandom(hashtagSets)}\n\n` +
      `---\n\n` +
      `**📸 Instagram Caption — Option 2:**\n` +
      `Stop scrolling. 🛑\n\nThis is your sign to finally give ${topic} a try. Here's why people love it:\n\n` +
      `✅ Top quality you can trust\n✅ Results that speak for themselves\n✅ A community that has your back\n\n` +
      `${pickRandom(ctas)}\n\n.\n.\n.\n#${topic.split(' ')[0].toLowerCase()} #musttry #newpost #instagood #photooftheday #like4like #explore #viral #trending #lifestyle`
    );
  };

  const linkedinPost = () =>
    `**💼 LinkedIn Post:**\n\n` +
    `I want to talk about something that changed the way I think about ${topic}.\n\n` +
    `For a long time, I overlooked its potential. It wasn't until I really dug in that I realised just how powerful it can be.\n\n` +
    `Here's what I learned:\n\n` +
    `🔹 **It's not about perfection — it's about progress.**\n` +
    `Every step you take with ${topic} builds momentum, and momentum builds results.\n\n` +
    `🔹 **Consistency is the real secret.**\n` +
    `The people who succeed aren't the smartest or the luckiest — they just show up, every single day.\n\n` +
    `🔹 **Your network is your net worth.**\n` +
    `Surround yourself with people who push you forward.\n\n` +
    `If you're working on ${topic} right now, I'd love to connect and hear your story.\n\n` +
    `What's one lesson you've learned on your journey? Drop it in the comments 👇\n\n` +
    `#${topic.split(' ')[0]} #ProfessionalGrowth #Leadership #Innovation #Networking #Business #Entrepreneurship #LinkedInCommunity`;

  const twitterPost = () =>
    `**🐦 Twitter / X Post:**\n\n` +
    `Hot take: most people are sleeping on ${topic}.\n\n` +
    `Here's why it matters more than you think 🧵👇\n\n` +
    `(1/4) The biggest mistake? Waiting for the "perfect" moment. Start with what you have.\n\n` +
    `(2/4) The secret weapon? Consistency over intensity. Small steps every day beat big leaps once a month.\n\n` +
    `(3/4) The outcome? Compounding results that surprise even you.\n\n` +
    `(4/4) Ready to level up with ${topic}? Save this tweet for when you need motivation. 💪\n\n` +
    `#${topic.split(' ')[0]} #Growth #Motivation`;

  const tiktokPost = () =>
    `**🎵 TikTok Caption:**\n\n` +
    `POV: you just discovered ${topic} and now you can't stop thinking about it 🤯✨\n\n` +
    `Not me obsessing over this… okay maybe a little 😅\n\n` +
    `Drop a 🔥 if you relate!\n\n` +
    `#${topic.split(' ')[0].toLowerCase()} #fyp #foryoupage #viral #trending #tiktok #relatable #mustsee`;

  const facebookPost = () =>
    `**📘 Facebook Post:**\n\n` +
    `Friends, I have to share something I'm really excited about — ${topic}! 🎉\n\n` +
    `If you haven't heard about it yet, let me fill you in. It's been an absolute game-changer and I think you'll love it too.\n\n` +
    `Here's what makes it special:\n` +
    `✅ Easy to get started\n` +
    `✅ Real, tangible results\n` +
    `✅ A community of amazing people\n\n` +
    `Check the comments for more details, and feel free to share this with someone who'd benefit! ❤️\n\n` +
    `#${topic.split(' ')[0]} #Community #MustSee`;

  const postContent =
    platform === 'linkedin' ? linkedinPost() :
    platform === 'twitter'  ? twitterPost()  :
    platform === 'tiktok'   ? tiktokPost()   :
    platform === 'facebook' ? facebookPost() :
    instagramPost();

  return `Here are your **${platform.charAt(0).toUpperCase() + platform.slice(1)} posts** for **${topic}**! ✍️\n\n${postContent}\n\n✅ **Ready to post!** Copy and paste directly into ${platform.charAt(0).toUpperCase() + platform.slice(1)}.\n\nWant me to:\n• 🔄 Generate more variations\n• 📅 Create a 30-day content calendar\n• 🎯 Write posts for a different platform\n• 📊 Suggest a hashtag strategy`;
}

// ─── Design AI Generator ─────────────────────────────────────────────────────
function generateDesign(message) {
  const lower = message.toLowerCase();

  // Pick palette by industry/mood
  let palette, label;
  if (/tech|startup|software|app|saas/.test(lower)) {
    label   = 'Modern Tech';
    palette = { primary:'#4361ee', secondary:'#7209b7', accent:'#4cc9f0', neutral:'#adb5bd', bg:'#f8f9fa', surface:'#ffffff' };
  } else if (/food|restaurant|cafe|bakery|kitchen/.test(lower)) {
    label   = 'Warm & Inviting (Food)';
    palette = { primary:'#e63946', secondary:'#f4a261', accent:'#e9c46a', neutral:'#a8dadc', bg:'#fdf3e7', surface:'#ffffff' };
  } else if (/health|fitness|gym|wellness|sport/.test(lower)) {
    label   = 'Fresh & Energetic (Health)';
    palette = { primary:'#2d6a4f', secondary:'#52b788', accent:'#95d5b2', neutral:'#d8f3dc', bg:'#f0fdf4', surface:'#ffffff' };
  } else if (/luxury|fashion|premium|high-end|elegant/.test(lower)) {
    label   = 'Luxury & Elegant';
    palette = { primary:'#1a1a2e', secondary:'#c9a84c', accent:'#e8d5a3', neutral:'#6c6c6c', bg:'#f7f4ee', surface:'#ffffff' };
  } else if (/creative|art|design|studio|agency/.test(lower)) {
    label   = 'Bold & Creative';
    palette = { primary:'#9b5de5', secondary:'#f15bb5', accent:'#fee440', neutral:'#00bbf9', bg:'#fafafa', surface:'#ffffff' };
  } else if (/finance|bank|legal|corporate/.test(lower)) {
    label   = 'Professional & Trustworthy';
    palette = { primary:'#1b4332', secondary:'#2d6a4f', accent:'#b7e4c7', neutral:'#6c757d', bg:'#f8f9fa', surface:'#ffffff' };
  } else if (/minimal|clean|simple|white/.test(lower)) {
    label   = 'Clean Minimal';
    palette = { primary:'#1a1a2e', secondary:'#6c63ff', accent:'#e2e8f0', neutral:'#94a3b8', bg:'#ffffff', surface:'#f8fafc' };
  } else {
    label   = 'Modern & Vibrant';
    palette = { primary:'#6c63ff', secondary:'#ff6584', accent:'#43b89c', neutral:'#a0aec0', bg:'#f0f4ff', surface:'#ffffff' };
  }

  const swatches = Object.entries(palette).map(([name, hex]) =>
    `  ${name.padEnd(10)}: ${hex}`
  ).join('\n');

  const cssVars = Object.entries(palette).map(([name, hex]) =>
    `  --color-${name}: ${hex};`
  ).join('\n');

  const tailwind = Object.entries(palette).map(([name, hex]) =>
    `      ${name}: '${hex}',`
  ).join('\n');

  return (
    `Here's your **${label}** design system! 🎨\n\n` +
    `**🎨 Colour Palette:**\n\`\`\`\n${swatches}\n\`\`\`\n\n` +
    `**🖥️ CSS Custom Properties:**\n\`\`\`css\n:root {\n${cssVars}\n}\n\`\`\`\n\n` +
    `**⚡ Tailwind Config:**\n\`\`\`js\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${tailwind}\n      },\n    },\n  },\n};\n\`\`\`\n\n` +
    `**✍️ Typography Pairing:**\n` +
    `• **Headings:** Inter 700 / Poppins 700 / Sora 800\n` +
    `• **Body:** Inter 400 / DM Sans 400 / Plus Jakarta Sans 400\n` +
    `• **Mono:** JetBrains Mono / Fira Code\n\n` +
    `\`\`\`css\n/* Google Fonts import */\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Poppins:wght@600;700;800&display=swap');\n\n:root {\n  --font-heading: 'Poppins', sans-serif;\n  --font-body: 'Inter', sans-serif;\n  --font-size-xs: 0.75rem;\n  --font-size-sm: 0.875rem;\n  --font-size-base: 1rem;\n  --font-size-lg: 1.125rem;\n  --font-size-xl: 1.25rem;\n  --font-size-2xl: 1.5rem;\n  --font-size-3xl: 1.875rem;\n  --font-size-4xl: 2.25rem;\n}\n\`\`\`\n\n` +
    `✅ **Your design system is ready!** Import the CSS variables and start building.\n\n` +
    `Want me to:\n• 🎨 Generate a different colour mood (dark, pastel, neon)\n• 🧩 Create UI component specs (buttons, cards, inputs)\n• 📐 Generate spacing & shadow tokens\n• 🖼️ Write Figma variable exports`
  );
}

// ─── Creative Studio Generator ────────────────────────────────────────────────
function generateCreative(message) {
  const lower = message.toLowerCase();

  // Detect output type
  let type = 'brainstorm';
  if (/youtube|video script|script/.test(lower))   type = 'youtube';
  else if (/podcast/.test(lower))                   type = 'podcast';
  else if (/pitch deck|pitch|investor/.test(lower)) type = 'pitch';
  else if (/campaign|marketing/.test(lower))        type = 'campaign';
  else if (/tagline|slogan/.test(lower))            type = 'tagline';
  else if (/name|brand name/.test(lower))           type = 'names';
  else if (/script|ad/.test(lower))                 type = 'adscript';

  const topicMatch = message.match(/(?:about|for|on|called|named)\s+(.{3,60}?)(?:\s*$|[.!?])/i);
  const topic      = topicMatch ? topicMatch[1].trim() : 'my project';

  if (type === 'youtube') {
    return (
      `Here's your **YouTube video script** about "${topic}"! 🎬\n\n` +
      `**📋 Script:**\n\`\`\`\n` +
      `[INTRO — 0:00–0:30]\n` +
      `Hook: "Did you know that ${topic} is changing everything? In the next [X] minutes, I'm going to show you exactly how."\n\n` +
      `[Introduce yourself briefly]\n` +
      `"Hey everyone, welcome back to the channel! If you're new here, I'm [Your Name] and today we're diving deep into ${topic}."\n\n` +
      `[Tease what's coming]\n` +
      `"By the end of this video, you'll know [benefit 1], [benefit 2], and the one mistake most people make. Let's get into it!"\n\n` +
      `[MAIN CONTENT — 0:30–8:00]\n` +
      `Section 1: What is ${topic}? (1 min)\n` +
      `- Define it simply\n` +
      `- Why it matters right now\n` +
      `- Real-world example\n\n` +
      `Section 2: Why most people struggle with it (2 min)\n` +
      `- Common mistake #1\n` +
      `- Common mistake #2\n` +
      `- What they should do instead\n\n` +
      `Section 3: Step-by-step guide (4 min)\n` +
      `- Step 1: [Action]\n` +
      `- Step 2: [Action]\n` +
      `- Step 3: [Action]\n` +
      `- Pro tip: [Insider insight about ${topic}]\n\n` +
      `[OUTRO — 8:00–9:00]\n` +
      `"So there you have it — everything you need to know about ${topic}. If you found this helpful, smash that like button and subscribe for more content like this."\n` +
      `"Drop a comment below: what's YOUR biggest challenge with ${topic}? I read every single one."\n` +
      `"See you in the next one! ✌️"\n\`\`\`\n\n` +
      `✅ **Script ready!** Approx. 9 minutes at an average speaking pace.\n\nWant me to:\n• 📝 Write the video description and tags\n• 🎙️ Convert this to a podcast format\n• 📊 Create a content calendar around this topic\n• 🪝 Write 5 alternative hooks for A/B testing`
    );
  }

  if (type === 'pitch') {
    return (
      `Here's your **pitch deck outline** for "${topic}"! 🚀\n\n` +
      `**📊 10-Slide Pitch Deck:**\n\`\`\`\n` +
      `Slide 1 — COVER\n` +
      `  Title: [Company/Product Name]\n` +
      `  Tagline: [One sentence that captures the essence]\n` +
      `  Presenter: [Your Name] | [Date]\n\n` +
      `Slide 2 — THE PROBLEM\n` +
      `  Headline: "The problem we're solving"\n` +
      `  • Pain point 1 — with a stat or story\n` +
      `  • Pain point 2 — why current solutions fail\n` +
      `  • The cost of doing nothing\n\n` +
      `Slide 3 — THE SOLUTION\n` +
      `  Headline: "Introducing ${topic}"\n` +
      `  • What it does (1 sentence)\n` +
      `  • How it works (3 bullets)\n` +
      `  • Key differentiator\n\n` +
      `Slide 4 — MARKET OPPORTUNITY\n` +
      `  TAM: $[X]B total addressable market\n` +
      `  SAM: $[X]B serviceable addressable market\n` +
      `  SOM: $[X]M our realistic capture in Year 3\n\n` +
      `Slide 5 — PRODUCT / DEMO\n` +
      `  • Screenshot or mockup\n` +
      `  • Key features (3–4 bullets)\n` +
      `  • "Live demo available on request"\n\n` +
      `Slide 6 — TRACTION\n` +
      `  • [X] users / customers / revenue\n` +
      `  • Key partnerships or logos\n` +
      `  • Growth metric (MoM %)\n\n` +
      `Slide 7 — BUSINESS MODEL\n` +
      `  • How we make money (pricing tiers)\n` +
      `  • Unit economics (CAC, LTV)\n` +
      `  • Revenue streams\n\n` +
      `Slide 8 — GO-TO-MARKET\n` +
      `  Phase 1: [Early adopter strategy]\n` +
      `  Phase 2: [Growth/partnership strategy]\n` +
      `  Phase 3: [Scale strategy]\n\n` +
      `Slide 9 — THE TEAM\n` +
      `  • Founder 1 — [name, relevant background]\n` +
      `  • Founder 2 — [name, relevant background]\n` +
      `  • Key advisors\n\n` +
      `Slide 10 — THE ASK\n` +
      `  Raising: $[X]M Seed Round\n` +
      `  Use of funds:\n` +
      `    40% — Product development\n` +
      `    35% — Sales & marketing\n` +
      `    25% — Operations & team\n` +
      `  Target milestones: [12-month goals]\n\`\`\`\n\n` +
      `✅ **Deck outline ready!** Use in PowerPoint, Google Slides, or Pitch.com.\n\nWant me to:\n• ✍️ Write the full narrative for each slide\n• 📧 Draft the investor outreach email\n• 💡 Generate a one-pager / executive summary\n• 🗣️ Write speaker notes for each slide`
    );
  }

  if (type === 'campaign') {
    return (
      `Here's your **marketing campaign brief** for "${topic}"! 📣\n\n` +
      `**📋 Campaign Brief:**\n\`\`\`\n` +
      `CAMPAIGN NAME: "[ ] — choose a bold, memorable name"\n\n` +
      `OBJECTIVE\n` +
      `  Primary:   Increase brand awareness for ${topic}\n` +
      `  Secondary: Drive [X] sign-ups / purchases / leads\n` +
      `  KPI:       [X]% reach increase, [X]% engagement rate\n\n` +
      `TARGET AUDIENCE\n` +
      `  Demographics:  Age [X–X], [location], [gender mix]\n` +
      `  Psychographics: [interests, values, pain points]\n` +
      `  Platforms:     Instagram, LinkedIn, TikTok, Google\n\n` +
      `KEY MESSAGE\n` +
      `  Hook:    "[Attention-grabbing opening line]"\n` +
      `  Core:    "${topic} helps you [key benefit] without [pain point]."\n` +
      `  CTA:     "Try it free today — no credit card needed."\n\n` +
      `CONTENT CALENDAR (4 weeks)\n` +
      `  Week 1 — Awareness: Teaser posts, problem-focused\n` +
      `  Week 2 — Education: How-to content, benefit-driven\n` +
      `  Week 3 — Social Proof: Testimonials, case studies\n` +
      `  Week 4 — Conversion: Offers, urgency, strong CTAs\n\n` +
      `CHANNELS & BUDGET\n` +
      `  Organic social:   40% effort\n` +
      `  Paid ads (Meta):  30% budget\n` +
      `  Email marketing:  20% effort\n` +
      `  Influencer/PR:    10% budget\n\n` +
      `SUCCESS METRICS\n` +
      `  • Impressions:       [X]K+\n` +
      `  • Engagement rate:   [X]%+\n` +
      `  • Click-through:     [X]%+\n` +
      `  • Conversions:       [X]+\n\`\`\`\n\n` +
      `✅ **Campaign brief ready!** Share with your team or agency.\n\nWant me to:\n• 📱 Write all the social posts for each week\n• 📧 Draft the email sequences\n• 🎯 Create ad copy variations for A/B testing\n• 📊 Build a content calendar spreadsheet template`
    );
  }

  if (type === 'tagline') {
    return (
      `Here are **10 tagline options** for "${topic}"! ✨\n\n` +
      `**✍️ Taglines:**\n\`\`\`\n` +
      `1.  "${topic} — Built for the Bold."\n` +
      `2.  "Do more. Be more. Choose ${topic}."\n` +
      `3.  "The smarter way to [key benefit]."\n` +
      `4.  "${topic}: Where ideas become reality."\n` +
      `5.  "Less effort. More impact. That's ${topic}."\n` +
      `6.  "Your success starts with ${topic}."\n` +
      `7.  "Designed for dreamers. Delivered for doers."\n` +
      `8.  "${topic} — Think differently. Create fearlessly."\n` +
      `9.  "The future belongs to those who build it."\n` +
      `10. "Power up with ${topic}. The rest is history."\n\`\`\`\n\n` +
      `✅ **Ready to use!** Pick your favourite or mix and match.\n\nWant me to:\n• 🏷️ Generate brand name options too\n• 🎨 Suggest brand voice guidelines\n• 📢 Write full campaign headlines using these taglines\n• 💼 Create a brand story paragraph`
    );
  }

  if (type === 'names') {
    return (
      `Here are **brand name ideas** for "${topic}"! 🏷️\n\n` +
      `**🔤 Brand Name Options:**\n\`\`\`\n` +
      `Category A — Short & Punchy (best for apps / startups):\n` +
      `  1.  Velo       — fast, sleek, modern\n` +
      `  2.  Novu       — "new" feel, tech-forward\n` +
      `  3.  Zevo       — zero-to-value, energetic\n` +
      `  4.  Kora       — soft, approachable, memorable\n` +
      `  5.  Lumiq      — bright + unique\n\n` +
      `Category B — Descriptive & Meaningful:\n` +
      `  6.  SwiftPath   — fast route to success\n` +
      `  7.  ClearWave   — clarity + momentum\n` +
      `  8.  BoldNest    — courage + home\n` +
      `  9.  SunForge    — energy + creation\n` +
      `  10. PrimePulse  — premium + alive\n\`\`\`\n\n` +
      `✅ **Check domain availability** at namecheap.com or godaddy.com.\n\nWant me to:\n• ✍️ Write taglines for these names\n• 🎨 Suggest logo concepts for the top 3\n• 📋 Create a brand guidelines document\n• 🔍 Generate 10 more in a specific style`
    );
  }

  // Default: brainstorm
  return (
    `Here are **10 creative ideas** for "${topic}"! 💡\n\n` +
    `**🧠 Brainstorm Results:**\n\`\`\`\n` +
    `1.  Launch a "behind-the-scenes" series showing how ${topic} is made.\n` +
    `2.  Create a challenge or hashtag campaign around ${topic}.\n` +
    `3.  Partner with micro-influencers who already love ${topic}.\n` +
    `4.  Produce a "myth-busting" article or video about ${topic}.\n` +
    `5.  Host a live Q&A or webinar where you answer top questions.\n` +
    `6.  Build a free tool or template that solves a problem related to ${topic}.\n` +
    `7.  Share a customer success story or transformation tied to ${topic}.\n` +
    `8.  Run a limited-time giveaway to build excitement and reach.\n` +
    `9.  Collaborate with a complementary brand for cross-promotion.\n` +
    `10. Create a "beginner's guide to ${topic}" as a lead magnet.\n\`\`\`\n\n` +
    `✅ **Ideas ready!** Pick the ones that excite you most.\n\nWant me to:\n• 📅 Build a full content calendar around these ideas\n• ✍️ Write the content for any of these\n• 🎬 Turn idea #1 into a full YouTube script\n• 📣 Develop idea #6 into a marketing campaign`
  );
}

// ─── Content Editor Generator ─────────────────────────────────────────────────
function generateEditedContent(message) {
  const lower = message.toLowerCase();

  // Try to extract text to edit (after colon, "this:", quotes, or a newline)
  const colonMatch = message.match(/(?:this|text|content|following|below|:)\s*[:\-]?\s*\n?([\s\S]{20,})/i);
  const quoteMatch = message.match(/[""](.{20,})[""]|'(.{20,})'/);
  const textToEdit = (colonMatch ? colonMatch[1] : quoteMatch ? (quoteMatch[1] || quoteMatch[2]) : '').trim();

  if (!textToEdit) {
    return (
      `Sure! Paste your text and tell me what you'd like done. Here are some examples:\n\n` +
      `**Fix grammar:**\n\`Fix grammar: The quick brown fox jump over the lazy dog.\`\n\n` +
      `**Rewrite professionally:**\n\`Make this professional: hey man just checking in real quick lol\`\n\n` +
      `**Make it casual:**\n\`Make this casual: We wish to inform you of your upcoming appointment.\`\n\n` +
      `**Summarise:**\n\`Summarise this: [paste long text]\`\n\n` +
      `**Translate to Spanish:**\n\`Translate to Spanish: Hello, how are you today?\`\n\n` +
      `**Improve / make it engaging:**\n\`Improve this: Our product is good and people like it.\`\n\n` +
      `Just paste your text and I'll transform it instantly! ✂️`
    );
  }

  // Detect transformation type
  if (/summariz|summary/.test(lower)) {
    const sentences = textToEdit.match(/[^.!?\n]+[.!?\n]+/g) || textToEdit.split(' ').reduce((acc, w, i) => {
      const chunk = Math.floor(i / 15); acc[chunk] = (acc[chunk] || '') + ' ' + w; return acc;
    }, []);
    const bullets = sentences.slice(0, Math.min(6, sentences.length)).map(s => `• ${s.trim()}`).join('\n');
    return `**📝 Summary:**\n\n${bullets}\n\n---\n**Original length:** ${textToEdit.split(' ').length} words → **Summary:** ${bullets.split(' ').length} words\n\nWant me to make it shorter, longer, or in a different format?`;
  }

  if (/translat/.test(lower)) {
    const langMatch = lower.match(/to\s+([a-z]+(?:\s+[a-z]+)?)/);
    const lang = langMatch ? langMatch[1].charAt(0).toUpperCase() + langMatch[1].slice(1) : 'Spanish';
    return (
      `**🌍 Translation to ${lang}:**\n\n` +
      `*(A live translation API would produce the exact result — here's the structure)*\n\n` +
      `**Original:**\n${textToEdit}\n\n` +
      `**Translated (${lang}):**\n[${lang} translation of the above text]\n\n` +
      `💡 **To get the actual translation**, connect a free API like:\n` +
      `• **LibreTranslate** (free, open-source) — \`libretranslate.com\`\n` +
      `• **DeepL Free API** — \`deepl.com/pro-api\`\n` +
      `• **Google Translate API** — \`cloud.google.com/translate\`\n\n` +
      `Want me to generate the JavaScript code to call one of these APIs?`
    );
  }

  if (/professional|formal|business/.test(lower)) {
    const rewritten = textToEdit
      .replace(/\bcan't\b/gi, 'cannot').replace(/\bwon't\b/gi, 'will not')
      .replace(/\bdon't\b/gi, 'do not').replace(/\bI'm\b/gi, 'I am')
      .replace(/\bthey're\b/gi, 'they are').replace(/\bit's\b/gi, 'it is')
      .replace(/\bwe're\b/gi, 'we are').replace(/\byou're\b/gi, 'you are')
      .replace(/\bI've\b/gi, 'I have').replace(/\bthey've\b/gi, 'they have')
      .replace(/\bhey\b/gi, 'Hello').replace(/\bhi\b/gi, 'Greetings')
      .replace(/\bgonna\b/gi, 'going to').replace(/\bwanna\b/gi, 'want to')
      .replace(/\bgotta\b/gi, 'need to').replace(/\bcool\b/gi, 'excellent')
      .replace(/\bawesome\b/gi, 'outstanding').replace(/\bstuff\b/gi, 'items')
      .replace(/\bkinda\b/gi, 'somewhat').replace(/\blol\b/gi, '')
      .replace(/\bomg\b/gi, '').replace(/\btbh\b/gi, 'to be honest')
      .replace(/\bidk\b/gi, 'I am unsure').replace(/\bbtw\b/gi, 'by the way')
      .replace(/\s+/g, ' ').trim();
    return `**✨ Professional Version:**\n\n${rewritten}\n\n---\n**Original:**\n~~${textToEdit}~~\n\nWant a different tone? Try: "Make this casual", "Make this friendly", or "Make this concise".`;
  }

  if (/casual|friendly|simple|informal/.test(lower)) {
    const rewritten = textToEdit
      .replace(/\bcannot\b/gi, "can't").replace(/\bwill not\b/gi, "won't")
      .replace(/\bdo not\b/gi, "don't").replace(/\bI am\b/gi, "I'm")
      .replace(/\bthey are\b/gi, "they're").replace(/\bit is\b/gi, "it's")
      .replace(/\bwe are\b/gi, "we're").replace(/\byou are\b/gi, "you're")
      .replace(/\bI have\b/gi, "I've").replace(/\bGreetings\b/gi, 'Hey')
      .replace(/\bDear\b/g, 'Hi').replace(/\bFurthermore\b/gi, 'Also')
      .replace(/\bHowever\b/gi, 'But').replace(/\bTherefore\b/gi, 'So')
      .replace(/\bnevertheless\b/gi, 'still').replace(/\butilise\b/gi, 'use')
      .replace(/\bpurchase\b/gi, 'buy').replace(/\bcommence\b/gi, 'start')
      .replace(/\bterminate\b/gi, 'end').trim();
    return `**😊 Casual Version:**\n\n${rewritten}\n\n---\n**Original:**\n~~${textToEdit}~~\n\nWant a different tone? Try: "Make this professional", "Make this persuasive", or "Improve this".`;
  }

  if (/improve|enhance|engaging|better/.test(lower)) {
    const improved = textToEdit
      .replace(/\b(good|nice|okay|ok|fine)\b/gi, 'exceptional')
      .replace(/\b(bad|poor|not good)\b/gi, 'suboptimal')
      .replace(/\b(big|large)\b/gi, 'significant')
      .replace(/\b(small|tiny)\b/gi, 'compact')
      .replace(/\b(fast|quick)\b/gi, 'lightning-fast')
      .replace(/\b(said)\b/gi, 'stated')
      .replace(/\b(shows)\b/gi, 'demonstrates')
      .replace(/\b(uses)\b/gi, 'leverages')
      .replace(/\b(makes)\b/gi, 'enables')
      .replace(/^(.)/, c => c.toUpperCase())
      .replace(/\.\s+([a-z])/g, (m, c) => `. ${c.toUpperCase()}`);
    return `**🚀 Improved Version:**\n\n${improved}\n\n---\n**Original:**\n${textToEdit}\n\nWant me to make it: **shorter**, **more persuasive**, **more formal**, or add a **call-to-action**?`;
  }

  // Default: fix grammar
  const fixed = textToEdit
    .replace(/^(.)/, c => c.toUpperCase())
    .replace(/\.\s+([a-z])/g, (m, c) => `. ${c.toUpperCase()}`)
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])([a-zA-Z])/g, '$1 $2')
    .replace(/\bi m\b/gi, "I'm").replace(/\bive\b/gi, "I've")
    .replace(/\bcant\b/gi, "can't").replace(/\bwont\b/gi, "won't")
    .replace(/\bdont\b/gi, "don't").replace(/\bisnt\b/gi, "isn't")
    .replace(/\barent\b/gi, "aren't").replace(/\bthats\b/gi, "that's")
    .replace(/\bwhats\b/gi, "what's")
    .replace(/\s{2,}/g, ' ').trim();
  return `**✅ Grammar Fixed:**\n\n${fixed}\n\n---\n**Original:**\n~~${textToEdit}~~\n\nWant me to also: **rewrite it professionally**, **make it more concise**, or **improve the vocabulary**?`;
}

// ─── Greeting & Default Responses ────────────────────────────────────────────
const GREETINGS = [
  "Hello! I'm **Vishwa AI** — your all-in-one creative assistant. 🚀\n\nTell me what you'd like to build and I'll generate it for you:\n\n• 🌐 **Website** — full HTML/CSS page\n• 📱 **App** — React or Flutter code\n• ✍️ **Social post** — Instagram, LinkedIn, X, TikTok\n• 🎨 **Design system** — colour palette, CSS variables\n• ✂️ **Content edit** — fix, rewrite, or summarise text\n• 🚀 **Creative** — scripts, pitch decks, taglines",
  "Hey! Ready to create something amazing? ✨\n\nI'm **Vishwa AI** and I can generate:\n• Complete websites (save as `index.html`)\n• App code in React or Flutter\n• Platform-perfect social media posts\n• Colour palettes & design tokens\n• Scripts, pitch decks & campaign briefs\n\nJust describe what you need and I'll build it! 🛠️",
];

const DEFAULT_RESPONSES = [
  "I'm **Vishwa AI** — I can build real things for you! 🚀\n\nTry me with:\n• **\"Create a landing page for my gym\"** → full HTML\n• **\"Build a React todo app\"** → complete component code\n• **\"Write an Instagram post about coffee\"** → caption + hashtags\n• **\"Generate a color palette for a tech startup\"** → hex codes + CSS\n• **\"Write a YouTube script about productivity\"** → full script\n• **\"Fix grammar: [paste text]\"** → corrected text\n\nWhat do you want to create?",
  "I didn't quite catch that — but I can definitely help! 🎯\n\nHere's what I can generate **right now**:\n\n🌐 Websites → type: *\"create a website for [your business]\"*\n📱 Apps → type: *\"build a React [todo/login/chat] app\"*\n✍️ Posts → type: *\"write an Instagram post about [topic]\"*\n🎨 Design → type: *\"generate a color palette for [industry]\"*\n🚀 Creative → type: *\"write a pitch deck for [idea]\"*\n✂️ Edit → type: *\"fix grammar: [your text]\"*",
];

// ─── AI Router ────────────────────────────────────────────────────────────────
function getAIResponse(message) {
  const lower = message.toLowerCase();

  // Detect tool
  let toolId = activeToolId;
  if (!toolId) {
    if (/\b(hi|hello|hey|hola|howdy|greet)\b/.test(lower)) return pickRandom(GREETINGS);
    if (/app|mobile|android|ios|flutter|react native|swiftui/.test(lower))                toolId = 'app-builder';
    else if (/website|web page|landing page|portfolio|html|css|nextjs/.test(lower))       toolId = 'web-dev';
    else if (/post|caption|instagram|linkedin|twitter|tiktok|social media/.test(lower))   toolId = 'post-maker';
    else if (/edit|fix|grammar|rewrite|translate|summariz|improve|polish/.test(lower))    toolId = 'editor-ai';
    else if (/design|color|colour|palette|ui|ux|figma|brand|typography|font/.test(lower)) toolId = 'design-ai';
    else if (/script|pitch|brainstorm|creative|campaign|tagline|youtube|podcast|brand name/.test(lower)) toolId = 'creative-ai';
  }

  switch (toolId) {
    case 'app-builder': return generateApp(message);
    case 'web-dev':     return generateWebsite(message);
    case 'post-maker':  return generatePost(message);
    case 'editor-ai':   return generateEditedContent(message);
    case 'design-ai':   return generateDesign(message);
    case 'creative-ai': return generateCreative(message);
    default:            return pickRandom(DEFAULT_RESPONSES);
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
const chatMessages = document.getElementById('chat-messages');
const chatInput    = document.getElementById('chat-input');
const sendBtn      = document.getElementById('send-btn');

function appendMessage(text, role) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${role}`;
  avatar.textContent = role === 'ai' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (role === 'ai') {
    bubble.innerHTML = formatMessage(text);
  } else {
    // User messages: just escape HTML and convert newlines
    bubble.innerHTML = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const indicator = document.createElement('div');
  indicator.className = 'message ai typing-msg';
  indicator.innerHTML = `
    <div class="avatar ai">🤖</div>
    <div class="bubble typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;
  chatMessages.appendChild(indicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return indicator;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatInput.style.height = '';
  sendBtn.disabled = true;

  appendMessage(text, 'user');

  const typingEl = showTyping();
  const delay = 800 + Math.random() * 700;

  await new Promise(r => setTimeout(r, delay));

  typingEl.remove();
  appendMessage(getAIResponse(text), 'ai');
  sendBtn.disabled = false;
  chatInput.focus();
}

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-grow textarea
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
});

// Quick prompts
document.querySelectorAll('.quick-prompt').forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.dataset.prompt;
    sendMessage();
  });
});

// ─── Tools Grid ───────────────────────────────────────────────────────────────
function renderTools() {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;

  grid.innerHTML = TOOLS.map(tool => `
    <div class="tool-card" style="--card-accent: ${tool.accentColor}" data-tool="${tool.id}" tabindex="0" role="button" aria-label="Open ${tool.title}">
      <div class="tool-card-header">
        <div class="tool-icon">${tool.icon}</div>
        ${tool.badge ? `<span class="tool-badge ${tool.badgeClass}">${tool.badge}</span>` : ''}
      </div>
      <h3>${tool.title}</h3>
      <p>${tool.description}</p>
      <div class="tool-features">
        ${tool.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>
      <div class="tool-action">
        <button class="tool-link" data-tool="${tool.id}">
          Launch tool <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.tool-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.dataset.tool);
    });
  });

  grid.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.tool));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.tool);
      }
    });
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const modalOverlay = document.getElementById('modal-overlay');
const modalIcon    = document.getElementById('modal-icon');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-desc');
const modalList    = document.getElementById('modal-list');
const modalClose   = document.getElementById('modal-close');
const modalChat    = document.getElementById('modal-chat-btn');

function openModal(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return;

  modalIcon.textContent  = tool.icon;
  modalTitle.textContent = tool.title;
  modalDesc.textContent  = tool.description;
  modalList.innerHTML    = tool.capabilities
    .map(c => `<li>${c}</li>`)
    .join('');
  modalChat.dataset.tool = toolId;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

modalChat.addEventListener('click', () => {
  closeModal();
  const tool = TOOLS.find(t => t.id === modalChat.dataset.tool);
  if (tool) {
    activeToolId = tool.id;
    const prompts = {
      'app-builder': 'Build a React todo app',
      'web-dev':     'Create a landing page for my business',
      'post-maker':  'Write an Instagram post for my brand',
      'design-ai':   'Generate a color palette for a tech startup',
      'editor-ai':   'How do I use the Content Editor?',
      'creative-ai': 'Write a YouTube script about productivity',
    };
    chatInput.value = prompts[tool.id] || `Help me with ${tool.title}`;
    document.getElementById('assistant').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => sendMessage(), 500);
  }
});

// ─── Animated stat counters ───────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

// ─── Init ─────────────────────────────────────────────────────────────────────
renderTools();
