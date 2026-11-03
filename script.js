(() => {
  const track = document.getElementById('slidesTrack');
  const windowEl = document.getElementById('sliderWindow');
  const dots = [...document.querySelectorAll('.dot')];
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const count = document.getElementById('slideCount');
  const progress = document.getElementById('progressFill');
  const song = document.getElementById('song');
  const soundbar = document.getElementById('soundbar');
  const musicToggle = document.getElementById('musicToggle');
  const musicStatus = document.getElementById('musicStatus');
  const video = document.getElementById('proposalVideo');
  const total = dots.length;
  let current = 0;
  let startX = 0;
  let startY = 0;
  let musicStarted = false;

  function goTo(index) {
    current = Math.max(0, Math.min(total - 1, index));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    progress.style.width = `${((current + 1) / total) * 100}%`;
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
    next.style.opacity = current === total - 1 ? '.25' : '1';
    if (current !== 1 && !video.paused) video.pause();
  }
  function startMusic() {
    song.play().then(() => {
      musicStarted = true;
      soundbar.classList.add('playing');
      musicToggle.setAttribute('aria-label', 'Pause soundtrack');
      musicStatus.textContent = 'Now playing · Kashif’s song for you';
    }).catch(() => {
      musicStatus.textContent = 'Tap the record to play our song';
    });
  }
  function stopMusic() {
    song.pause();
    soundbar.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Play soundtrack');
    musicStatus.textContent = 'A melody, just for this moment';
  }
  function toggleMusic() {
    if (song.paused) startMusic(); else stopMusic();
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.slide))));
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => goTo(current + 1)));
  document.getElementById('startBtn').addEventListener('click', () => {
    startMusic();
    goTo(1);
  });
  musicToggle.addEventListener('click', toggleMusic);
  video.addEventListener('play', () => { if (!song.paused) stopMusic(); });

  // Mobile swipe navigation. A vertical gesture is left to the page controls.
  windowEl.addEventListener('touchstart', event => {
    if (!event.touches.length) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });
  windowEl.addEventListener('touchend', event => {
    if (!event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // The playful No button escapes before it can be pressed.
  const arena = document.getElementById('choiceArena');
  const noBtn = document.getElementById('noBtn');
  const hint = document.getElementById('runawayHint');
  let dodges = 0;
  const funnyLines = [
    'Arre! Itni jaldi bhi kya hai? 🥺',
    'No button ne chhutti le li hai! 🏃‍♂️💨',
    'Kashif: bas ek chance? Pretty please? 🌷',
    'Aap idhar… button udhar! 😂',
    'Lagta hai “No” ko bhi sharam aa rahi hai 🙈',
    'Dil ki baat sun lo… ek baar! 💗',
    'Button pakadna mushkil hi nahi… impossible hai! 😭'
  ];
  function dodge(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    dodges++;
    const maxX = Math.max(0, arena.clientWidth - noBtn.offsetWidth - 9);
    const maxY = Math.max(0, arena.clientHeight - noBtn.offsetHeight - 8);
    const x = 5 + Math.random() * Math.max(0, maxX - 5);
    const y = 5 + Math.random() * Math.max(0, maxY - 5);
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = `rotate(${Math.random() * 22 - 11}deg) scale(${.94 + Math.random() * .12})`;
    hint.textContent = funnyLines[(dodges - 1) % funnyLines.length];
  }
  noBtn.addEventListener('pointerenter', dodge);
  noBtn.addEventListener('pointerdown', dodge);
  noBtn.addEventListener('click', event => { event.preventDefault(); dodge(event); });
  noBtn.addEventListener('touchstart', dodge, { passive: false });
  noBtn.addEventListener('focus', dodge);

  // Yes opens the thank-you scene with a small heart burst.
  const success = document.getElementById('successOverlay');
  document.getElementById('yesBtn').addEventListener('click', () => {
    success.classList.remove('hidden');
    for (let i = 0; i < 34; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['♥', '♡', '✦', '✧', '💗'][i % 5];
      heart.style.cssText = `position:fixed;left:${Math.random() * 100}vw;top:${100 + Math.random() * 8}vh;color:${i % 2 ? '#f6a8c6' : '#ffe0b5'};font-size:${13 + Math.random() * 22}px;z-index:40;pointer-events:none;animation:floatHeart ${3 + Math.random() * 3}s ease-out forwards;`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 6500);
    }
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes floatHeart{to{transform:translateY(-115vh) rotate(260deg);opacity:0}}';
  document.head.appendChild(style);

  document.getElementById('shareBtn').addEventListener('click', () => {
    const page = location.protocol === 'file:' ? 'Open the proposal page after it is hosted online.' : location.href;
    const message = `💗 Dr. Nazneen Ansari, Kashif made a little story just for you. 🌷\n${page}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
  document.getElementById('replayBtn').addEventListener('click', () => {
    success.classList.add('hidden');
    goTo(0);
    if (song.paused) startMusic();
  });

  const exitOverlay = document.getElementById('exitOverlay');
  document.getElementById('exitBtn').addEventListener('click', () => exitOverlay.classList.remove('hidden'));
  document.getElementById('stayBtn').addEventListener('click', () => exitOverlay.classList.add('hidden'));
  goTo(0);
})();
