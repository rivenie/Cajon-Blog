document.addEventListener("DOMContentLoaded", () => {
  /* HEADER SCROLL */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* MODAL IMÁGENES */
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const closeBtn = modal?.querySelector(".close");

  const extractBg = (style) => {
    const m = style.match(/url\(["']?(.*?)["']?\)/);
    return m ? m[1] : "";
  };

  const openModal = (url, caption) => {
    if (!modal || !url) return;
    modal.style.display = "flex";
    requestAnimationFrame(() => modal.classList.add("show"));
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalImg.src = url;
    modalCaption.textContent = caption || "Dashboard DataVista";
    closeBtn?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  };

  document.querySelectorAll(".post-image").forEach((el) => {
    el.addEventListener("click", () => {
      const url = el.dataset.image || extractBg(el.style.backgroundImage);
      const title = el.closest(".post-card")?.querySelector(".post-title")?.textContent;
      openModal(url, title);
    });
  });

  document.querySelectorAll(".view-image").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = el.closest(".post-card");
      const img = card?.querySelector(".post-image");
      if (!img) return;
      const url = img.dataset.image || extractBg(img.style.backgroundImage);
      openModal(url, card.querySelector(".post-title")?.textContent);
    });
  });

  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-container")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("show")) closeModal();
  });

  /* CARRUSEL DASHBOARDS */
  const carousel = document.getElementById("dashboardsCarousel");
  const cards = carousel ? Array.from(carousel.querySelectorAll(".post-card")) : [];
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (carousel && cards.length && prevBtn && nextBtn) {
    let currentIndex = 0;

    const perView = () => {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    const cardWidth = () => {
      const s = getComputedStyle(cards[0]);
      return cards[0].offsetWidth + (parseFloat(s.marginLeft) || 0) + (parseFloat(s.marginRight) || 0);
    };

    const total = () => Math.max(1, cards.length - perView() + 1);

    const renderDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (let i = 0; i < total(); i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" + (i === currentIndex ? " active" : "");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const goTo = (index) => {
      const max = total() - 1;
      if (index < 0) index = max;
      if (index > max) index = 0;
      currentIndex = index;
      carousel.style.transform = `translateX(${-currentIndex * cardWidth()}px)`;
      dotsContainer?.querySelectorAll(".dot").forEach((d, i) => {
        d.classList.toggle("active", i === currentIndex);
      });
    };

    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

    renderDots();
    goTo(0);

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        currentIndex = 0;
        renderDots();
        goTo(0);
      }, 250);
    });
  }

  /* CARRUSEL LOGOS — duplicar para loop infinito */
  const logosTrack = document.getElementById("logosTrack");
  if (logosTrack) {
    const items = Array.from(logosTrack.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      logosTrack.appendChild(clone);
    });
  }

  /* WHATSAPP */
  const whatsapp = document.getElementById("whatsappFloat");
  if (whatsapp) {
    const toggle = () => whatsapp.classList.toggle("active", window.scrollY > 300);
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* VIDEOS */
  const videoCards = document.querySelectorAll(".video-card");

  const pauseOthers = (current) => {
    videoCards.forEach((card) => {
      if (card === current) return;
      const v = card.querySelector(".video-player");
      if (v && !v.paused) v.pause();
    });
  };

  videoCards.forEach((card) => {
    const wrapper = card.querySelector(".video-wrapper");
    const video = card.querySelector(".video-player");
    const playBtn = card.querySelector(".video-play-btn");
    if (!video || !playBtn || !wrapper) return;

    const toggleVideo = () => {
      if (video.paused) {
        pauseOthers(card);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideo();
    });

    wrapper.addEventListener("click", (e) => {
      if (e.target.closest(".view-fullscreen-btn")) return;
      if (e.target.closest(".video-play-btn")) return;
      toggleVideo();
    });

    video.addEventListener("play", () => card.classList.add("playing"));
    video.addEventListener("pause", () => card.classList.remove("playing"));
    video.addEventListener("ended", () => {
      card.classList.remove("playing");
      video.currentTime = 0;
    });
  });

  /* MODAL VIDEO */
  if (!document.querySelector(".video-modal")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="video-modal" id="videoModal" role="dialog" aria-modal="true">
        <div class="video-modal-content">
          <span class="close-video-modal" role="button" tabindex="0" aria-label="Cerrar">&times;</span>
          <video controls id="modalVideo" playsinline></video>
        </div>
      </div>`
    );
  }

  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeVideoBtn = document.querySelector(".close-video-modal");
  let originalVideo = null;
  let wasPlaying = false;

  const openVideoModal = (videoEl) => {
    originalVideo = videoEl;
    wasPlaying = !videoEl.paused;
    if (wasPlaying) videoEl.pause();

    const source = videoEl.querySelector("source");
    const src = source ? source.src : videoEl.src;
    if (!src) return;

    modalVideo.src = src;
    modalVideo.poster = videoEl.poster || "";
    modalVideo.currentTime = videoEl.currentTime || 0;
    videoModal.classList.add("show");
    document.body.style.overflow = "hidden";

    if (wasPlaying) {
      setTimeout(() => modalVideo.play().catch(() => {}), 100);
    }
  };

  const closeVideoModal = () => {
    const time = modalVideo.currentTime;
    const wasModalPlaying = !modalVideo.paused;
    modalVideo.pause();
    videoModal.classList.remove("show");
    modalVideo.removeAttribute("src");
    modalVideo.load();
    document.body.style.overflow = "";

    if (originalVideo) {
      originalVideo.currentTime = time;
      if (wasModalPlaying && originalVideo.paused) {
        originalVideo.play().catch(() => {});
      }
      originalVideo = null;
    }
  };

  videoCards.forEach((card) => {
    if (card.querySelector(".view-fullscreen-btn")) return;
    const wrapper = card.querySelector(".video-wrapper");
    if (!wrapper) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "view-fullscreen-btn";
    btn.setAttribute("aria-label", "Ver en pantalla completa");
    btn.innerHTML = '<i class="fas fa-expand"></i>';
    wrapper.appendChild(btn);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const video = card.querySelector(".video-player");
      if (video) openVideoModal(video);
    });
  });

  closeVideoBtn?.addEventListener("click", closeVideoModal);

  videoModal?.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal?.classList.contains("show")) closeVideoModal();
  });

  modalVideo?.addEventListener("click", (e) => e.stopPropagation());

  /* HERO SLIDESHOW */
  const heroLayers = document.querySelectorAll(".hero-layer");
  if (heroLayers.length > 1) {
    let idx = 0;
    setInterval(() => {
      heroLayers[idx].classList.remove("active");
      idx = (idx + 1) % heroLayers.length;
      heroLayers[idx].classList.add("active");
    }, 5000);
  }
});