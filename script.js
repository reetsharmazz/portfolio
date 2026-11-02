/**
 * CHRONICLES OF THE REALM - JAVASCRIPT ENGINE
 * Portfolio of Reet Sharma
 * Features: Multi-Realm Navigation (Winterfell, The Citadel, Braavos),
 * Particle Physics Ambient Canvas, Procedural Web Audio Lute Harmonics,
 * Raven Dispatch Modal & Copy Scroll Utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initRealmNavigation();
  initAmbientCanvas();
  initCopyEmail();
  initRavenModal();
  initProceduralAudio();
  initRealmTime();
});

/* ==========================================================================
   1. REALM NAVIGATION (WINTERFELL / CITADEL / BRAAVOS)
   ========================================================================== */
const REALM_DATA = {
  winterfell: {
    name: 'Winterfell — The Great Keep',
    theme: 'winterfell',
    sigilColor: '#c5a059',
    sigilSvg: `
      <circle cx="50" cy="50" r="46" class="sigil-ring" />
      <path d="M50 14 L55 30 L72 32 L58 43 L64 60 L50 49 L36 60 L42 43 L28 32 L45 30 Z" class="sigil-star" />
      <path d="M38 52 C42 62, 58 62, 62 52 C65 68, 50 82, 50 82 C50 82, 35 68, 38 52 Z" class="sigil-shield" />
    `
  },
  citadel: {
    name: 'The Citadel — Oldtown (The Reach)',
    theme: 'citadel',
    sigilColor: '#c9a65b',
    sigilSvg: `
      <circle cx="50" cy="50" r="46" class="sigil-ring" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-dasharray="3 3"/>
      <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor"/>
      <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" stroke-width="1.5"/>
      <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" stroke-width="1.5"/>
    `
  },
  braavos: {
    name: 'Braavos — The Free City across Narrow Sea',
    theme: 'braavos',
    sigilColor: '#c4a161',
    sigilSvg: `
      <circle cx="50" cy="50" r="46" class="sigil-ring" />
      <path d="M50 16 L62 45 L94 50 L68 70 L78 96 L50 78 L22 96 L32 70 L6 50 L38 45 Z" fill="rgba(197, 160, 89, 0.15)" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" stroke-width="2"/>
    `
  }
};

let currentRealm = 'winterfell';

function initRealmNavigation() {
  const tabs = document.querySelectorAll('.place-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPlace = tab.getAttribute('data-place');
      switchInterface(targetPlace);
    });
  });

  // Keyboard navigation between realms (Left / Right arrow keys)
  document.addEventListener('keydown', (e) => {
    // Only if modal is not open
    const modal = document.getElementById('raven-modal');
    if (modal && modal.classList.contains('open')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const places = ['winterfell', 'citadel', 'braavos'];
      const currentIndex = places.indexOf(currentRealm);
      if (currentIndex === -1) return;

      let nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= places.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = places.length - 1;

      switchInterface(places[nextIndex]);
    }
  });
}

function switchInterface(realmKey) {
  if (!REALM_DATA[realmKey]) return;
  currentRealm = realmKey;

  // 1. Update body theme attribute
  document.body.setAttribute('data-theme', realmKey);

  // 2. Update active tab
  document.querySelectorAll('.place-tab').forEach(tab => {
    const isCurrent = tab.getAttribute('data-place') === realmKey;
    tab.classList.toggle('active', isCurrent);
  });

  // 3. Update active interface section
  document.querySelectorAll('.realm-interface').forEach(sec => {
    const isCurrent = sec.id === `interface-${realmKey}`;
    sec.classList.toggle('active', isCurrent);
  });

  // 4. Update Header Subtitle & Sigil
  const locationText = document.getElementById('current-location-text');
  if (locationText) {
    locationText.textContent = REALM_DATA[realmKey].name;
  }

  const sigilContainer = document.getElementById('active-sigil-svg');
  if (sigilContainer) {
    sigilContainer.innerHTML = REALM_DATA[realmKey].sigilSvg;
  }

  // 5. Update ambient particle behavior
  updateAmbientParticlesForRealm(realmKey);

  // 6. Smooth scroll to top of main container if needed
  const header = document.querySelector('.realm-header');
  if (window.scrollY > header.offsetTop + 180) {
    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Play a gentle subtle audio pluck if audio is enabled
  if (soundActive) {
    playMedievalChime(realmKey);
  }
}

// Make accessible globally
window.switchInterface = switchInterface;

/* ==========================================================================
   2. AMBIENT PARTICLES (SNOW FOR WINTERFELL, DUST FOR CITADEL, MIST FOR BRAAVOS)
   ========================================================================== */
let canvas, ctx, animationFrameId;
let particles = [];
const PARTICLE_COUNT = 45;

function initAmbientCanvas() {
  canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  createParticles();
  animateParticles();
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.6,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI
    });
  }
}

function updateAmbientParticlesForRealm(realm) {
  particles.forEach(p => {
    if (realm === 'winterfell') {
      // Soft gentle falling snow
      p.speedY = Math.random() * 0.9 + 0.4;
      p.speedX = (Math.random() - 0.5) * 0.4;
    } else if (realm === 'citadel') {
      // Gentle floating warm dust motes
      p.speedY = -(Math.random() * 0.4 + 0.1);
      p.speedX = (Math.random() - 0.5) * 0.3;
    } else if (realm === 'braavos') {
      // Gentle lateral sea mist breeze
      p.speedY = (Math.random() - 0.5) * 0.2;
      p.speedX = Math.random() * 0.8 + 0.3;
    }
  });
}

function animateParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let fillColor = 'rgba(215, 230, 245, '; // default soft winterfell snow
  if (currentRealm === 'citadel') {
    fillColor = 'rgba(224, 195, 135, '; // golden warm library motes
  } else if (currentRealm === 'braavos') {
    fillColor = 'rgba(165, 215, 225, '; // soft teal harbor mist
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.y += p.speedY;
    p.x += p.speedX;
    p.pulse += 0.02;

    // Wrap-around logic
    if (p.y > canvas.height) p.y = -5;
    if (p.y < -5) p.y = canvas.height;
    if (p.x > canvas.width) p.x = -5;
    if (p.x < -5) p.x = canvas.width;

    const currentAlpha = Math.max(0.1, p.opacity + Math.sin(p.pulse) * 0.15);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor + currentAlpha + ')';
    ctx.fill();
  }

  animationFrameId = requestAnimationFrame(animateParticles);
}

/* ==========================================================================
   3. COPY EMAIL TO CLIPBOARD WITH INTERACTIVE FEEDBACK
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-action');
  const tooltipText = document.getElementById('copy-tooltip-text');
  const emailToCopy = 'reetsharma2609@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      copyBtn.classList.add('copied');
      if (tooltipText) tooltipText.textContent = 'Raven Address Sealed & Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (tooltipText) tooltipText.textContent = 'Copy to Scroll';
      }, 2400);
    } catch (err) {
      // Fallback
      if (tooltipText) tooltipText.textContent = 'Copied: ' + emailToCopy;
    }
  });
}

/* ==========================================================================
   4. INTERACTIVE RAVEN DISPATCH MODAL
   ========================================================================== */
function initRavenModal() {
  const openBtn = document.getElementById('quick-raven-btn');
  const modal = document.getElementById('raven-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const cancelBtn = document.getElementById('cancel-modal-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = document.getElementById('sender-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close when clicking on backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function handleRavenSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('sender-name').value.trim();
  const house = document.getElementById('sender-house').value.trim();
  const subject = document.getElementById('raven-subject').value.trim();
  const message = document.getElementById('raven-message').value.trim();

  const formattedSubject = encodeURIComponent(`Raven from ${name}${house ? ' (' + house + ')' : ''}: ${subject}`);
  const formattedBody = encodeURIComponent(
    `Greetings Reet Sharma,\n\nI dispatch this raven to connect with you regarding:\n\n"${message}"\n\n— Sealed by ${name}${house ? ', of ' + house : ''}`
  );

  const mailtoUrl = `mailto:reetsharma2609@gmail.com?subject=${formattedSubject}&body=${formattedBody}`;

  // Close modal
  const modal = document.getElementById('raven-modal');
  if (modal) modal.classList.remove('open');

  // Trigger default email client
  window.location.href = mailtoUrl;
}

window.handleRavenSubmit = handleRavenSubmit;

/* ==========================================================================
   5. PROCEDURAL MEDIEVAL LUTE AMBIENCE (Zero External Assets, 100% Web Audio)
   ========================================================================== */
let audioCtx = null;
let soundActive = false;
let ambientInterval = null;

function initProceduralAudio() {
  const soundBtn = document.getElementById('sound-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundActive = !soundActive;
    soundBtn.classList.toggle('primary', soundActive);

    const label = soundBtn.querySelector('.sound-label');
    if (label) {
      label.textContent = soundActive ? 'Melody Playing' : 'Lute Melody';
    }

    if (soundActive) {
      playMedievalChime(currentRealm);
      // Gentle recurring lute pluck every 14 seconds
      ambientInterval = setInterval(() => {
        if (soundActive) playMedievalChime(currentRealm);
      }, 14000);
    } else {
      if (ambientInterval) clearInterval(ambientInterval);
    }
  });
}

// Generates warm medieval lute chords procedurally using synthesized harmonics
function playMedievalChime(realm) {
  if (!audioCtx || audioCtx.state !== 'running') return;

  // Medieval modes: Dorian / Aeolian chords
  let freqs = [220, 261.63, 329.63, 440]; // A minor / Winterfell cold
  if (realm === 'citadel') {
    freqs = [246.94, 293.66, 369.99, 440]; // B minor 7 / warm scholarly
  } else if (realm === 'braavos') {
    freqs = [196.00, 246.94, 293.66, 392.00]; // G major / open sea
  }

  freqs.forEach((freq, idx) => {
    setTimeout(() => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Triangle wave replicates gentle lute / acoustic harp string
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Soft envelope
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 3.0);
    }, idx * 160);
  });
}

/* ==========================================================================
   6. REALM TIME (MEDIEVAL CALENDAR STYLING)
   ========================================================================== */
function initRealmTime() {
  const timeElem = document.getElementById('current-realm-time');
  if (!timeElem) return;

  const now = new Date();
  const months = [
    'Deep Wolf Moon', 'Frost Thaw', 'The Awakening', 'Blossom Tide',
    'High Sun', 'Golden Harvest', 'Autumn Equinox', 'Rust Leaf',
    'First Frost', 'The Long Night', 'Maester\'s Vigil', 'The Turn'
  ];

  const realmMonth = months[now.getMonth()] || 'Autumn Harvest';
  timeElem.textContent = `Epoch 2026 • ${realmMonth} • The Known World`;
}
