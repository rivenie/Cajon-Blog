document.addEventListener("DOMContentLoaded", function () {
  console.log("Sitio de Cajon cargado correctamente");

  // Efecto de cambio de header al hacer scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background =
        "linear-gradient(to right, #fff 80%, #f8f9fa 20%)";
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
    }
  });

  // Smooth scrolling para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== FUNCIONALIDAD DEL MODAL DE IMÁGENES =====
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const closeBtn = document.querySelector(".close");

  // Función para extraer la URL de la imagen del background
  function extractBackgroundUrl(backgroundStyle) {
    const match = backgroundStyle.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : "";
  }

  // Función para abrir el modal
  function openModal(imageUrl, captionText) {
    if (!imageUrl) return;

    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    document.body.style.overflow = "hidden";
    modalImg.src = imageUrl;
    modalCaption.textContent = captionText || "Dashboard Cajon";
  }

  // Función para cerrar el modal
  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  }

  // Agregar evento a todas las imágenes del carrusel
  document.querySelectorAll(".post-image").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let imageUrl = this.getAttribute("data-image");
      if (!imageUrl) {
        imageUrl = extractBackgroundUrl(this.style.backgroundImage);
      }

      const card = this.closest(".post-card");
      const title =
        card?.querySelector(".post-title")?.textContent || "Dashboard Cajon";

      openModal(imageUrl, title);
    });
  });

  // Agregar evento a todos los botones "Ver imagen"
  document.querySelectorAll(".view-image").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const card = this.closest(".post-card");
      const imageElement = card.querySelector(".post-image");

      let imageUrl = imageElement.getAttribute("data-image");
      if (!imageUrl) {
        imageUrl = extractBackgroundUrl(imageElement.style.backgroundImage);
      }

      const title = card.querySelector(".post-title").textContent;
      openModal(imageUrl, title);
    });
  });

  // Cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Cerrar modal al hacer clic fuera de la imagen
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.classList.contains("modal-container")) {
      closeModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // ===== FUNCIONALIDAD DEL CARRUSEL =====
  const carousel = document.querySelector(".carousel");
  const cards = document.querySelectorAll(".post-card");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (carousel && cards.length > 0 && prevBtn && nextBtn) {
    let currentIndex = 0;

    // Determinar cuántas tarjetas mostrar según el ancho de la pantalla
    const cardsPerView = () => {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    // Calcular el ancho de cada tarjeta
    const getCardWidth = () => {
      const firstCard = cards[0];
      const cardStyle = window.getComputedStyle(firstCard);
      const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
      const marginRight = parseFloat(cardStyle.marginRight) || 0;
      return firstCard.offsetWidth + marginLeft + marginRight;
    };

    // Crear dots para el carrusel
    function createDots() {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = "";
      const totalSlides = Math.ceil(cards.length / cardsPerView());

      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === currentIndex) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    // Función para mover el carrusel
    function goToSlide(index) {
      const totalSlides = Math.ceil(cards.length / cardsPerView());
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentIndex = index;
      const cardWidth = getCardWidth();
      const cardsToShow = cardsPerView();
      const translateX = -currentIndex * (cardWidth * cardsToShow);

      carousel.style.transform = `translateX(${translateX}px)`;

      // Actualizar dots activos
      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    // Event listeners para los controles
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Inicializar carrusel
    createDots();
    goToSlide(0);

    // Ajustar carrusel en redimensionamiento
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createDots();
        goToSlide(currentIndex);
      }, 250);
    });
  }

  // ===== FORMULARIO DE CONTACTO =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Efecto de "enviando"
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      // Simular tiempo de envío
      setTimeout(() => {
        alert(
          "✅ ¡Mensaje enviado con éxito!\n\nTe contactaremos dentro de las próximas 24 horas.",
        );

        contactForm.reset();

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";

        // Efecto visual
        submitBtn.style.transform = "scale(1.05)";
        setTimeout(() => {
          submitBtn.style.transform = "scale(1)";
        }, 300);
      }, 2000);
    });
  }

  // Control de aparición del WhatsApp al hacer scroll
  const whatsappBtn = document.getElementById("whatsappFloat");
  if (whatsappBtn) {
    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 300) {
        whatsappBtn.classList.add("active");
      } else {
        whatsappBtn.classList.remove("active");
      }
    });
  }

  // ===== VIDEO GALLERY FUNCTIONALITY =====
const videoCards = document.querySelectorAll(".video-card");

// Función para manejar la reproducción de videos
function setupVideoControls() {
  videoCards.forEach((card) => {
    const wrapper = card.querySelector(".video-wrapper");
    const video = card.querySelector(".video-player");
    const playBtn = card.querySelector(".video-play-btn");

    if (!video || !playBtn) return;

    // Asegurar que los controles nativos estén deshabilitados
    video.controls = false;

    // Hacer que el video no sea clickeable directamente
    video.style.pointerEvents = "none";

    // Reproducir/Pausar al hacer clic en el botón
    playBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      toggleVideo(video);
    });

    // También permitir clic en el wrapper
    wrapper.addEventListener("click", function (e) {
      // Si el clic no fue en el botón de expandir
      if (
        !e.target.closest(".view-fullscreen-btn") &&
        !e.target.closest(".video-play-btn")
      ) {
        toggleVideo(video);
      }
    });

    // Eventos del video
    video.addEventListener("play", function () {
      card.classList.add("playing");

      // Pausar otros videos
      videoCards.forEach((otherCard) => {
        if (otherCard !== card) {
          const otherVideo = otherCard.querySelector(".video-player");
          if (otherVideo && !otherVideo.paused) {
            otherVideo.pause();
          }
        }
      });
    });

    video.addEventListener("pause", function () {
      card.classList.remove("playing");
    });

    video.addEventListener("ended", function () {
      card.classList.remove("playing");
      video.currentTime = 0;
    });
    
    // Almacenar el tiempo actual para restaurarlo después
    video.addEventListener("timeupdate", function () {
      this._currentTime = this.currentTime;
    });
  });
}

function toggleVideo(video) {
  if (video.paused) {
    video.play().catch((e) => console.log("Error al reproducir:", e));
  } else {
    video.pause();
  }
}

// ===== MODAL PARA VIDEOS =====
function setupVideoModal() {
  // Crear modal si no existe
  if (!document.querySelector(".video-modal")) {
    const modalHTML = `
      <div class="video-modal" id="videoModal">
        <div class="video-modal-content">
          <span class="close-video-modal">&times;</span>
          <video controls id="modalVideo"></video>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeModal = document.querySelector(".close-video-modal");

  if (!videoModal || !modalVideo) return;

  // Variable para almacenar el video original que se está mostrando en el modal
  let originalVideo = null;
  
  // Variable para controlar si el video original estaba reproduciéndose
  let wasVideoPlaying = false;

  // Función para abrir modal
  function openVideoModal(videoElement) {
    // Guardar referencia al video original
    originalVideo = videoElement;
    
    // Verificar si el video original está reproduciéndose
    wasVideoPlaying = !videoElement.paused;
    
    // Si estaba reproduciéndose, pausarlo para evitar doble audio
    if (wasVideoPlaying) {
      videoElement.pause();
    }

    // Obtener la fuente del video
    const source = videoElement.querySelector("source");
    const videoSrc = source ? source.src : videoElement.src;
    const posterSrc = videoElement.poster;
    const currentTime = videoElement.currentTime;

    if (!videoSrc) return;

    // Configurar modal
    modalVideo.src = videoSrc;
    modalVideo.poster = posterSrc;
    modalVideo.currentTime = currentTime;
    videoModal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Reproducir en modal si el original estaba reproduciéndose
    if (wasVideoPlaying) {
      // Pequeño retraso para asegurar que el modal esté listo
      setTimeout(() => {
        modalVideo.play().catch((e) => console.log("Error al reproducir modal:", e));
      }, 100);
    }
  }

  // Función para cerrar modal
  function closeVideoModal() {
    const currentTime = modalVideo.currentTime;
    const wasModalPlaying = !modalVideo.paused;

    // Pausar el video del modal
    modalVideo.pause();
    
    videoModal.classList.remove("show");
    modalVideo.src = "";
    document.body.style.overflow = "";

    // Restaurar el tiempo en el video original si existe
    if (originalVideo) {
      originalVideo.currentTime = currentTime;
      
      // Si el modal estaba reproduciéndose y el original no está en pausa,
      // restaurar la reproducción en el video original
      if (wasModalPlaying && originalVideo.paused) {
        originalVideo.play().catch((e) => console.log("Error al reanudar video:", e));
      }
      
      // Limpiar la referencia
      originalVideo = null;
    }
  }

  // Agregar botón de expandir a cada tarjeta
  videoCards.forEach((card) => {
    if (!card.querySelector(".view-fullscreen-btn")) {
      const viewBtn = document.createElement("button");
      viewBtn.className = "view-fullscreen-btn";
      viewBtn.innerHTML = '<i class="fas fa-expand"></i>';
      viewBtn.setAttribute("aria-label", "Ver pantalla completa");

      const wrapper = card.querySelector(".video-wrapper");
      if (wrapper) {
        wrapper.appendChild(viewBtn);

        viewBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          const video = card.querySelector(".video-player");
          if (video) {
            openVideoModal(video);
          }
        });
      }
    }
  });

  // Event listeners del modal
  if (closeModal) {
    closeModal.addEventListener("click", closeVideoModal);
  }

  videoModal.addEventListener("click", function (e) {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal.classList.contains("show")) {
      closeVideoModal();
    }
  });

  modalVideo.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupVideoControls();
    setupVideoModal();
  });
} else {
  setupVideoControls();
  setupVideoModal();
}

// ===== HERO BACKGROUND SLIDESHOW =====
// ===== HERO BACKGROUND SLIDESHOW CON TRANSICIÓN SUAVE =====
function setupHeroSlideshow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Crear contenedor para las capas de imágenes
  const slideshowContainer = document.createElement('div');
  slideshowContainer.className = 'hero-slideshow';
  slideshowContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  `;
  
  // Insertar el contenedor al inicio del hero
  hero.insertBefore(slideshowContainer, hero.firstChild);
  
  const images = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80',    
    
  ];
  
  // Crear capas para cada imagen
  const layers = images.map((src, index) => {
    const layer = document.createElement('div');
    layer.className = `hero-layer ${index === 0 ? 'active' : ''}`;
    layer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${src}');
      background-size: cover;
      background-position: center;
      opacity: ${index === 0 ? 1 : 0};
      transition: opacity 1.5s ease-in-out;
      z-index: ${images.length - index};
    `;
    slideshowContainer.appendChild(layer);
    return layer;
  });
  
  // Añadir overlay oscuro
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 100%);
    z-index: ${images.length + 1};
    pointer-events: none;
  `;
  slideshowContainer.appendChild(overlay);
  
  let currentIndex = 0;
  
  function changeHeroImage() {
    const nextIndex = (currentIndex + 1) % images.length;
    
    // Capa actual se desvanece
    layers[currentIndex].style.opacity = '0';
    // Siguiente capa aparece
    layers[nextIndex].style.opacity = '1';
    
    currentIndex = nextIndex;
  }
  
  // Cambiar cada 5 segundos
  setInterval(changeHeroImage, 5000);
}

// Modifica tu inicialización existente
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupVideoControls();
    setupVideoModal();
    setupHeroSlideshow();
  });
} else {
  setupVideoControls();
  setupVideoModal();
  setupHeroSlideshow();
}
});
