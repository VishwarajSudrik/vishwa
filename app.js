/**
 * Vishwa AI Tools Hub – app.js
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

// ─── AI Response Logic ────────────────────────────────────────────────────────
const AI_RESPONSES = {
  greeting: [
    "Hello! I'm Vishwa AI, your all-in-one creative assistant. How can I help you today? 🚀",
    "Hey there! Ready to build something amazing? Tell me what you need! ✨",
  ],
  app: [
    "Sure! To build your app I'll need a few details:\n\n• What platform? (iOS, Android, Web)\n• Core features you need?\n• Preferred tech stack?\n\nOnce you share that, I'll generate the architecture, UI components, and starter code for you! 📱",
    "Great choice! Apps are my specialty. Let's start with the App Builder AI tool. Tell me what your app should do and I'll create a project scaffold with clean code and a solid architecture. 💡",
  ],
  website: [
    "Let's build your website! Here's what I can do:\n\n• Generate complete HTML/CSS/JS pages\n• Create Next.js or other framework projects\n• Write SEO-optimized content\n• Make it fully responsive\n\nWhat kind of website do you need? 🌐",
    "Awesome! For website development I recommend using the Website Development AI tool. Tell me your niche and goals — I'll generate everything from the layout to the copy! 🌟",
  ],
  design: [
    "Love design! I can help with:\n\n• Brand color palettes 🎨\n• Typography pairings\n• UI component design\n• Design system tokens\n\nWhat are you designing? Share your brand vibe or industry.",
    "Great! The Design AI tool will generate color schemes, UI kits, and even Figma-ready design tokens. What's the mood — modern, playful, corporate, or something else? ✨",
  ],
  post: [
    "Let's go viral! 🔥 Tell me:\n\n• Which platform? (Instagram, LinkedIn, X, TikTok)\n• Your niche or topic\n• Tone? (Professional / Casual / Humorous)\n\nI'll craft captions, hashtags, and even a content calendar!",
    "Post creation is my jam! Using the Post Maker AI, I can create platform-specific captions with optimal hashtags and hook strategies. What's the post about? 📝",
  ],
  edit: [
    "Sure, send me the text or code and tell me what you'd like improved — grammar fix, tone change, summarisation, or translation. I'll polish it instantly! ✂️",
    "Happy to help edit! The Content Editor AI can rewrite in different tones, fix errors, translate to 50+ languages, or condense lengthy content. Paste what you'd like edited! 📝",
  ],
  default: [
    "I'm Vishwa AI — I can help you with:\n\n• 📱 **App Development**\n• 🌐 **Website Building**\n• 🎨 **Design & UI**\n• ✍️ **Social Media Posts**\n• ✂️ **Content Editing**\n• 🚀 **Creative Projects**\n\nJust tell me what you want to create!",
    "That's an interesting request! Let me help you with that. Could you share a bit more detail so I can give you the most relevant assistance? I work best with specific goals! 🎯",
  ],
};

// ─── Utility ──────────────────────────────────────────────────────────────────
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (/\b(hi|hello|hey|hola|howdy)\b/.test(lower)) return pickRandom(AI_RESPONSES.greeting);
  if (/app|mobile|android|ios|flutter|react native/.test(lower)) return pickRandom(AI_RESPONSES.app);
  if (/website|web|landing page|nextjs|html|css/.test(lower)) return pickRandom(AI_RESPONSES.website);
  if (/design|color|palette|ui|ux|figma|brand/.test(lower)) return pickRandom(AI_RESPONSES.design);
  if (/post|caption|instagram|linkedin|twitter|tiktok|social/.test(lower)) return pickRandom(AI_RESPONSES.post);
  if (/edit|fix|grammar|rewrite|translate|polish|improve/.test(lower)) return pickRandom(AI_RESPONSES.edit);
  return pickRandom(AI_RESPONSES.default);
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
  // Convert **bold** markdown to <strong>
  bubble.innerHTML = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

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
    chatInput.value = `Help me with ${tool.title}`;
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
