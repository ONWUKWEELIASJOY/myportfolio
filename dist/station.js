(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = (cb, opts) => new IntersectionObserver(cb, opts);

  /* Reveal: stagger siblings so the eye reads heading → copy → visual */
  const groups = new Map();
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    el.style.setProperty('--d', Math.min(i, 5) * 0.09 + 's');
    groups.set(p, i + 1);
  });
  const revealer = io(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));

  /* Hero monogram: measure the T outline so the stroke draws exactly once */
  const mark = document.querySelector('.st-hero-mark');
  if (mark) {
    const t = mark.querySelector('.st-t');
    try { t.style.setProperty('--len', Math.ceil(t.getTotalLength())); } catch (_) {}
    requestAnimationFrame(() => setTimeout(() => mark.classList.add('is-built'), 250));
  }

  /* Before / after: sweep once from "before" to "after" the first time it's seen */
  document.querySelectorAll('[data-compare]').forEach(box => {
    const stage = box.querySelector('.st-compare-stage');
    const range = box.querySelector('input');
    const set = v => { stage.style.setProperty('--pos', v + '%'); range.value = v; };
    let touched = false;
    range.addEventListener('input', () => { touched = true; set(range.value); });
    if (reduce) return set(50);
    set(100);
    const o = io(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      o.disconnect();
      const start = performance.now(), dur = 1800;
      const step = now => {
        if (touched) return;
        const k = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - k, 3);
        // travel all the way to show the refined mark, then settle in the middle to invite a drag
        const v = k < 1 ? 100 - ease * 100 : 0;
        set(v);
        if (k < 1) requestAnimationFrame(step);
        else setTimeout(() => !touched && animateTo(0, 50, 700), 500);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.55 });
    o.observe(stage);
    function animateTo(a, b, dur) {
      const s = performance.now();
      const f = now => {
        if (touched) return;
        const k = Math.min(1, (now - s) / dur), e = 1 - Math.pow(1 - k, 3);
        set(a + (b - a) * e);
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }
  });

  /* Carousels: arrows, dots, keyboard, and the slide-role list follows along */
  document.querySelectorAll('[data-carousel]').forEach(track => {
    const phone = track.closest('.st-phone');
    const slides = [...track.children];
    const dots = [...phone.querySelectorAll('.st-dots i')];
    const prev = phone.querySelector('[data-prev]'), next = phone.querySelector('[data-next]');
    const roles = [...phone.parentElement.querySelectorAll('[data-slide-role]')];
    let idx = 0;
    const go = i => {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: track.clientWidth * i, behavior: reduce ? 'auto' : 'smooth' });
    };
    const sync = () => {
      idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      roles.forEach((r, i) => r.classList.toggle('is-active', i === idx));
      prev.disabled = idx === 0; next.disabled = idx === slides.length - 1;
    };
    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));
    roles.forEach((r, i) => { r.style.cursor = 'pointer'; r.addEventListener('click', () => go(i)); });
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    });
    let raf; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    sync();
    // a single nudge the first time it appears, to show it swipes
    if (!reduce) {
      const o = io(es => es.forEach(e => {
        if (!e.isIntersecting) return; o.disconnect();
        setTimeout(() => { if (track.scrollLeft > 2) return; track.style.scrollSnapType = 'none'; track.scrollTo({ left: 64, behavior: 'smooth' }); setTimeout(() => { track.scrollTo({ left: 0, behavior: 'smooth' }); setTimeout(() => track.style.scrollSnapType = '', 500); }, 450); }, 700);
      }), { threshold: 0.7 });
      o.observe(track);
    }
  });

  /* Panorama: vertical scroll pans the six-slide strip, cut lines appear midway */
  const pan = document.querySelector('[data-pan]');
  if (pan && !reduce) {
    const strip = pan.querySelector('.st-pan-strip');
    const prog = pan.querySelector('.st-pan-progress span');
    const desktop = matchMedia('(min-width: 901px)');
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!desktop.matches) { strip.style.removeProperty('--pan'); return; }
      const r = pan.getBoundingClientRect();
      const total = pan.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const travel = strip.offsetWidth - innerWidth + 144;
      strip.style.setProperty('--pan', -(Math.max(0, travel) * p) + 'px');
      strip.style.setProperty('--cuts', p > 0.25 && p < 0.8 ? 0.85 : 0);
      prog.style.setProperty('--p', p);
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* Cover post: a gentle tilt toward the pointer, so it feels like a printed object */
  const tilt = document.querySelector('[data-tilt]');
  if (tilt && !reduce && matchMedia('(hover: hover)').matches) {
    tilt.addEventListener('pointermove', e => {
      const r = tilt.getBoundingClientRect();
      tilt.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 8 + 'deg');
      tilt.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 8 + 'deg');
    });
    tilt.addEventListener('pointerleave', () => { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); });
  }

  /* Motion post: only plays while on screen (saves data on mobile) */
  const video = document.querySelector('video[data-autoplay]');
  const toggle = document.querySelector('[data-video-toggle]');
  if (video) {
    let userPaused = reduce;
    const label = () => { toggle.textContent = video.paused ? 'Play video' : 'Pause video'; toggle.setAttribute('aria-pressed', String(video.paused)); };
    video.addEventListener('play', label); video.addEventListener('pause', label);
    toggle.addEventListener('click', () => { userPaused = !video.paused; userPaused ? video.pause() : video.play(); });
    io(es => es.forEach(e => {
      if (e.isIntersecting && !userPaused) { video.preload = 'auto'; video.play().catch(() => {}); }
      else if (!e.isIntersecting) video.pause();
    }), { threshold: 0.4 }).observe(video);
    label();
  }
})();
