// ============================================================
// LOVE THY NEIGHBOR - MASTER JAVASCRIPT
// ============================================================

// ============================================================
// MOBILE MENU TOGGLE (runs on all pages)
// ============================================================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking a nav link
  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// ============================================================
// FOOD PANTRY CAROUSEL
// Only runs if .projects-carousel exists on the page
// ============================================================
const projectsCarousel = document.querySelector(".projects-carousel");
const projectsCarouselSlides = document.getElementById("projectsCarouselSlides");
const projectsSlides = projectsCarousel
  ? projectsCarousel.querySelectorAll(".carousel-slide")
  : [];

if (projectsCarousel && projectsCarouselSlides && projectsSlides.length > 0) {
  let projectsCurrentIndex = 0;
  let projectsSlidesToShow = getProjectsSlidesToShow();
  let projectsIsTransitioning = false;
  let projectsAutoAdvanceInterval;
  let projectsIsPaused = false;

  // Clone slides for infinite loop
  function setupProjectsInfiniteLoop() {
    const existingClones = projectsCarouselSlides.querySelectorAll(".clone");
    existingClones.forEach((clone) => clone.remove());

    const cloneCount = Math.ceil(projectsSlidesToShow * 2);

    // Clone first set of slides and append to end
    for (let i = 0; i < cloneCount; i++) {
      const clone = projectsSlides[i % projectsSlides.length].cloneNode(true);
      clone.classList.add("clone");
      projectsCarouselSlides.appendChild(clone);
    }

    // Clone last set of slides and prepend to beginning
    for (let i = projectsSlides.length - cloneCount; i < projectsSlides.length; i++) {
      const actualIndex = (i + projectsSlides.length) % projectsSlides.length;
      const clone = projectsSlides[actualIndex].cloneNode(true);
      clone.classList.add("clone");
      projectsCarouselSlides.insertBefore(clone, projectsCarouselSlides.firstChild);
    }

    projectsCurrentIndex = cloneCount;
    updateProjectsCarouselPosition(false);
  }

  function getProjectsSlidesToShow() {
    return window.innerWidth <= 468 ? 1 : 3;
  }

  function updateProjectsCarouselPosition(animate = true) {
    const slideWidth = 100 / projectsSlidesToShow;
    const offset = -projectsCurrentIndex * slideWidth;

    if (animate) {
      projectsCarouselSlides.style.transition = "transform 1s ease-in-out";
    } else {
      projectsCarouselSlides.style.transition = "none";
    }

    projectsCarouselSlides.style.transform = `translateX(${offset}%)`;
  }

  function projectsNextSlide() {
    if (projectsIsTransitioning || projectsIsPaused) return;

    projectsIsTransitioning = true;
    projectsCurrentIndex += 1;
    updateProjectsCarouselPosition(true);

    setTimeout(() => {
      if (projectsCurrentIndex >= projectsSlides.length + Math.ceil(projectsSlidesToShow * 2)) {
        projectsCurrentIndex = Math.ceil(projectsSlidesToShow * 2);
        updateProjectsCarouselPosition(false);
      }
      projectsIsTransitioning = false;
    }, 1000);
  }

  function projectsPrevSlide() {
    if (projectsIsTransitioning || projectsIsPaused) return;

    projectsIsTransitioning = true;
    projectsCurrentIndex -= 1;
    updateProjectsCarouselPosition(true);

    setTimeout(() => {
      if (projectsCurrentIndex < Math.ceil(projectsSlidesToShow * 2)) {
        projectsCurrentIndex = projectsSlides.length;
        updateProjectsCarouselPosition(false);
      }
      projectsIsTransitioning = false;
    }, 1000);
  }

  function resetProjectsAutoAdvance() {
    clearInterval(projectsAutoAdvanceInterval);
    projectsAutoAdvanceInterval = setInterval(projectsNextSlide, 5000);
  }

  // Handle window resize
  let projectsResizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(projectsResizeTimeout);
    projectsResizeTimeout = setTimeout(() => {
      const newSlidesToShow = getProjectsSlidesToShow();
      if (newSlidesToShow !== projectsSlidesToShow) {
        projectsSlidesToShow = newSlidesToShow;
        setupProjectsInfiniteLoop();
      }
    }, 250);
  });

  // Initialize
  setupProjectsInfiniteLoop();

  // Create navigation arrows
  const prevArrow = document.createElement("button");
  prevArrow.className = "carousel-arrow prev";
  prevArrow.innerHTML = "&#8249;";
  prevArrow.setAttribute("aria-label", "Previous slide");

  const nextArrow = document.createElement("button");
  nextArrow.className = "carousel-arrow next";
  nextArrow.innerHTML = "&#8250;";
  nextArrow.setAttribute("aria-label", "Next slide");

  projectsCarousel.appendChild(prevArrow);
  projectsCarousel.appendChild(nextArrow);

  prevArrow.addEventListener("click", function () {
    projectsIsPaused = false;
    projectsPrevSlide();
    resetProjectsAutoAdvance();
    projectsIsPaused = true;
  });

  nextArrow.addEventListener("click", function () {
    projectsIsPaused = false;
    projectsNextSlide();
    resetProjectsAutoAdvance();
    projectsIsPaused = true;
  });

  // Pause on hover
  projectsCarousel.addEventListener("mouseenter", function () {
    projectsIsPaused = true;
    clearInterval(projectsAutoAdvanceInterval);
  });

  projectsCarousel.addEventListener("mouseleave", function () {
    projectsIsPaused = false;
    resetProjectsAutoAdvance();
  });

  // Start auto-advance
  projectsAutoAdvanceInterval = setInterval(projectsNextSlide, 5000);
}
