const header = document.getElementById("header");
const scrollProgress = document.getElementById("scrollProgress");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const themeButton = document.getElementById("themeButton");
const themeIcon = document.querySelector(".theme-icon");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

const videoButton = document.getElementById("videoButton");
const videoModal = document.getElementById("videoModal");
const videoClose = document.getElementById("videoClose");

const newsletterForm = document.getElementById("newsletterForm");
const formMessage = document.getElementById("formMessage");

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

const currentYear = document.getElementById("currentYear");

/* Année automatique */
currentYear.textContent = new Date().getFullYear();

/* Barre de progression et navigation */
function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollPercent = documentHeight > 0 ? scrollTop / documentHeight : 0;

  scrollProgress.style.transform = `scaleX(${scrollPercent})`;

  if (scrollTop > 35) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateScrollEffects);
updateScrollEffects();

/* Menu mobile */
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

/* Lien de navigation actif selon la section */
const sections = document.querySelectorAll("main section[id]");

function updateActiveNav() {
  const currentPosition = window.scrollY + 160;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      currentPosition >= sectionTop &&
      currentPosition < sectionTop + sectionHeight
    ) {
      navItems.forEach((item) => item.classList.remove("active"));

      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );

      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

/* Mode sombre */
function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeIcon.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("nigerTheme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("nigerTheme");

if (savedTheme === "dark") {
  setTheme(true);
}

themeButton.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  setTheme(isDark);
});

/* Révélations au scroll */
const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  if (!element.closest(".hero")) {
    revealObserver.observe(element);
  }
});

/* Compteurs animés */
const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1500;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    const value = Math.floor(target * easedProgress);

    counter.textContent = value.toLocaleString("fr-FR");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target.toLocaleString("fr-FR");
    }
  }

  requestAnimationFrame(updateCounter);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCounter(entry.target);
      }
    });
  },
  { threshold: 0.65 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* Filtres galerie */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
  item.dataset.filterType = item.classList.contains("video") ? "video" : "image";
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const shouldShow =
        filter === "all" || item.dataset.filterType === filter;

      if (shouldShow) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

  });
});

/* Modal galerie */
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    const title = item.querySelector("h3");

    if (!image) {
      return;
    }

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCaption.textContent = title ? title.textContent : "";

    imageModal.classList.add("open");
    document.body.classList.add("no-scroll");
  });
});

function closeImageModal() {
  imageModal.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

modalClose.addEventListener("click", closeImageModal);

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeImageModal();
  }
});

/* Modal vidéo */
videoButton.addEventListener("click", () => {
  videoModal.classList.add("open");
  document.body.classList.add("no-scroll");
});

function closeVideoModal() {
  videoModal.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

videoClose.addEventListener("click", closeVideoModal);

videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) {
    closeVideoModal();
  }
});

/* Fermeture avec Échap */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageModal();
    closeVideoModal();
  }
});

/* Toast */
let toastTimer;

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* Newsletter simulée */
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("emailInput").value.trim();

  if (!email) {
    formMessage.textContent = "Veuillez renseigner votre adresse e-mail.";
    return;
  }

  formMessage.textContent =
    "Merci ! Votre inscription a été enregistrée avec succès.";
  newsletterForm.reset();

  showToast("Bienvenue dans la communauté des merveilles du Niger !");
});

/* Formulaire de contact simulé */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  contactMessage.textContent = `Merci ${name || ""}, votre message a bien été préparé.`;
  contactForm.reset();

  showToast("Votre message a été envoyé avec succès.");
});

/* Effet lumineux souris */
const cursorGlow = document.getElementById("cursorGlow");

if (window.matchMedia("(pointer: fine)").matches) {
  cursorGlow.style.cssText = `
    background: radial-gradient(circle, rgba(227, 185, 106, 0.16), transparent 68%);
    border-radius: 50%;
    height: 230px;
    left: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    transform: translate(-50%, -50%);
    width: 230px;
    z-index: 0;
  `;

  document.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}