/**
 * Reproductor Musical de Wonderland
 * Reproduce el tema oficial "Alices-Theme.mp3" alojado en assets/audio/
 * Compatible con políticas de reproducción automática y despliegues en Vercel.
 */

class WonderlandAudioPlayer {
  constructor() {
    this.audioElement = document.getElementById('bg-music');
    this.floatingBtn = document.getElementById('floating-audio');
    this.audioLabel = document.querySelector('.audio-label');
    this.isPlaying = false;
    this.userInteracted = false;

    this.init();
  }

  init() {
    if (!this.audioElement) return;

    // Asegurar volumen agradable
    this.audioElement.volume = 0.75;

    // Eventos de estado del elemento de audio
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.floatingBtn) this.floatingBtn.classList.remove('paused');
      if (this.audioLabel) this.audioLabel.textContent = 'Música';
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.floatingBtn) this.floatingBtn.classList.add('paused');
      if (this.audioLabel) this.audioLabel.textContent = 'Pausado';
    });

    this.audioElement.addEventListener('ended', () => {
      // Repetir en bucle continuo
      this.audioElement.currentTime = 0;
      this.audioElement.play().catch(() => {});
    });

    // Botón flotante para pausar / reanudar
    if (this.floatingBtn) {
      this.floatingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.userInteracted = true;
        this.toggle();
      });
    }

    // Desbloqueo universal en la primera interacción del usuario (tap/click/scroll)
    const unlockEvents = ['click', 'touchstart', 'touchend', 'keydown'];
    const unlockHandler = () => {
      this.userInteracted = true;
      if (!this.isPlaying) {
        this.play().catch(() => {});
      }
      unlockEvents.forEach(evt => window.removeEventListener(evt, unlockHandler));
    };

    unlockEvents.forEach(evt => window.addEventListener(evt, unlockHandler, { once: true }));
  }

  async play() {
    if (!this.audioElement) return;
    try {
      await this.audioElement.play();
      this.isPlaying = true;
      if (this.floatingBtn) this.floatingBtn.classList.remove('paused');
      if (this.audioLabel) this.audioLabel.textContent = 'Música';
    } catch (err) {
      // Bloqueado por política de autoplay hasta el clic del usuario
      this.isPlaying = false;
      if (this.floatingBtn) this.floatingBtn.classList.add('paused');
      if (this.audioLabel) this.audioLabel.textContent = 'Pausado';
    }
  }

  pause() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.isPlaying = false;
    if (this.floatingBtn) this.floatingBtn.classList.add('paused');
    if (this.audioLabel) this.audioLabel.textContent = 'Pausado';
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

// Inicializar reproductor de audio al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  window.wonderlandAudio = new WonderlandAudioPlayer();
});
