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
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
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
     3. Envelope Opening & Wax Seal Trigger
     ------------------------------------------------------------------------ */
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelope = document.getElementById('envelope');
  const waxSealBtn = document.getElementById('waxSealBtn');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    if (envelope) envelope.classList.add('open');
    playEnvelopeChimeSound();

    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
        setTimeout(() => {
          envelopeOverlay.style.display = 'none';
        }, 800);
      }
      startAmbientMusic();
    }, 800);
  }

  if (waxSealBtn) waxSealBtn.addEventListener('click', openEnvelope);
  if (envelope) envelope.addEventListener('click', openEnvelope);
  if (envelopeOverlay) envelopeOverlay.addEventListener('click', openEnvelope);

  /* ------------------------------------------------------------------------
     4. Tap-The-Monogram Easter Egg
     ------------------------------------------------------------------------ */
  const monograms = document.querySelectorAll('.interactive-monogram');
  monograms.forEach((m) => {
    m.addEventListener('click', (e) => {
      e.stopPropagation();
      playEnvelopeChimeSound();
      m.classList.add('pop-anim');
      setTimeout(() => m.classList.remove('pop-anim'), 600);
    });
  });

  /* ------------------------------------------------------------------------
     5. Add to Calendar (.ics File Generator)
     ------------------------------------------------------------------------ */
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Noor-E-Chashme & Mohammed Jasim Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Nikah & Valima — Noor-E-Chashme & Mohammed Jasim
DESCRIPTION:Together with family Vallur Parvez Ahmed Sahib, seeks your gracious presence on the occasion of the Nikah & Valima.
LOCATION:Masjid-e-Madinal Uloom & NKZ Convention Hall, Vaniyambadi - 635751
DTSTART:20261015T070000Z
DTEND:20261015T123000Z
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Reminder: Nikah Ceremony of Noor-E-Chashme & Mohammed Jasim
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Nikah_Ceremony_Noor_and_Jasim.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('📅 Calendar Event (.ics) Downloaded!');
    });
  }

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

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
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
