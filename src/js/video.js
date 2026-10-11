/**
 * video.js - Modal Táctico para Reproducción de Pitch de Video
 * Control de apertura, cierre, autoplay, teclado ESC y pantalla completa.
 */

function openPitchModal() {
  const modal = document.getElementById('pitch-modal');
  const video = document.getElementById('pitch-modal-video');
  if (modal) {
    modal.classList.remove('hidden');
    if (video) {
      video.play().catch(() => {
        console.log('Autoplay bloqueado por el navegador, requiriendo clic del usuario.');
      });
    }
  }
}

function closePitchModal() {
  const modal = document.getElementById('pitch-modal');
  const video = document.getElementById('pitch-modal-video');
  if (modal) {
    modal.classList.add('hidden');
    if (video) {
      video.pause();
    }
  }
}

// Escuchar tecla Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePitchModal();
  }
});

// Cerrar al hacer clic en el backdrop exterior
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pitch-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePitchModal();
      }
    });
  }
});

// Exportar globalmente
window.openPitchModal = openPitchModal;
window.closePitchModal = closePitchModal;
