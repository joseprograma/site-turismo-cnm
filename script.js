if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// MENU MOBILE
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const header = document.getElementById("header");
const scrollProgressBar = document.getElementById("scrollProgressBar");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isActive = navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open", isActive);
    navToggle.setAttribute("aria-expanded", String(isActive));
    navToggle.setAttribute("aria-label", isActive ? "Fechar menu" : "Abrir menu");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = event.target instanceof Element && event.target.closest(".nav");
    if (clickedInsideNav || !navMenu.classList.contains("active")) return;

    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navMenu.classList.contains("active")) return;

    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
    navToggle.focus();
  });
}

// FAQ
const faqItems = document.querySelectorAll(".faq-item");

function setFaqState(item, isOpen) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!question || !answer) return;

  item.classList.toggle("active", isOpen);
  question.setAttribute("aria-expanded", String(isOpen));
  answer.hidden = !isOpen;
}

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  if (!question) return;

  question.addEventListener("click", () => {
    const willOpen = !item.classList.contains("active");

    faqItems.forEach((faq) => {
      if (faq !== item) {
        setFaqState(faq, false);
      }
    });

    setFaqState(item, willOpen);
  });
});

// BOTAO TOPO E ESTADO DO HEADER
const scrollTopBtn = document.getElementById("scrollTop");

function updateScrollUi() {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("show", window.scrollY > 300);
  }

  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }

  if (scrollProgressBar) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// REVEAL AO ROLAR
const revealElements = document.querySelectorAll(
  ".section-header, .hero-content, .hero-visual, .logo-wall-intro, .logo-pill, .destaque-card, .seo-intro-copy, .seo-point, .feature, .card, .roteiro-banner, .roteiro-card, .planejamento-card, .guia-card, .cultura-item, .aldeia-copy, .aldeia-feature, .aldeia-gallery img, .evento-card, .faq-item, .galeria-item, .info-item, .sobre-image, .sobre-text, .sobre-callout, .sao-joao-copy, .sao-joao-feature, .sao-joao-gallery img"
);

revealElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.transitionDelay = `${Math.min(index * 40, 320)}ms`;
  if (index % 3 === 1) {
    element.dataset.revealDirection = "left";
  } else if (index % 3 === 2) {
    element.dataset.revealDirection = "right";
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

// TRANSICAO ENTRE SECOES
const pageSections = document.querySelectorAll("main > section");

const sectionTransitionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("section-in-view", entry.isIntersecting);
    });
  },
  {
    threshold: 0.22,
    rootMargin: "-8% 0px -8% 0px",
  }
);

pageSections.forEach((section) => {
  section.classList.add("section-in-view");
  sectionTransitionObserver.observe(section);
});

// PARALLAX LEVE NO HERO COM MOUSE
const heroSection = document.querySelector(".hero");
const heroImageContainer = document.querySelector(".hero-image-container");
const heroPanel = document.querySelector(".hero-panel");

if (heroSection && heroImageContainer && !reducedMotionQuery.matches) {
  heroSection.addEventListener("mousemove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 10;

    heroImageContainer.style.transform = `translate3d(${offsetX}px, ${offsetY * 0.8}px, 0) rotateX(${(-offsetY * 0.16).toFixed(2)}deg) rotateY(${(offsetX * 0.18).toFixed(2)}deg)`;

    if (heroPanel) {
      heroPanel.style.transform = `translate3d(${(offsetX * 0.35).toFixed(2)}px, ${(offsetY * 0.35).toFixed(2)}px, 0)`;
    }
  });

  heroSection.addEventListener("mouseleave", () => {
    heroImageContainer.style.transform = "";
    if (heroPanel) {
      heroPanel.style.transform = "";
    }
  });
}

// CONTADOR HERO
const counters = document.querySelectorAll(".stat-number");
const heroStats = document.querySelector(".hero-stats");
let started = false;

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-target")) || 0;
    let count = 0;
    const increment = Math.ceil(target / 60);

    const updateCounter = () => {
      count += increment;

      if (count < target) {
        counter.textContent = count;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

function watchHeroCounters() {
  if (!heroStats || started) return;

  const sectionTop = heroStats.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 50) {
    started = true;
    animateCounters();
  }
}

window.addEventListener("scroll", watchHeroCounters, { passive: true });
watchHeroCounters();

// SLIDESHOW E PARALLAX DO HERO
const heroBgImages = document.querySelectorAll(".hero-bg-image");
let currentHeroSlide = 0;
let heroSlideInterval = null;

function setHeroSlide(index) {
  heroBgImages.forEach((image, imageIndex) => {
    image.classList.toggle("hero-bg-image-active", imageIndex === index);
  });
}

function updateHeroParallax() {
  const activeHeroBg = document.querySelector(".hero-bg-image-active");
  if (!activeHeroBg) return;

  const offset = Math.min(window.scrollY * 0.08, 36);
  activeHeroBg.style.transform = `scale(1.08) translateY(${offset}px)`;
}

function startHeroSlideshow() {
  if (heroBgImages.length <= 1 || heroSlideInterval) return;

  heroSlideInterval = window.setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % heroBgImages.length;
    setHeroSlide(currentHeroSlide);
    updateHeroParallax();
  }, 4200);
}

function preloadHeroImages() {
  if (heroBgImages.length === 0) return;

  const preloadTasks = Array.from(heroBgImages, (image) => {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  });

  Promise.all(preloadTasks).then(() => {
    setHeroSlide(currentHeroSlide);
    updateHeroParallax();
    startHeroSlideshow();
  });
}

preloadHeroImages();
if (!reducedMotionQuery.matches) {
  window.addEventListener("scroll", updateHeroParallax, { passive: true });
  updateHeroParallax();
}

// SLIDESHOW DA IMAGEM PRINCIPAL DO HERO
const heroMainImages = document.querySelectorAll(".hero-image-container .hero-main-image");
let currentHeroMainSlide = 0;

function setHeroMainSlide(index) {
  heroMainImages.forEach((image, imageIndex) => {
    image.classList.toggle("hero-main-image-active", imageIndex === index);
  });
}

function startHeroMainSlideshow() {
  if (heroMainImages.length <= 1 || reducedMotionQuery.matches) return;

  window.setInterval(() => {
    currentHeroMainSlide = (currentHeroMainSlide + 1) % heroMainImages.length;
    setHeroMainSlide(currentHeroMainSlide);
  }, 3400);
}

if (heroMainImages.length > 0) {
  setHeroMainSlide(currentHeroMainSlide);
  startHeroMainSlideshow();
}

// SLIDESHOW DA SECAO SAO JOAO
const saoJoaoSlideshow = document.querySelector("[data-sao-joao-slideshow]");

if (saoJoaoSlideshow && !reducedMotionQuery.matches) {
  const saoJoaoSlides = saoJoaoSlideshow.querySelectorAll(".sao-joao-slide");
  let currentSaoJoaoSlide = 0;

  if (saoJoaoSlides.length > 1) {
    window.setInterval(() => {
      saoJoaoSlides[currentSaoJoaoSlide].classList.remove("sao-joao-slide-active");
      currentSaoJoaoSlide = (currentSaoJoaoSlide + 1) % saoJoaoSlides.length;
      saoJoaoSlides[currentSaoJoaoSlide].classList.add("sao-joao-slide-active");
    }, 3200);
  }
}

// MENU ATIVO POR SECAO
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    threshold: 0.45,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// AUTOPLAY DE VIDEO QUANDO VISIVEL
const galleryVideos = document.querySelectorAll(".guia-galeria video");

if (galleryVideos.length > 0) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const playPromise = video.play();

          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
          return;
        }

        video.pause();
        video.currentTime = 0;
      });
    },
    {
      threshold: [0.6],
    }
  );

  galleryVideos.forEach((video) => {
    video.muted = true;
    videoObserver.observe(video);
  });
}

// APENAS UM VIDEO POR VEZ NA SECAO DE VIDEOS
const featuredVideoSection = document.querySelector(".video-destaque");

if (featuredVideoSection) {
  const featuredHtmlVideos = Array.from(
    featuredVideoSection.querySelectorAll(".video-card video")
  );
  const featuredYoutubeIframes = Array.from(
    featuredVideoSection.querySelectorAll(
      '.video-card iframe[src*="youtube.com/embed/"]'
    )
  );
  const youtubePlayers = new Map();

  const pauseHtmlVideos = (currentVideo) => {
    featuredHtmlVideos.forEach((video) => {
      if (video === currentVideo) return;
      video.pause();
    });
  };

  const pauseYoutubePlayers = (currentIframe) => {
    featuredYoutubeIframes.forEach((iframe) => {
      if (iframe === currentIframe) return;

      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: [],
        }),
        "*"
      );
    });
  };

  featuredHtmlVideos.forEach((video) => {
    video.addEventListener("play", () => {
      pauseHtmlVideos(video);
      pauseYoutubePlayers();
    });
  });

  if (featuredYoutubeIframes.length > 0) {
    const initializeYoutubePlayers = () => {
      if (!window.YT || typeof window.YT.Player !== "function") return;

      featuredYoutubeIframes.forEach((iframe) => {
        if (youtubePlayers.has(iframe)) return;

        const player = new window.YT.Player(iframe, {
          events: {
            onStateChange: (event) => {
              if (event.data !== window.YT.PlayerState.PLAYING) return;

              pauseHtmlVideos();

              featuredYoutubeIframes.forEach((otherIframe) => {
                if (otherIframe === iframe) return;

                const otherPlayer = youtubePlayers.get(otherIframe);
                if (otherPlayer && typeof otherPlayer.pauseVideo === "function") {
                  otherPlayer.pauseVideo();
                }
              });
            },
          },
        });

        youtubePlayers.set(iframe, player);
      });
    };

    if (window.YT && typeof window.YT.Player === "function") {
      initializeYoutubePlayers();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      const previousYoutubeReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousYoutubeReady === "function") {
          previousYoutubeReady();
        }

        initializeYoutubePlayers();
      };
    }
  }
}

// GALERIA COM SETAS LATERAIS
const galleryWrappers = document.querySelectorAll(".galeria-wrap");

galleryWrappers.forEach((wrap) => {
  const gallery = wrap.querySelector(".guia-galeria");
  const btnLeft = wrap.querySelector(".galeria-btn-left");
  const btnRight = wrap.querySelector(".galeria-btn-right");

  if (!gallery || !btnLeft || !btnRight) return;

  const getScrollAmount = () => {
    const firstMedia = gallery.querySelector("img, video");
    if (!firstMedia) return 260;

    return firstMedia.clientWidth + 10;
  };

  btnLeft.addEventListener("click", () => {
    gallery.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  });

  btnRight.addEventListener("click", () => {
    gallery.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  });
});

// TILT SUAVE EM CARDS PREMIUM
const tiltTargets = document.querySelectorAll(
  ".destaque-card, .feature, .card, .roteiro-card, .planejamento-card, .guia-card, .cultura-item, .evento-card, .faq-item, .video-card, .info-item, .galeria-item"
);

if (!reducedMotionQuery.matches) {
  tiltTargets.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 5;

      element.style.transform = `translateY(-8px) perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });
}

// SUPORTE A ARRASTAR COM MOUSE NA GALERIA
document.querySelectorAll(".guia-galeria").forEach((gallery) => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  gallery.addEventListener("mousedown", (event) => {
    isDown = true;
    gallery.classList.add("dragging");
    startX = event.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
  });

  gallery.addEventListener("mouseleave", () => {
    isDown = false;
    gallery.classList.remove("dragging");
  });

  gallery.addEventListener("mouseup", () => {
    isDown = false;
    gallery.classList.remove("dragging");
  });

  gallery.addEventListener("mousemove", (event) => {
    if (!isDown) return;

    event.preventDefault();
    const x = event.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.2;
    gallery.scrollLeft = scrollLeft - walk;
  });
});

// LIGHTBOX DE IMAGENS
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const zoomableSelector = "main img:not(.logo):not(.hero-bg-image)";
let lightboxImages = [];
let currentLightboxIndex = -1;

function getZoomableImages() {
  return Array.from(document.querySelectorAll(zoomableSelector)).filter((image) => image.getAttribute("src"));
}

function syncZoomableImages() {
  lightboxImages = getZoomableImages();

  lightboxImages.forEach((image) => {
    image.classList.add("zoomable-image");
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Abrir foto em tela cheia: ${image.alt || "Imagem do site"}`);
  });
}

function updateLightboxView() {
  const activeImage = lightboxImages[currentLightboxIndex];
  if (!activeImage || !lightboxImage || !lightboxCaption || !lightboxPrev || !lightboxNext) return;

  lightboxImage.src = activeImage.currentSrc || activeImage.src;
  lightboxImage.alt = activeImage.alt || "Imagem ampliada";
  lightboxCaption.textContent = activeImage.alt || "Foto ampliada";
  lightboxPrev.hidden = lightboxImages.length <= 1;
  lightboxNext.hidden = lightboxImages.length <= 1;
}

function openLightbox(targetImage) {
  if (!lightbox || !lightboxImage) return;

  syncZoomableImages();
  currentLightboxIndex = lightboxImages.indexOf(targetImage);
  if (currentLightboxIndex < 0) return;

  updateLightboxView();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
}

function moveLightbox(direction) {
  if (!lightboxImages.length || currentLightboxIndex < 0) return;

  currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  updateLightboxView();
}

syncZoomableImages();

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  if (!target.matches(zoomableSelector)) return;

  openLightbox(target);
});

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;

  if (
    (event.key === "Enter" || event.key === " ") &&
    activeElement instanceof HTMLImageElement &&
    activeElement.matches(zoomableSelector)
  ) {
    event.preventDefault();
    openLightbox(activeElement);
    return;
  }

  if (!lightbox || lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    moveLightbox(-1);
  } else if (event.key === "ArrowRight") {
    moveLightbox(1);
  }
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => moveLightbox(-1));
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => moveLightbox(1));
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

// OTIMIZACOES DE MIDIA
document.querySelectorAll("img").forEach((image) => {
  if (image.closest(".hero")) return;

  image.loading = "lazy";
  image.decoding = "async";
});

// TITULO ELETRICO
const electricTitleWrappers = document.querySelectorAll("[data-electric-title]");
const typedInlineElements = document.querySelectorAll("[data-typed-text]");

function startTypingTitle(wrapper) {
  const titleText = wrapper.querySelector(".electric-title-text");
  if (!titleText) return;

  const fullText = titleText.textContent?.trim() || "";
  if (!fullText) return;

  if (reducedMotionQuery.matches) {
    titleText.textContent = fullText;
    titleText.classList.remove("typing-active");
    return;
  }

  titleText.textContent = "";
  titleText.classList.add("typing-active");

  let index = 0;

  const typeNext = () => {
    index += 1;
    titleText.textContent = fullText.slice(0, index);

    if (index < fullText.length) {
      const currentChar = fullText.charAt(index - 1);
      const delay = currentChar === " " ? 28 : 42;
      window.setTimeout(typeNext, delay);
      return;
    }

    window.setTimeout(() => {
      titleText.classList.remove("typing-active");
    }, 900);
  };

  window.setTimeout(typeNext, 320);
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function startInlineTyping(element, delay = 0) {
  if (element.dataset.typingStarted === "true") return;

  const rawText = element.getAttribute("data-typed-text") || element.textContent || "";
  const fullText = decodeHtmlEntities(rawText).trim();
  if (!fullText) return;

  element.dataset.typingStarted = "true";

  if (reducedMotionQuery.matches) {
    element.textContent = fullText;
    element.classList.remove("typing-active");
    return;
  }

  element.textContent = "";
  element.classList.add("typing-active");

  let index = 0;

  const typeNext = () => {
    index += 1;
    element.textContent = fullText.slice(0, index);

    if (index < fullText.length) {
      const currentChar = fullText.charAt(index - 1);
      const stepDelay = currentChar === " " ? 34 : 55;
      window.setTimeout(typeNext, stepDelay);
      return;
    }

    window.setTimeout(() => {
      element.classList.remove("typing-active");
    }, 700);
  };

  window.setTimeout(typeNext, delay);
}

function createElectricSparks(wrapper) {
  const sparkLayer = wrapper.querySelector(".electric-title-sparks");
  if (!sparkLayer) return;

  sparkLayer.innerHTML = "";

  if (reducedMotionQuery.matches) return;

  const sparkCount = window.innerWidth < 768 ? 7 : 11;

  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("span");
    spark.className = "electric-spark";
    spark.dataset.position = String(index);
    spark.style.setProperty("--spark-delay", `${index * 180}ms`);
    spark.style.setProperty("--spark-duration", `${1100 + (index % 4) * 180}ms`);
    spark.style.setProperty("--spark-size", `${34 + (index % 3) * 14}px`);
    sparkLayer.appendChild(spark);
  }
}

function placeElectricSparks(wrapper) {
  const sparks = wrapper.querySelectorAll(".electric-spark");
  if (!sparks.length) return;

  const rect = wrapper.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const perimeter = (width + height) * 2;
  const padding = 8;

  sparks.forEach((spark, index) => {
    const progress = (index / sparks.length + (Math.random() * 0.08)) % 1;
    const distance = progress * perimeter;
    let x = 0;
    let y = 0;
    let rotation = 0;

    if (distance <= width) {
      x = distance;
      y = 0;
      rotation = -8 + Math.random() * 16;
    } else if (distance <= width + height) {
      x = width;
      y = distance - width;
      rotation = 90 + Math.random() * 14;
    } else if (distance <= width * 2 + height) {
      x = width - (distance - width - height);
      y = height;
      rotation = 180 + Math.random() * 14;
    } else {
      x = 0;
      y = height - (distance - width * 2 - height);
      rotation = 270 + Math.random() * 14;
    }

    const color = index % 3 === 0 ? "rgba(255, 209, 102, 0.98)" : "rgba(124, 252, 255, 0.98)";
    const glow = index % 3 === 0 ? "rgba(255, 209, 102, 0.55)" : "rgba(76, 241, 255, 0.6)";

    spark.style.setProperty("--spark-x", `${x + padding}px`);
    spark.style.setProperty("--spark-y", `${y + padding}px`);
    spark.style.setProperty("--spark-rotate", `${rotation}deg`);
    spark.style.setProperty("--spark-color", color);
    spark.style.setProperty("--spark-glow", glow);
    spark.style.setProperty("--spark-scale", `${0.84 + Math.random() * 0.45}`);
  });
}

electricTitleWrappers.forEach((wrapper) => {
  startTypingTitle(wrapper);
  createElectricSparks(wrapper);
  placeElectricSparks(wrapper);
});

typedInlineElements.forEach((element, index) => {
  const isManagementName = element.closest(".footer-management");
  const baseDelay = isManagementName ? 220 : 700;
  const staggerDelay = isManagementName ? 110 : 240;

  if (isManagementName) {
    element.classList.add("typed-highlight");
  }

  startInlineTyping(element, baseDelay + index * staggerDelay);
});

if (electricTitleWrappers.length > 0 && !reducedMotionQuery.matches) {
  const electricResizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      placeElectricSparks(entry.target);
    });
  });

  electricTitleWrappers.forEach((wrapper) => electricResizeObserver.observe(wrapper));

  window.setInterval(() => {
    electricTitleWrappers.forEach((wrapper) => placeElectricSparks(wrapper));
  }, 1800);
}
