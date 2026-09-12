/* ==========================================================================
   JM-Wedding-Invite — Dual Theme, Personalization, Calendar Export & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Theme Switcher System (Midnight Gold / Ivory Marble)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;

  // Retrieve saved theme or default to "midnight-gold"
  const savedTheme = localStorage.getItem('wedding_theme') || 'midnight-gold';
  body.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'midnight-gold' ? 'ivory-marble' : 'midnight-gold';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('wedding_theme', newTheme);

    if (!scratchedThresholdMet && scratchCanvas && scratchCardWrapper) {
      const rect = scratchCardWrapper.getBoundingClientRect();
      drawFoilLayer(rect.width, rect.height);
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  /* ------------------------------------------------------------------------
     1.5. Scratch to Reveal Teaser Card Interaction
     ------------------------------------------------------------------------ */
  const scratchOverlay = document.getElementById('scratchOverlay');
  const scratchCardWrapper = document.getElementById('scratchCardWrapper');
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  let scratchCtx = null;
  let isScratching = false;
  let scratchedThresholdMet = false;
  let lastPos = { x: 0, y: 0 };
  let brushRadius = 30;

  function initScratchCanvas() {
    if (!scratchCanvas || !scratchCardWrapper) return;

    scratchCtx = scratchCanvas.getContext('2d');
    const rect = scratchCardWrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    scratchCanvas.width = rect.width * dpr;
    scratchCanvas.height = rect.height * dpr;
    scratchCtx.scale(dpr, dpr);

    brushRadius = rect.width < 350 ? 25 : 32;

    drawFoilLayer(rect.width, rect.height);
  }

  function drawFoilLayer(w, h) {
    if (!scratchCtx) return;

    const isIvory = body.getAttribute('data-theme') === 'ivory-marble';

    // Base Metallic Gold Foil Gradient
    const goldGrad = scratchCtx.createLinearGradient(0, 0, w, h);
    if (isIvory) {
      goldGrad.addColorStop(0, '#f9ecd0');
      goldGrad.addColorStop(0.35, '#d4af57');
      goldGrad.addColorStop(0.7, '#aa8736');
      goldGrad.addColorStop(1, '#7a5d1f');
    } else {
      goldGrad.addColorStop(0, '#fcf4dd');
      goldGrad.addColorStop(0.3, '#e8c874');
      goldGrad.addColorStop(0.65, '#c9a24b');
      goldGrad.addColorStop(1, '#8c6721');
    }

    scratchCtx.save();
    scratchCtx.globalCompositeOperation = 'source-over';
    scratchCtx.fillStyle = goldGrad;
    scratchCtx.fillRect(0, 0, w, h);

    // Subtle brushed metallic & glitter texture pattern
    const particleCount = Math.floor((w * h) / 120);
    for (let i = 0; i < particleCount; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      const pSize = Math.random() * 2 + 0.5;
      const isLight = Math.random() > 0.4;
      scratchCtx.fillStyle = isLight 
        ? `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})` 
        : `rgba(100, 70, 20, ${Math.random() * 0.25 + 0.05})`;
      scratchCtx.fillRect(px, py, pSize, pSize);
    }

    // Inner dashed border on foil
    scratchCtx.strokeStyle = isIvory ? 'rgba(122, 93, 31, 0.4)' : 'rgba(255, 240, 190, 0.45)';
    scratchCtx.lineWidth = 1.5;
    scratchCtx.setLineDash([6, 6]);
    scratchCtx.strokeRect(12, 12, w - 24, h - 24);
    scratchCtx.setLineDash([]);

    // Centered foil title text
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.font = '600 13px "Cinzel", serif';
    scratchCtx.fillStyle = isIvory ? '#402e0c' : '#261b05';
    scratchCtx.fillText('✦  SCRATCH TO REVEAL  ✦', w / 2, h / 2 - 15);

    scratchCtx.font = 'italic 13px "Libre Baskerville", serif';
    scratchCtx.fillStyle = isIvory ? '#594116' : '#47330d';
    scratchCtx.fillText('Drag across to unlock the date', w / 2, h / 2 + 15);

    scratchCtx.restore();
  }

  function getPointerPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratchAlongPath(start, end) {
    if (!scratchCtx || scratchedThresholdMet) return;

    scratchCtx.save();
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.lineWidth = brushRadius * 2;
    scratchCtx.lineCap = 'round';
    scratchCtx.lineJoin = 'round';

    scratchCtx.beginPath();
    scratchCtx.moveTo(start.x, start.y);
    scratchCtx.lineTo(end.x, end.y);
    scratchCtx.stroke();

    // Soft outer brush edge
    scratchCtx.beginPath();
    scratchCtx.arc(end.x, end.y, brushRadius, 0, Math.PI * 2);
    scratchCtx.fill();

    scratchCtx.restore();
  }

  function startScratch(e) {
    if (scratchedThresholdMet) return;
    isScratching = true;
    if (scratchHint) scratchHint.classList.add('hidden');
    lastPos = getPointerPos(e);
    scratchAlongPath(lastPos, lastPos);
  }

  function moveScratch(e) {
    if (!isScratching || scratchedThresholdMet) return;
    if (e.cancelable) e.preventDefault(); // Prevent touch scrolling
    const currentPos = getPointerPos(e);
    scratchAlongPath(lastPos, currentPos);
    lastPos = currentPos;

    // Check percentage during active drag
    checkScratchPercentage();
  }

  function endScratch() {
    if (!isScratching) return;
    isScratching = false;
    checkScratchPercentage();
  }

  function checkScratchPercentage() {
    if (scratchedThresholdMet || !scratchCtx) return;

    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    if (w === 0 || h === 0) return;

    const imageData = scratchCtx.getImageData(0, 0, w, h);
    const pixels = imageData.data;
    let clearedCount = 0;
    const stride = 32; // downsampled for performance
    const totalSampled = pixels.length / stride;

    for (let i = 3; i < pixels.length; i += stride) {
      if (pixels[i] < 128) {
        clearedCount++;
      }
    }

    const percentage = (clearedCount / totalSampled) * 100;

    if (percentage >= 50) {
      triggerScratchReveal();
    }
  }

  function triggerScratchReveal() {
    if (scratchedThresholdMet) return;
    scratchedThresholdMet = true;

    if (scratchCanvas) scratchCanvas.classList.add('fade-out');
    if (scratchHint) scratchHint.classList.add('hidden');
  }

  if (scratchCanvas) {
    // Pointer, Mouse, and Touch Listeners
    scratchCanvas.addEventListener('pointerdown', startScratch);
    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });

    window.addEventListener('pointermove', moveScratch, { passive: false });
    window.addEventListener('mousemove', moveScratch, { passive: false });
    window.addEventListener('touchmove', moveScratch, { passive: false });

    window.addEventListener('pointerup', endScratch);
    window.addEventListener('mouseup', endScratch);
    window.addEventListener('touchend', endScratch);

    initScratchCanvas();
    window.addEventListener('resize', () => {
      if (!scratchedThresholdMet) initScratchCanvas();
    });
  }

  /* ------------------------------------------------------------------------
     2. Personalized Guest Link Query Parameter (?to=Name)
     ------------------------------------------------------------------------ */
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');

  const guestGreetingBadge = document.getElementById('guestGreetingBadge');
  const guestNameText = document.getElementById('guestNameText');

  if (guestName && guestName.trim() !== '') {
    const decodedName = decodeURIComponent(guestName.trim());
    if (guestNameText) guestNameText.innerText = decodedName;
    if (guestGreetingBadge) guestGreetingBadge.style.display = 'inline-flex';
  }

  /* ------------------------------------------------------------------------
     3. Envelope Opening & Wax Seal Trigger (Full Target Hitbox & Scroll Reset)
     ------------------------------------------------------------------------ */
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeWrapper = document.querySelector('.envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSealBtn = document.getElementById('waxSealBtn');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.removeAttribute('aria-hidden');
    }

    // Reset scroll position to top of page (Hero Section) with 'auto' for max compatibility
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (envelope) envelope.classList.add('open');
    playEnvelopeChimeSound();

    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
        setTimeout(() => {
          envelopeOverlay.style.display = 'none';
          envelopeOverlay.setAttribute('aria-hidden', 'true');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }, 800);
      }
    }, 800);
  }

  // Unified Envelope Tap Listeners
  const envelopeElements = [envelopeOverlay, envelopeWrapper, envelope, waxSealBtn];
  envelopeElements.forEach(el => {
    if (el) {
      el.addEventListener('click', openEnvelope);
      el.addEventListener('touchstart', openEnvelope, { passive: true });
    }
  });

  /* ------------------------------------------------------------------------
     4. Tap-The-Monogram Easter Egg
     ------------------------------------------------------------------------ */
  const monograms = document.querySelectorAll('.interactive-monogram');
  monograms.forEach((m) => {
    m.addEventListener('click', (e) => {
      if (!envelopeOpened) {
        openEnvelope();
      }
      playEnvelopeChimeSound();
      m.classList.add('pop-anim');
      setTimeout(() => m.classList.remove('pop-anim'), 600);
    });
  });

  /* ------------------------------------------------------------------------
     6. Web Share API & Link Copy Fallback
     ------------------------------------------------------------------------ */
  const shareInviteBtn = document.getElementById('shareInviteBtn');
  const toastNotification = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.innerText = message;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3000);
  }

  if (shareInviteBtn) {
    shareInviteBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Noor-E-Chashme & Mohammed Jasim — Wedding Invitation',
        text: 'Together with family Vallur Parvez Ahmed Sahib, cordially invites you to the Nikah & Valima of Noor-E-Chashme and Mohammed Jasim.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Share dismissed:', err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('🔗 Invitation link copied to clipboard!');
        } catch (err) {
          showToast('Copied link: ' + window.location.href);
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Live Countdown Timer (15 Oct 2026, 12:30 PM IST)
     ------------------------------------------------------------------------ */
  const targetDate = new Date('2026-10-15T12:30:00+05:30').getTime();
  const timerGrid = document.getElementById('timerGrid');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (timerGrid) {
        timerGrid.innerHTML = '<div class="celebration-expired-badge">Today is the day! 🌙</div>';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------------
     8. Scroll Reveal Animations (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     9. Gold Bokeh Particles Canvas Animation
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('bokehCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  if (canvas && ctx) {
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width > 600 ? 55 : 30, 60);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.5 + 0.8;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        grad.addColorStop(0, `rgba(252, 244, 221, ${this.alpha})`);
        grad.addColorStop(0.5, `rgba(232, 200, 116, ${this.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(201, 162, 75, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateBokeh() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateBokeh);
    }
    animateBokeh();
  }

  /* ------------------------------------------------------------------------
     10. Ambient Music & Audio Synthesizer Fallback
     ------------------------------------------------------------------------ */
  const audioToggle = document.getElementById('audioToggle');
  let audioContext = null;
  let synthInterval = null;
  let isPlaying = false;

  function playEnvelopeChimeSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.8);
      });
    } catch (e) {}
  }

  function startAmbientMusic() {
    if (isPlaying) return;
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') audioContext.resume();

      const scale = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33];
      let step = 0;

      synthInterval = setInterval(() => {
        if (!isPlaying || !audioContext) return;
        const freq = scale[step % scale.length];
        step = (step + Math.floor(Math.random() * 2 + 1)) % scale.length;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);

        gain.gain.setValueAtTime(0.03, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 2.5);
      }, 1600);

      isPlaying = true;
      if (audioToggle) audioToggle.classList.add('playing');
    } catch (err) {}
  }

  function stopAmbientMusic() {
    isPlaying = false;
    if (synthInterval) clearInterval(synthInterval);
    if (audioToggle) audioToggle.classList.remove('playing');
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (isPlaying) stopAmbientMusic();
      else startAmbientMusic();
    });
  }

});
