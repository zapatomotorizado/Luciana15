/**
 * Carrusel 3D Animado y Visor Lightbox para la Galería de 5 Fotos de Luciana
 * Soporta navegación 3D fluida, botones anterior/siguiente, puntos indicadores,
 * interacción táctil (swipe), auto-rotación inteligente y Lightbox en pantalla completa.
 */

(function () {
  const container = document.getElementById('carousel-3d-container');
  const cards = document.querySelectorAll('.carousel-3d-card');
  const btnPrev = document.getElementById('btn-prev-3d');
  const btnNext = document.getElementById('btn-next-3d');
  const dots = document.querySelectorAll('.carousel-dot');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!cards.length) return;

  const totalCards = cards.length;
  let activeIndex = 0;
  let autoPlayInterval = null;
  let isHovered = false;

  // Extraer información de fotos para el Lightbox
  const galleryData = Array.from(cards).map(card => {
    const img = card.querySelector('.carousel-3d-img');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : ''
    };
  });

  // Posiciones relativas para el efecto 3D Coverflow (5 elementos: -2, -1, 0, +1, +2)
  const positionClasses = ['pos-center', 'pos-next-1', 'pos-next-2', 'pos-prev-2', 'pos-prev-1'];

  function updateCarousel3D() {
    cards.forEach((card, idx) => {
      // Calcular distancia circular respecto al elemento activo
      const offset = (idx - activeIndex + totalCards) % totalCards;
      
      // Remover todas las clases de posición previas
      card.classList.remove('pos-center', 'pos-prev-1', 'pos-next-1', 'pos-prev-2', 'pos-next-2');
      
      // Asignar clase correspondiente según el offset
      if (offset === 0) {
        card.classList.add('pos-center');
      } else if (offset === 1) {
        card.classList.add('pos-next-1');
      } else if (offset === 2) {
        card.classList.add('pos-next-2');
      } else if (offset === totalCards - 1) {
        card.classList.add('pos-prev-1');
      } else if (offset === totalCards - 2) {
        card.classList.add('pos-prev-2');
      }
    });

    // Actualizar puntos de paginación
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToIndex(index) {
    activeIndex = (index + totalCards) % totalCards;
    updateCarousel3D();
  }

  function nextSlide() {
    goToIndex(activeIndex + 1);
  }

  function prevSlide() {
    goToIndex(activeIndex - 1);
  }

  // Eventos de botones de navegación
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      restartAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      restartAutoPlay();
    });
  }

  // Clic en los puntos indicadores
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToIndex(idx);
      restartAutoPlay();
    });
  });

  // Clic en las tarjetas 3D
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (idx === activeIndex) {
        // Si ya es la tarjeta central, abrir en Lightbox Modal
        openLightbox(idx);
      } else {
        // Si es una tarjeta lateral, rotar el carrusel hacia ella
        goToIndex(idx);
        restartAutoPlay();
      }
    });
  });

  // Auto-rotación 3D
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      if (!isHovered && (!lightboxModal || !lightboxModal.classList.contains('lightbox-active'))) {
        nextSlide();
      }
    }, 3800);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  const carouselWrapper = document.querySelector('.carousel-3d-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => { isHovered = true; });
    carouselWrapper.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Soporte para gestos táctiles (Swipe en móviles)
  let touchStartX = 0;
  let touchEndX = 0;

  if (container) {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      setTimeout(() => { isHovered = false; }, 2000);
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      restartAutoPlay();
    }
  }

  // =========================================================================
  // LIGHTBOX MODAL EN PANTALLA COMPLETA
  // =========================================================================
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightboxImage();
    if (lightboxModal) {
      lightboxModal.classList.add('lightbox-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('lightbox-active');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxImage() {
    if (galleryData[lightboxIndex] && lightboxImg) {
      lightboxImg.src = galleryData[lightboxIndex].src;
      lightboxImg.alt = galleryData[lightboxIndex].alt;
    }
  }

  function nextLightbox() {
    lightboxIndex = (lightboxIndex + 1) % galleryData.length;
    updateLightboxImage();
  }

  function prevLightbox() {
    lightboxIndex = (lightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxImage();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevLightbox();
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('lightbox-active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    } else {
      if (e.key === 'ArrowRight') { nextSlide(); restartAutoPlay(); }
      if (e.key === 'ArrowLeft') { prevSlide(); restartAutoPlay(); }
    }
  });

  // Inicializar carrusel 3D
  updateCarousel3D();
  startAutoPlay();
})();
