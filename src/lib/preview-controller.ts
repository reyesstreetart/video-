/**
 * Garantit qu'une seule preview vidéo est en lecture à la fois sur la page.
 */
let current: HTMLVideoElement | null = null;

export function playPreview(video: HTMLVideoElement) {
  if (current && current !== video) {
    stopPreview(current);
  }
  current = video;
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

export function stopPreview(video: HTMLVideoElement) {
  try {
    video.pause();
    video.currentTime = 0;
  } catch {
    /* ignore */
  }
  if (current === video) current = null;
}

export function releasePreview(video: HTMLVideoElement) {
  stopPreview(video);
  // Libère le média hors zone active.
  if (video.getAttribute("data-loaded") === "true") {
    video.removeAttribute("src");
    while (video.firstChild) video.removeChild(video.firstChild);
    video.load();
    video.setAttribute("data-loaded", "false");
  }
}

export function isCurrentPreview(video: HTMLVideoElement) {
  return current === video;
}
