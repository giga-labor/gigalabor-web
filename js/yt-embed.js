/**
 * yt-embed.js - Riproduttore YouTube "a richiesta".
 * Ogni <a class="yt-embed" data-yt-id="ID" href="https://www.youtube.com/watch?v=ID">
 * resta un normale link (funziona anche senza JavaScript). Al clic viene
 * sostituito da un iframe youtube-nocookie.com: prima del clic il sito non
 * contatta YouTube.
 */
(function () {
  'use strict';

  function load(el) {
    var id = el.getAttribute('data-yt-id');
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    frame.title = el.getAttribute('data-yt-title') || 'YouTube';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    var box = document.createElement('div');
    box.className = el.className;
    box.setAttribute('data-yt-id', id);
    box.style.cursor = 'auto';
    box.appendChild(frame);
    el.replaceWith(box);
    frame.focus();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('a.yt-embed[data-yt-id]') : null;
    if (!el || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    e.preventDefault();
    load(el);
  });
})();
