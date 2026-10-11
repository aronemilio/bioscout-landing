/**
 * video.js - Controles del Video Embebido en la Cascada
 * Manejo de reproducción, silenciamiento, pantalla completa y sincronización de UI.
 */

const mainVideo = document.getElementById('cascade-main-video');

function toggleVideoPlayback() {
  if (!mainVideo) return;
  const playIcon = document.getElementById('video-play-icon');
  const playText = document.getElementById('video-play-text');
  
  if (mainVideo.paused) {
    mainVideo.play();
    if (playText) playText.innerText = 'Pausar';
    if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
  } else {
    mainVideo.pause();
    if (playText) playText.innerText = 'Reproducir';
    if (playIcon) playIcon.setAttribute('data-lucide', 'play');
  }
  if (window.lucide) lucide.createIcons();
}

function toggleMuteVideo() {
  if (!mainVideo) return;
  mainVideo.muted = !mainVideo.muted;
  const muteText = document.getElementById('video-mute-text');
  const muteIcon = document.getElementById('video-mute-icon');
  if (muteText) muteText.innerText = mainVideo.muted ? 'Sonido' : 'Silenciar';
  if (muteIcon) muteIcon.setAttribute('data-lucide', mainVideo.muted ? 'volume-2' : 'volume-x');
  if (window.lucide) lucide.createIcons();
}

function fullscreenVideo() {
  if (!mainVideo) return;
  if (mainVideo.requestFullscreen) mainVideo.requestFullscreen();
  else if (mainVideo.webkitRequestFullscreen) mainVideo.webkitRequestFullscreen();
}
