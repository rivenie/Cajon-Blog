document.addEventListener("DOMContentLoaded", function () {
  console.log("Sitio de Jamber cargado correctamente");

  // Efecto de cambio de header al hacer scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.97)";
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
    } else {
      header.style.background =
        "linear-gradient(to right, #fff 80%, #f8f9fa 20%)";
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
    }
  });

  // Manejo del formulario de contacto
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("¡Gracias por contactarnos! Te responderemos pronto.");
      contactForm.reset();
    });
  }

  // Smooth scrolling para enlaces de navegación
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calcular posición considerando el header fijo
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

  // Smooth scrolling para enlaces del footer
  document.querySelectorAll('footer a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
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
  const modalContainer = document.querySelector(".modal-container");

  // Función para extraer la URL de la imagen del background
  function extractBackgroundUrl(backgroundStyle) {
    // Manejar diferentes formatos de background-image
    const match = backgroundStyle.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : "";
  }

  // Función para abrir el modal
  function openModal(imageUrl, captionText) {
    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    document.body.style.overflow = "hidden";
    modalImg.src = imageUrl;
    modalCaption.textContent = captionText;
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

      // Obtener la URL de la imagen
      let imageUrl = this.getAttribute("data-image");

      // Si no hay data-image, intentar extraerla del background
      if (!imageUrl) {
        imageUrl = extractBackgroundUrl(this.style.backgroundImage);
      }

      const captionText =
        this.closest(".post-card").querySelector(".post-title").textContent;

      if (imageUrl) {
        openModal(imageUrl, captionText);
      } else {
        console.error("No se pudo encontrar la URL de la imagen");
      }
    });
  });

  // Agregar evento a todos los botones "Ver más"
  document.querySelectorAll(".view-image").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.closest(".post-card");
      const imageElement = card.querySelector(".post-image");

      // Obtener la URL de la imagen
      let imageUrl = imageElement.getAttribute("data-image");

      // Si no hay data-image, intentar extraerla del background
      if (!imageUrl) {
        imageUrl = extractBackgroundUrl(imageElement.style.backgroundImage);
      }

      const captionText = card.querySelector(".post-title").textContent;

      if (imageUrl) {
        openModal(imageUrl, captionText);
      } else {
        console.error("No se pudo encontrar la URL de la imagen");
      }
    });
  });

  // Cerrar modal
  closeBtn.addEventListener("click", closeModal);

  // Cerrar modal al hacer clic fuera de la imagen
  modal.addEventListener("click", function (e) {
    // Verificar si el clic fue en el fondo del modal (no en el contenido)
    if (e.target === modal || !modalContainer.contains(e.target)) {
      closeModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  modal.addEventListener("click", function (e) {
    console.log("Clic en modal:", e.target);
    console.log("¿Es igual al modal?", e.target === modal);
    if (e.target === modal) {
      console.log("Cerrando modal...");
      closeModal();
    }
  });

  // ===== FUNCIONALIDAD DEL CARRUSEL =====
  const carousel = document.querySelector(".carousel");
  const cards = document.querySelectorAll(".post-card");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;

  // Determinar cuántas tarjetas mostrar según el ancho de la pantalla
  const cardsPerView = () => {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  // Calcular el ancho total de cada tarjeta incluyendo márgenes
  const getCardWidth = () => {
    if (cards.length === 0) return 0;
    const cardStyle = window.getComputedStyle(cards[0]);
    const width = cards[0].offsetWidth;
    const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
    const marginRight = parseFloat(cardStyle.marginRight) || 0;
    return width + marginLeft + marginRight;
  };

  // Crear dots para el carrusel
  function createDots() {
    dotsContainer.innerHTML = "";
    const totalSlides = Math.ceil(cards.length / cardsPerView());

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goToSlide(i);
      });
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
  prevBtn.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

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
});
