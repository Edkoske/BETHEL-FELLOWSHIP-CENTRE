/**
 * Bethel Fellowship Centre — Main Script
 */

(function () {
  'use strict';

  /* --- DOM Elements --- */
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const copyBtn = document.getElementById('copyBtn');
  const accountNumber = document.getElementById('accountNumber');
  const copiedToast = document.getElementById('copiedToast');
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const backToTop = document.getElementById('backToTop');
  const revealElements = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');

  let currentGalleryIndex = 0;
  let galleryImages = [];

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* --- Sticky Header --- */
  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    if (scrollY > 400) {
      backToTop.removeAttribute('hidden');
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
      backToTop.setAttribute('hidden', '');
    }

    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Active Navigation Indicator --- */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('data-section') === sectionId ||
              link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  /* --- Mobile Menu --- */
  function openMobileMenu() {
    nav.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    nav.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
    }
  });

  /* --- Copy Account Number --- */
  if (copyBtn && accountNumber) {
    copyBtn.addEventListener('click', async function () {
      const text = accountNumber.textContent.trim();

      try {
        await navigator.clipboard.writeText(text);
        showCopiedToast();
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopiedToast();
      }
    });
  }

  function showCopiedToast() {
    copiedToast.classList.add('is-visible');
    setTimeout(function () {
      copiedToast.classList.remove('is-visible');
    }, 2500);
  }

  /* --- Gallery Lightbox --- */
  if (galleryGrid) {
    const galleryItems = galleryGrid.querySelectorAll('.gallery__item');
    galleryImages = Array.from(galleryItems).map(function (item) {
      const img = item.querySelector('img');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt')
      };
    });

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });
  }

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxImage();
    lightbox.removeAttribute('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
    }, 300);
  }

  function updateLightboxImage() {
    const image = galleryImages[currentGalleryIndex];
    if (image) {
      lightboxImg.setAttribute('src', image.src);
      lightboxImg.setAttribute('alt', image.alt);
    }
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  /* --- Back to Top --- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Scroll Reveal Animations --- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Prevent layout shift for images --- */
  document.querySelectorAll('img').forEach(function (img) {
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      img.addEventListener('load', function () {
        this.style.opacity = '1';
      });
    }
  });

})();
