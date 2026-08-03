document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------
     YEAR
  --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
     HEADER: shrink on scroll
  --------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onHeaderScroll = () => {
    if (window.scrollY > 30) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });

  /* ---------------------------------------------
     MOBILE NAV TOGGLE
  --------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------
     SCROLL REVEAL (IntersectionObserver, staggered)
  --------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------
     BOOST METER: scroll progress + back to top
  --------------------------------------------- */
  const boostMeter = document.getElementById('boostMeter');
  const boostFill = document.getElementById('boostFill');
  const boostPercent = document.getElementById('boostPercent');
  const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

  const updateBoostMeter = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    boostFill.style.strokeDasharray = CIRCUMFERENCE;
    boostFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    boostPercent.textContent = Math.round(progress * 100);

    boostMeter.classList.toggle('is-visible', scrollTop > 200);
  };
  updateBoostMeter();
  window.addEventListener('scroll', updateBoostMeter, { passive: true });

  boostMeter.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------
     TESTIMONIAL SLIDER
  --------------------------------------------- */
  const slider = document.getElementById('testimonialSlider');
  const dotsWrap = document.getElementById('testimonialDots');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.testimonial'));
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      resetTimer();
    }
    function next() { goTo((current + 1) % slides.length); }
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }
    resetTimer();
  }
});