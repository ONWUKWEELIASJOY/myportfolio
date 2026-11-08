(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal with a short stagger inside each parent */
  const groups = new Map();
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const p = el.parentElement, i = groups.get(p) || 0;
    el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's'); groups.set(p, i + 1);
  });
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => rv.observe(el));

  /* Tech Val deck: the posters say "Swipe Right", so the page lets you */
  const posters = [
    ['intro', 'Who\'s your Tech Val?', 'Intro'],
    ['trendsetter', 'The Trendsetter', 'Mobile App Dev'],
    ['protective', 'The Protective One', 'Cybersecurity'],
    ['genius', 'The Genius', 'AI & ML'],
    ['romantic', 'The Creative Romantic', 'UI/UX Design'],
    ['builder', 'The Builder', 'Full Stack'],
    ['silent', 'The Silent Power', 'Cloud Computing'],
    ['strategist', 'The Strategist', 'Business Analysis'],
    ['leader', 'The Leader', 'Project Management'],
    ['creator', 'The Content Creator', 'AI Creation'],
    ['found', 'Found your Tech Val?', 'Call to action']
  ];
  const deck = document.querySelector('[data-deck]');
  if (deck) {
    const chipsBox = document.querySelector('.gx-chips');
    const back = document.querySelector('[data-back]'), swipe = document.querySelector('[data-swipe]');
    const nowEl = document.querySelector('[data-now]');
    document.querySelector('[data-total]').textContent = posters.length;
    const cards = posters.map(([slug, name], i) => {
      const c = document.createElement('div');
      c.className = 'gx-card';
      c.innerHTML = `<img src="assets/techval-${slug}.webp" alt="${name} poster from the Find Your Tech Val campaign" width="720" height="1019" ${i > 2 ? 'loading="lazy"' : ''}><span class="gx-stamp" aria-hidden="true">MATCH</span>`;
      c.setAttribute('aria-hidden', i ? 'true' : 'false');
      deck.appendChild(c); return c;
    });
    const chips = posters.map(([, name, track], i) => {
      if (i === 0 || i === posters.length - 1) return null;
      const b = document.createElement('button');
      b.className = 'gx-chip'; b.setAttribute('role', 'listitem');
      b.innerHTML = `${name.replace('The ', '')}<small>${track}</small>`;
      b.addEventListener('click', () => go(i));
      chipsBox.appendChild(b); return b;
    });
    let idx = 0;
    const render = () => {
      cards.forEach((c, i) => {
        c.classList.toggle('is-out', i < idx);
        const d = i - idx;
        c.dataset.depth = d < 0 ? 'out' : d <= 2 ? String(d) : 'hidden';
        c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        c.style.transform = ''; c.style.setProperty('--stamp', 0);
      });
      chips.forEach((b, i) => b && b.setAttribute('aria-current', i === idx ? 'true' : 'false'));
      nowEl.textContent = idx + 1;
      back.disabled = idx === 0;
      swipe.textContent = idx === posters.length - 1 ? '↻ Start again' : '♥ Swipe right';
    };
    const go = i => { idx = (i + posters.length) % posters.length; render(); };
    swipe.addEventListener('click', () => go(idx === posters.length - 1 ? 0 : idx + 1));
    back.addEventListener('click', () => go(idx - 1));
    deck.tabIndex = 0;
    deck.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); swipe.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (idx) go(idx - 1); }
    });
    /* Drag: past a threshold the card flies off right; a "MATCH" stamp fades in as you drag */
    let startX = 0, dx = 0, active = null;
    deck.addEventListener('pointerdown', e => {
      active = cards[idx]; if (!active) return;
      startX = e.clientX; dx = 0; active.classList.add('is-dragging'); deck.setPointerCapture(e.pointerId);
    });
    deck.addEventListener('pointermove', e => {
      if (!active) return;
      dx = e.clientX - startX;
      active.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      active.style.setProperty('--stamp', Math.max(0, Math.min(1, dx / 120)));
    });
    const end = () => {
      if (!active) return;
      active.classList.remove('is-dragging');
      const c = active; active = null;
      if (dx > 90) go(idx === posters.length - 1 ? 0 : idx + 1);
      else if (dx < -90 && idx) go(idx - 1);
      else { c.style.transform = ''; c.style.setProperty('--stamp', 0); }
    };
    deck.addEventListener('pointerup', end); deck.addEventListener('pointercancel', end);
    render();

    /* Fan: the whole series opens out like a hand of cards when it scrolls in */
    const fan = document.querySelector('[data-fan]');
    const n = posters.length;
    posters.forEach(([slug], i) => {
      const im = document.createElement('img');
      im.src = `assets/techval-${slug}.webp`; im.alt = ''; im.loading = 'lazy'; im.width = 720; im.height = 1019;
      const r = (i - (n - 1) / 2) * 5;
      im.style.setProperty('--r', r + 'deg'); im.style.setProperty('--i', i); im.style.zIndex = i;
      fan.appendChild(im);
    });
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { fan.classList.add('is-in'); o.disconnect(); } }), { threshold: 0.4 }).observe(fan);
  }

  /* Don't Quit → DO IT: reveal once the wall is properly in view */
  const dq = document.querySelector('[data-dontquit]');
  if (dq) {
    const reveal = () => dq.classList.add('is-revealed');
    if (reduce) reveal();
    else new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { setTimeout(reveal, 900); o.disconnect(); } }), { threshold: 0.6 }).observe(dq.querySelector('.gx-wall-frame'));
    dq.querySelector('[data-replay]').addEventListener('click', () => {
      dq.classList.remove('is-revealed'); setTimeout(reveal, reduce ? 0 : 1100);
    });
  }

  /* Gentle parallax on the large wall, like walking past it */
  const px = document.querySelector('[data-parallax]');
  if (px && !reduce) {
    const img = px.querySelector('img'); let t = false;
    const upd = () => { t = false; const r = px.getBoundingClientRect(); const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; img.style.setProperty('--py', (p * -30).toFixed(1) + 'px'); };
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  }
})();
