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

// ============================================================
// APPLY PAGE - FORM VALIDATION & SUBMISSION
// Only runs if #applyForm exists on the page
// ============================================================
const applyForm = document.getElementById("applyForm");

if (applyForm) {
  const successMsg = document.getElementById("applySuccess");

  // Character counter for the story textarea
  const storyField = document.getElementById("applyStory");
  const charCounter = document.getElementById("storyCharCount");
  const MAX_CHARS = 2000;

  if (storyField && charCounter) {
    storyField.addEventListener("input", () => {
      const len = storyField.value.length;
      charCounter.textContent = `${len} / ${MAX_CHARS} characters`;
      charCounter.classList.toggle("warn", len > MAX_CHARS * 0.9);
    });
  }

  // Helper: show/clear field error
  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + "Error");
    if (field) field.classList.add("field-error");
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add("show");
    }
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + "Error");
    if (field) field.classList.remove("field-error");
    if (errEl) errEl.classList.remove("show");
  }

  // Clear errors on input
  applyForm.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("input", () => clearError(el.id));
    el.addEventListener("change", () => clearError(el.id));
  });

  // Validate
  function validateForm() {
    let valid = true;

    // First name
    const firstName = document.getElementById("applyFirstName").value.trim();
    if (!firstName) { showError("applyFirstName", "Please enter your first name."); valid = false; }
    else clearError("applyFirstName");

    // Last name
    const lastName = document.getElementById("applyLastName").value.trim();
    if (!lastName) { showError("applyLastName", "Please enter your last name."); valid = false; }
    else clearError("applyLastName");

    // Street address
    const street = document.getElementById("applyStreet").value.trim();
    if (!street) { showError("applyStreet", "Please enter your street address."); valid = false; }
    else clearError("applyStreet");

    // City
    const city = document.getElementById("applyCity").value.trim();
    if (!city) { showError("applyCity", "Please enter your city."); valid = false; }
    else clearError("applyCity");

    // State
    const state = document.getElementById("applyState").value.trim();
    if (!state) { showError("applyState", "Please enter your state."); valid = false; }
    else clearError("applyState");

    // ZIP
    const zip = document.getElementById("applyZip").value.trim();
    if (!zip || !/^\d{5}(-\d{4})?$/.test(zip)) { showError("applyZip", "Please enter a valid ZIP code."); valid = false; }
    else clearError("applyZip");

    // Phone
    const phone = document.getElementById("applyPhone").value.trim();
    const phoneClean = phone.replace(/\D/g, "");
    if (!phone || phoneClean.length < 10) { showError("applyPhone", "Please enter a valid 10-digit phone number."); valid = false; }
    else clearError("applyPhone");

    // Email
    const email = document.getElementById("applyEmail").value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) { showError("applyEmail", "Please enter a valid email address."); valid = false; }
    else clearError("applyEmail");

    // Service type
    const service = document.getElementById("applyService").value;
    if (!service) { showError("applyService", "Please select the service you are applying for."); valid = false; }
    else clearError("applyService");

    // Story
    const story = document.getElementById("applyStory").value.trim();
    if (!story || story.length < 20) { showError("applyStory", "Please share a bit about your situation (at least 20 characters)."); valid = false; }
    else if (story.length > MAX_CHARS) { showError("applyStory", `Please shorten your message to ${MAX_CHARS} characters or fewer.`); valid = false; }
    else clearError("applyStory");

    return valid;
  }

  // Submit handler
  applyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first visible error
      const firstErr = applyForm.querySelector(".field-error");
      if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Disable button to prevent double-submit
    const btn = document.getElementById("applySubmitBtn");
    if (btn) { btn.disabled = true; btn.textContent = "Submitting…"; }

    // Simulate submission (replace with real endpoint as needed)
    setTimeout(() => {
      applyForm.style.display = "none";
      if (successMsg) successMsg.classList.add("show");
      window.scrollTo({ top: successMsg.offsetTop - 100, behavior: "smooth" });
    }, 800);
  });
}
