document.addEventListener("DOMContentLoaded", function () {
  console.log("Sitio de Cajon cargado correctamente");

  // Efecto de cambio de header al hacer scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "linear-gradient(to right, #fff 80%, #f8f9fa 20%)";
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
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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
      const title = card?.querySelector(".post-title")?.textContent || "Dashboard Cajon";
      
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
    if (e.target === modal || e.target.classList.contains('modal-container')) {
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
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      // Simular tiempo de envío
      setTimeout(() => {
        alert("✅ ¡Mensaje enviado con éxito!\n\nTe contactaremos dentro de las próximas 24 horas.");
        
        contactForm.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Efecto visual
        submitBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
          submitBtn.style.transform = 'scale(1)';
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
});