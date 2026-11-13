/* The Trough Bar – mobile nav toggle, photo sliders and current year in footer. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Photo sliders: swipe natively (CSS scroll-snap), click the arrows, or let it advance on its own.
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('[data-slider]'), function (slider) {
    var track = slider.querySelector('.slider__track');
    var total = slider.querySelectorAll('.slider__slide').length;
    var count = slider.querySelector('[data-count]');
    var pauseBtn = slider.querySelector('[data-pause]');
    var playing = !reduceMotion;
    var hovering = false;

    var current = function () { return Math.round(track.scrollLeft / track.clientWidth); };
    var goTo = function (i) {
      track.scrollTo({ left: ((i + total) % total) * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var setPlaying = function (on) {
      playing = on;
      pauseBtn.textContent = on ? 'Pause' : 'Play';
    };
    setPlaying(playing);

    track.addEventListener('scroll', function () { count.textContent = (current() + 1) + ' / ' + total; }, { passive: true });
    slider.querySelector('[data-prev]').addEventListener('click', function () { setPlaying(false); goTo(current() - 1); });
    slider.querySelector('[data-next]').addEventListener('click', function () { setPlaying(false); goTo(current() + 1); });
    pauseBtn.addEventListener('click', function () { setPlaying(!playing); });
    track.addEventListener('touchstart', function () { setPlaying(false); }, { passive: true });
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setPlaying(false);
        goTo(current() + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    slider.addEventListener('mouseenter', function () { hovering = true; });
    slider.addEventListener('mouseleave', function () { hovering = false; });

    setInterval(function () {
      if (playing && !hovering && !document.hidden && !slider.contains(document.activeElement)) { goTo(current() + 1); }
    }, 5000);
  });

  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
});
