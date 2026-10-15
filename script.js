/**
 * BIRTHDAY TULIPS - ROMANTIC INTERACTIVE THEME
 * Single Page Application Controller, Audio Engine & Canvas Confetti
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE & DOM ELEMENTS
  // =========================================================================
  const screens = document.querySelectorAll('.screen');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  const bouquetImg = document.getElementById('bouquet-img');
  const confettiCanvas = document.getElementById('confetti-canvas');
  
  // Spotify card elements
  const spotifyCardToggle = document.getElementById('spotify-card-toggle');
  const spBtnIcon = document.getElementById('sp-btn-icon');
  const trackProgress = document.getElementById('track-progress');

  let currentScreenId = 'screen-1';
  let isMusicPlaying = false;
  let audioContext = null;
  let synthInterval = null;
  let confettiAnimationId = null;
  let confettiParticles = [];

  // =========================================================================
  // 2. ARTISTIC SVG FALLBACKS FOR MISSING IMAGES
  // =========================================================================
  const SVG_FALLBACKS = {
    'gift-box': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="gBox" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f48fb1"/><stop offset="100%" stop-color="%23d81b60"/></linearGradient><linearGradient id="gRib" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23ffe082"/><stop offset="100%" stop-color="%23ffca28"/></linearGradient><filter id="sh"><feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="%234a0e2e" flood-opacity="0.45"/></filter></defs><g filter="url(%23sh)"><rect x="50" y="110" width="200" height="150" rx="16" fill="url(%23gBox)"/><rect x="35" y="80" width="230" height="38" rx="10" fill="%23f06292"/><rect x="135" y="80" width="30" height="180" fill="url(%23gRib)"/><rect x="50" y="165" width="200" height="28" fill="url(%23gRib)"/><path d="M150 80 C120 20 80 40 120 78 Z" fill="%23ffd54f"/><path d="M150 80 C180 20 220 40 180 78 Z" fill="%23ffca28"/><circle cx="150" cy="80" r="14" fill="%23ffb300"/><circle cx="90" cy="140" r="4" fill="%23fff" opacity="0.6"/><circle cx="210" cy="210" r="5" fill="%23fff" opacity="0.6"/></g></svg>`,
    
    'single-tulip': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><defs><linearGradient id="gPetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ff80ab"/><stop offset="100%" stop-color="%23c2185b"/></linearGradient><linearGradient id="gStem" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2381c784"/><stop offset="100%" stop-color="%23388e3c"/></linearGradient></defs><path d="M100 130 Q105 180 100 230" stroke="url(%23gStem)" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M100 180 Q140 160 130 140 Q110 160 100 180" fill="%2366bb6a"/><path d="M100 195 Q60 180 70 155 Q90 175 100 195" fill="%2381c784"/><path d="M100 40 C70 40 60 90 100 135 C140 90 130 40 100 40 Z" fill="url(%23gPetal)"/><path d="M80 55 C65 75 75 110 100 135 C85 105 75 80 80 55 Z" fill="%23f06292" opacity="0.9"/><path d="M120 55 C135 75 125 110 100 135 C115 105 125 80 120 55 Z" fill="%23ad1457" opacity="0.85"/></svg>`,

    'cake': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="cakeBot" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23f8bbd0"/><stop offset="100%" stop-color="%23ec407a"/></linearGradient><linearGradient id="cakeTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ffffff"/><stop offset="100%" stop-color="%23fce4ec"/></linearGradient></defs><rect x="40" y="250" width="220" height="14" rx="7" fill="%23e0e0e0"/><rect x="60" y="170" width="180" height="80" rx="14" fill="url(%23cakeBot)"/><path d="M60 185 Q75 200 90 185 Q105 200 120 185 Q135 200 150 185 Q165 200 180 185 Q195 200 210 185 Q225 200 240 185 L240 170 L60 170 Z" fill="%23ffffff"/><rect x="85" y="105" width="130" height="65" rx="12" fill="url(%23cakeTop)"/><path d="M85 120 Q98 132 111 120 Q124 132 137 120 Q150 132 163 120 Q176 132 189 120 Q202 132 215 120 L215 105 L85 105 Z" fill="%23f48fb1"/><rect x="146" y="70" width="8" height="35" rx="3" fill="%23ffd54f"/><path d="M150 50 Q160 62 150 70 Q140 62 150 50 Z" fill="%23ff7043"/><circle cx="150" cy="62" r="3" fill="%23ffeb3b"/><text x="105" y="65" font-size="20">💖</text><text x="180" y="65" font-size="20">💖</text></svg>`,

    'envelope': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220"><defs><linearGradient id="gEnv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fce4ec"/><stop offset="100%" stop-color="%23f8bbd0"/></linearGradient></defs><rect x="20" y="40" width="240" height="150" rx="14" fill="url(%23gEnv)" stroke="%23ec407a" stroke-width="2"/><path d="M20 40 L140 130 L260 40" fill="none" stroke="%23f06292" stroke-width="3"/><path d="M20 190 L105 110" fill="none" stroke="%23f48fb1" stroke-width="2"/><path d="M260 190 L175 110" fill="none" stroke="%23f48fb1" stroke-width="2"/><circle cx="140" cy="125" r="18" fill="%23ad1457"/><text x="133" y="131" font-size="14" fill="%23fff" font-family="sans-serif">♡</text><rect x="134" y="40" width="12" height="150" fill="%23e91e63" opacity="0.45"/></svg>`,

    'bouquet': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480"><defs><linearGradient id="kraft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23d7ccc8"/><stop offset="100%" stop-color="%23a1887f"/></linearGradient></defs><path d="M130 260 L200 460 L270 260 Z" fill="url(%23kraft)"/><path d="M120 250 Q200 290 280 250 L270 260 L130 260 Z" fill="%238d6e63"/><circle cx="170" cy="300" r="14" fill="%23f06292"/><circle cx="200" cy="300" r="16" fill="%23e91e63"/><circle cx="230" cy="300" r="14" fill="%23f06292"/><circle cx="140" cy="180" r="38" fill="%23ec407a"/><circle cx="200" cy="150" r="44" fill="%23f06292"/><circle cx="260" cy="180" r="38" fill="%23f48fb1"/><circle cx="165" cy="225" r="34" fill="%23ffd54f"/><circle cx="235" cy="225" r="34" fill="%23ffb74d"/><circle cx="200" cy="210" r="32" fill="%23e91e63"/><path d="M125 150 Q140 110 155 150 Z" fill="%23d81b60"/><path d="M185 120 Q200 75 215 120 Z" fill="%23c2185b"/><path d="M245 150 Q260 110 275 150 Z" fill="%23d81b60"/><circle cx="165" cy="225" r="10" fill="%23ff9800"/><circle cx="235" cy="225" r="10" fill="%23f57c00"/><text x="186" y="306" font-size="18" fill="%23fff">🎀</text></svg>`,

    'img1': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ff9a9e"/><stop offset="100%" stop-color="%23fecfef"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p1)"/><circle cx="100" cy="85" r="36" fill="%23fff" opacity="0.85"/><path d="M50 170 C50 130 80 120 100 120 C120 120 150 130 150 170 Z" fill="%23fff" opacity="0.85"/><text x="86" y="188" font-size="20">🌷</text></svg>`,

    'img2': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23a18cd1"/><stop offset="100%" stop-color="%23fbc2eb"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p2)"/><circle cx="85" cy="90" r="28" fill="%23fff" opacity="0.85"/><circle cx="120" cy="85" r="28" fill="%23fff" opacity="0.85"/><path d="M45 170 C45 135 70 125 85 125 C100 125 110 135 110 170 Z" fill="%23fff" opacity="0.85"/><path d="M100 170 C100 135 115 125 125 125 C145 125 165 135 165 170 Z" fill="%23fff" opacity="0.85"/><text x="90" y="55" font-size="20">✨</text></svg>`,

    'img3': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffecd2"/><stop offset="100%" stop-color="%23fcb69f"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p3)"/><circle cx="100" cy="95" r="42" fill="%23fff" opacity="0.9"/><text x="82" y="105" font-size="34">🌸</text><text x="92" y="165" font-size="22">♡</text></svg>`,

    'img4': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fad0c4"/><stop offset="100%" stop-color="%23ffd1ff"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p4)"/><circle cx="100" cy="100" r="50" fill="%23fff" opacity="0.8"/><text x="80" y="112" font-size="36">🌅</text><text x="86" y="170" font-size="18">✧</text></svg>`,

    'img5': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ff9a9e"/><stop offset="100%" stop-color="%23fecfef"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p5)"/><circle cx="100" cy="100" r="48" fill="%23fff" opacity="0.85"/><text x="82" y="110" font-size="34">☕</text><text x="88" y="165" font-size="20">💕</text></svg>`,

    'img6': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="p6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fbc2eb"/><stop offset="100%" stop-color="%23a6c1ee"/></linearGradient></defs><rect width="200" height="200" fill="url(%23p6)"/><circle cx="100" cy="100" r="48" fill="%23fff" opacity="0.85"/><text x="80" y="112" font-size="36">💖</text><text x="88" y="165" font-size="20">✨</text></svg>`
  };

  // Wire automatic image fallback handler
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      const key = this.getAttribute('data-fallback');
      if (key && SVG_FALLBACKS[key]) {
        this.src = SVG_FALLBACKS[key];
      }
    });
  });

  // =========================================================================
  // =========================================================================
  // 3. BACKGROUND MUSIC ENGINE & CONTROLS
  // =========================================================================
  let musicHasStarted = false;
  let userPaused = false;
  let isPlayPending = false;

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
  }

  // Romantic harmonic synthesizer fallback if song.mp3 is unavailable or silent
  function startChimeSynth() {
    if (synthInterval || userPaused) return;
    initAudioContext();
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];
    let chordIdx = 0;
    let noteIdx = 0;

    synthInterval = setInterval(() => {
      if (userPaused || !isMusicPlaying) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];

      playGentleTone(freq, 1.2);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 450);
  }

  function stopChimeSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend().catch(() => {});
    }
  }

  function playGentleTone(freq, duration) {
    if (!audioContext || audioContext.state !== 'running' || userPaused) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Ignore synthesis errors
    }
  }

  function playMusic() {
    userPaused = false;
    isMusicPlaying = true;
    setMusicUIState(true);

    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    isPlayPending = true;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlayPending = false;
          // If user clicked pause while play was in progress
          if (userPaused) {
            bgMusic.pause();
            setMusicUIState(false);
          }
        })
        .catch((err) => {
          isPlayPending = false;
          // If aborted by user pause or if user already paused, do NOT fallback to synth!
          if (userPaused || (err && err.name === 'AbortError')) {
            setMusicUIState(false);
            return;
          }
          // Genuine audio playback error (e.g. file missing / unsupported format)
          if (!userPaused) {
            startChimeSynth();
          }
        });
    }
  }

  function pauseMusic() {
    userPaused = true;
    isMusicPlaying = false;
    setMusicUIState(false);

    try {
      bgMusic.pause();
    } catch (e) {}

    stopChimeSynth();
  }

  function toggleMusic(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isPlaying = isMusicPlaying || (!bgMusic.paused && bgMusic.currentTime > 0) || (synthInterval !== null);

    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function setMusicUIState(playing) {
    isMusicPlaying = playing;
    if (playing) {
      if (musicIcon) {
        musicIcon.classList.remove('paused');
        musicIcon.classList.add('playing');
      }
      if (musicLabel) musicLabel.textContent = 'Pause ♫';
      if (spBtnIcon) spBtnIcon.textContent = '⏸';
    } else {
      if (musicIcon) {
        musicIcon.classList.remove('playing');
        musicIcon.classList.add('paused');
      }
      if (musicLabel) musicLabel.textContent = 'Play Song ♫';
      if (spBtnIcon) spBtnIcon.textContent = '▶';
    }
  }

  // Sync with audio element events
  bgMusic.addEventListener('play', () => {
    if (!userPaused) {
      setMusicUIState(true);
    }
  });

  bgMusic.addEventListener('pause', () => {
    if (synthInterval === null) {
      setMusicUIState(false);
    }
  });

  // Update Spotify card progress bar
  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration && trackProgress) {
      const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
      trackProgress.style.width = `${pct}%`;
    }
  });

  // Music toggle button clicks
  if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
  }

  // Spotify player card and play button clicks
  const spotifyCard = document.getElementById('spotify-player-card');
  if (spotifyCard) {
    spotifyCard.addEventListener('click', toggleMusic);
  }

  // Start background audio on the first user click ("Continue" on Screen 1)
  const btnStart = document.getElementById('btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (!musicHasStarted && !userPaused) {
        musicHasStarted = true;
        playMusic();
      }
    });
  }

  // =========================================================================
  // 4. SCREEN NAVIGATION ROUTER (SPA)
  // =========================================================================
  function showScreen(targetScreenId) {
    const currentScreen = document.getElementById(currentScreenId);
    const targetScreen = document.getElementById(targetScreenId);

    if (!targetScreen || targetScreenId === currentScreenId) return;

    // 0. Reset scroll position immediately on click
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 1. Fade out current screen
    if (currentScreen) {
      currentScreen.classList.add('fading-out');
      currentScreen.classList.remove('active');
    }

    // 2. Adjust theme/background for Screen 4
    if (targetScreenId === 'screen-4') {
      document.body.classList.add('screen-4-active');
      startContinuousConfetti();

      // Trigger the 2.5-second unblur animation for bouquet
      if (bouquetImg) {
        bouquetImg.classList.remove('unblurred');
        // Force reflow
        void bouquetImg.offsetWidth;
        setTimeout(() => {
          bouquetImg.classList.add('unblurred');
        }, 150);
      }
    } else {
      document.body.classList.remove('screen-4-active');
      stopContinuousConfetti();

      // Reset bouquet if leaving screen 4 so it unblurs on next visit
      if (bouquetImg) {
        bouquetImg.classList.remove('unblurred');
      }
    }

    // Prepare target screen for smooth fade-in
    targetScreen.style.display = 'flex';
    void targetScreen.offsetWidth; // Force layout

    // 3. Activate target screen after smooth transition delay
    setTimeout(() => {
      if (currentScreen) {
        currentScreen.classList.remove('fading-out');
      }
      targetScreen.style.display = '';
      targetScreen.classList.add('active');
      currentScreenId = targetScreenId;

      // Always reset scroll to top of window and container
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (targetScreen) targetScreen.scrollTop = 0;

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }, 280);
  }

  // Attach event listeners for all navigation buttons
  document.querySelectorAll('[data-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      if (target) {
        showScreen(target);
      }
    });

    // Keyboard accessibility for cards and buttons
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        if (target) {
          showScreen(target);
        }
      }
    });
  });

  // Gift Box interactive click (Screen 2 -> Screen 3)
  const giftTrigger = document.getElementById('gift-box-trigger');
  if (giftTrigger) {
    const triggerGiftOpen = () => {
      fireBurstConfetti();
      showScreen('screen-3');
    };

    giftTrigger.addEventListener('click', triggerGiftOpen);
    giftTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerGiftOpen();
      }
    });
  }

  // =========================================================================
  // 5. CANVAS CONFETTI & FLOWER PETALS ENGINE
  // =========================================================================
  const ctx = confettiCanvas.getContext('2d');
  let canvasWidth = (confettiCanvas.width = window.innerWidth);
  let canvasHeight = (confettiCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    canvasWidth = confettiCanvas.width = window.innerWidth;
    canvasHeight = confettiCanvas.height = window.innerHeight;
  });

  const CONFETTI_COLORS = [
    '#f48fb1', '#ec407a', '#ff4081', '#fce4ec',
    '#ffd54f', '#ffb74d', '#ffffff', '#ba68c8'
  ];

  class ConfettiParticle {
    constructor(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * canvasWidth;
      this.y = y !== undefined ? y : -20;
      this.isBurst = isBurst;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 3;
        this.gravity = 0.22;
        this.friction = 0.96;
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      } else {
        this.vx = (Math.random() - 0.5) * 2.2;
        this.vy = Math.random() * 2.5 + 1.2;
        this.gravity = 0.02;
        this.friction = 0.995;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.decay = 0;
      }

      this.size = Math.random() * 9 + 6;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 6;
      // 0: Petal/Oval, 1: Star/Diamond, 2: Heart
      this.shape = Math.floor(Math.random() * 3);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= this.friction;
      this.rotation += this.rotationSpeed;

      if (this.isBurst) {
        this.opacity -= this.decay;
      } else if (this.y > canvasHeight + 20) {
        this.y = -20;
        this.x = Math.random() * canvasWidth;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2.5 + 1.2;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.shape === 0) {
        // Tulip Petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.6, this.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 1) {
        // Star diamond
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.7, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Little Heart
        ctx.beginPath();
        const s = this.size * 0.6;
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.6, 0, s * 1.2);
        ctx.bezierCurveTo(s * 1.2, s * 0.6, s, -s * 0.5, 0, s * 0.3);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function loopConfetti() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();

      if (p.isBurst && p.opacity <= 0) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0 || currentScreenId === 'screen-4') {
      confettiAnimationId = requestAnimationFrame(loopConfetti);
    } else {
      confettiAnimationId = null;
    }
  }

  function startContinuousConfetti() {
    // Populate gentle continuous flower confetti
    if (confettiParticles.filter(p => !p.isBurst).length < 50) {
      for (let i = 0; i < 50; i++) {
        const p = new ConfettiParticle(Math.random() * canvasWidth, Math.random() * canvasHeight);
        confettiParticles.push(p);
      }
    }
    if (!confettiAnimationId) {
      loopConfetti();
    }
  }

  function stopContinuousConfetti() {
    confettiParticles = confettiParticles.filter(p => p.isBurst);
  }

  function fireBurstConfetti() {
    const burstX = canvasWidth / 2;
    const burstY = canvasHeight / 2;
    for (let i = 0; i < 90; i++) {
      confettiParticles.push(new ConfettiParticle(burstX, burstY, true));
    }
    if (!confettiAnimationId) {
      loopConfetti();
    }
  }
});
