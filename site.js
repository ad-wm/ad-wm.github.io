'use strict';
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const filters = [...gallery.querySelectorAll('[data-filter]')];
  const cards = [...gallery.querySelectorAll('[data-category]')];
  const more = gallery.querySelector('.gallery-more');
  let selected = 'all';
  let limit = Number(gallery.dataset.limit);
  const update = () => {
    const matches = cards.filter(card => selected === 'all' || card.dataset.category === selected);
    const shown = new Set(matches.slice(0, limit));
    cards.forEach(card => {
      card.hidden = !shown.has(card);
      if (card.hidden) card.querySelector('video').pause();
    });
    gallery.querySelector('.gallery-count').textContent = `Showing ${shown.size} of ${matches.length} clips`;
    more.hidden = shown.size === matches.length;
    more.textContent = `Show all ${matches.length} clips`;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.filter;
    limit = Number(gallery.dataset.limit);
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
  }));
  more.addEventListener('click', () => { limit = Infinity; update(); });
  update();
});
// Keep playback deliberate and avoid multiple simultaneous videos.
const videos = [...document.querySelectorAll('video')];
videos.forEach(video => video.addEventListener('play', () => {
  videos.forEach(other => { if (other !== video) other.pause(); });
}));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach(video => video.pause());
});
