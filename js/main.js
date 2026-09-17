/**
 * Pari Publicity - Flagship Interactive Engine
 * ================================================================
 * Handles interactive 3D card tilt, spotlight cursor glows,
 * configuration data binding, portfolio filters, lightbox,
 * WhatsApp quote generator, and cost estimator.
 * ================================================================
 */

import { PARI_CONFIG } from './config.js';
import { initThreeWorld, goTo3DChapter } from './three-world.js';

document.addEventListener('DOMContentLoaded', () => {
  initThreeWorld();
  initChapterHud();
  initConfigBindings();
  initStickyHeader();
  initMobileNav();
  initStatsCounter();
  initServiceFilters();
  initWorkFilters();
  initLightboxModal();
  initCostEstimator();
  initQuoteForm();
  initScrollSpy();
  initCardSpotlights();
  initHero3DTilt();
});

/* --------------------------------------------------------------------------
   1. CONFIG DATA BINDING
   -------------------------------------------------------------------------- */
function initConfigBindings() {
  if (typeof PARI_CONFIG === 'undefined') return;

  // Phone bindings
  document.querySelectorAll('[data-config="phone"]').forEach(el => {
    el.textContent = PARI_CONFIG.phoneDisplay;
  });
  document.querySelectorAll('[data-config="phone-tel"]').forEach(el => {
    el.setAttribute('href', `tel:${PARI_CONFIG.phoneTel}`);
  });

  // Secondary phone
  document.querySelectorAll('[data-config="phone-secondary"]').forEach(el => {
    el.textContent = PARI_CONFIG.secondaryPhoneDisplay;
  });

  // WhatsApp bindings
  const waUrl = `https://wa.me/${PARI_CONFIG.whatsappNumber}?text=${encodeURIComponent(PARI_CONFIG.whatsappDefaultMsg)}`;
  document.querySelectorAll('[data-config="whatsapp-link"]').forEach(el => {
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });
  document.querySelectorAll('[data-config="whatsapp-display"]').forEach(el => {
    el.textContent = PARI_CONFIG.whatsappDisplay;
  });

  // Email bindings
  document.querySelectorAll('[data-config="email"]').forEach(el => {
    el.textContent = PARI_CONFIG.email;
  });
  document.querySelectorAll('[data-config="email-mailto"]').forEach(el => {
    el.setAttribute('href', `mailto:${PARI_CONFIG.email}`);
  });

  // Address bindings
  document.querySelectorAll('[data-config="address"]').forEach(el => {
    el.textContent = PARI_CONFIG.fullAddress;
  });

  // Hours
  document.querySelectorAll('[data-config="hours"]').forEach(el => {
    el.textContent = PARI_CONFIG.businessHours.fullDisplay;
  });
  document.querySelectorAll('[data-config="hours-weekdays"]').forEach(el => {
    el.textContent = PARI_CONFIG.businessHours.weekdays;
  });
  document.querySelectorAll('[data-config="hours-sunday"]').forEach(el => {
    el.textContent = PARI_CONFIG.businessHours.sunday;
  });

  // Maps URL
  const mapIframe = document.getElementById('google-map-iframe');
  if (mapIframe && PARI_CONFIG.mapsEmbedUrl) {
    mapIframe.setAttribute('src', PARI_CONFIG.mapsEmbedUrl);
  }

  // Social Links
  if (PARI_CONFIG.socialLinks) {
    const ig = document.querySelector('[data-social="instagram"]');
    if (ig) ig.setAttribute('href', PARI_CONFIG.socialLinks.instagram);
    const fb = document.querySelector('[data-social="facebook"]');
    if (fb) fb.setAttribute('href', PARI_CONFIG.socialLinks.facebook);
    const yt = document.querySelector('[data-social="youtube"]');
    if (yt) yt.setAttribute('href', PARI_CONFIG.socialLinks.youtube);
  }
}

/* --------------------------------------------------------------------------
   2. STICKY HEADER WITH BLUR
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!menuBtn || !drawer) return;

  const closeDrawer = () => {
    drawer.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    drawer.classList.add('open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const toggleDrawer = () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  menuBtn.addEventListener('click', toggleDrawer);

  drawer.querySelectorAll('.mobile-nav-link, .btn').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   4. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const duration = 1800;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString('en-IN');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString('en-IN');
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const ribbon = document.querySelector('.stats-ribbon');
  if (ribbon) observer.observe(ribbon);
}

/* --------------------------------------------------------------------------
   5. SERVICE CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            // Clear inline transform and transition after animation so CSS :hover takes over cleanly
            setTimeout(() => {
              card.style.transform = '';
              card.style.transition = '';
            }, 360);
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. PORTFOLIO WORK FILTER
   -------------------------------------------------------------------------- */
function initWorkFilters() {
  const workFilterBtns = document.querySelectorAll('.work-filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  if (!workFilterBtns.length || !workItems.length) return;

  workFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      workFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-work-filter');

      workItems.forEach(item => {
        const category = item.getAttribute('data-work-cat') || '';
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.35s ease';
            item.style.opacity = '1';
            setTimeout(() => {
              item.style.transition = '';
            }, 360);
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. LIGHTBOX MODAL FOR PORTFOLIO
   -------------------------------------------------------------------------- */
function initLightboxModal() {
  const modal = document.getElementById('workLightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const modalImg = document.getElementById('lightboxModalImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCat = document.getElementById('lightboxCategory');
  const modalDesc = document.getElementById('lightboxDesc');
  const modalOrderBtn = document.getElementById('lightboxOrderBtn');
  const workItems = document.querySelectorAll('.work-item');

  if (!modal) return;

  const openLightbox = (item) => {
    const title = item.querySelector('.work-title')?.textContent || '';
    const category = item.querySelector('.work-cat')?.textContent || '';
    const desc = item.querySelector('.work-desc')?.textContent || '';
    const imgSrc = item.querySelector('.work-thumb-wrap img')?.getAttribute('src') || '';

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) modalCat.textContent = category;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalOrderBtn && typeof PARI_CONFIG !== 'undefined') {
      const msg = `Hello Pari Publicity! I am interested in your project "${title}" (${category}) from your website. Please share specifications and quotation for Morena.`;
      modalOrderBtn.href = `https://wa.me/${PARI_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      modalOrderBtn.target = '_blank';
      modalOrderBtn.rel = 'noopener noreferrer';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  workItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE PRINT COST ESTIMATOR
   -------------------------------------------------------------------------- */
function initCostEstimator() {
  const serviceSelect = document.getElementById('estServiceSelect');
  const widthInput = document.getElementById('estWidthInput');
  const heightInput = document.getElementById('estHeightInput');
  const qtyInput = document.getElementById('estQtyInput');
  const resultDisplay = document.getElementById('estPriceDisplay');
  const noteDisplay = document.getElementById('estNoteDisplay');
  const sendWaBtn = document.getElementById('estSendWaBtn');
  const dimensionGroup = document.getElementById('estDimensionGroup');
  const qtyGroup = document.getElementById('estQtyGroup');

  if (!serviceSelect || !resultDisplay) return;

  const calculateEstimate = () => {
    const serviceType = serviceSelect.value;
    let totalPrice = 0;
    let detailsText = '';

    if (serviceType === 'flex' || serviceType === 'star-flex' || serviceType === 'vinyl' || serviceType === 'glow-board') {
      if (dimensionGroup) dimensionGroup.style.display = 'grid';
      if (qtyGroup) qtyGroup.style.display = 'none';

      const w = parseFloat(widthInput?.value || '10');
      const h = parseFloat(heightInput?.value || '4');
      const sqFt = (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) ? 40 : (w * h);

      let ratePerSqFt = 12;
      let serviceName = "Standard Flex Banner";

      if (serviceType === 'star-flex') {
        ratePerSqFt = 22;
        serviceName = "Glossy Star Flex Banner";
      } else if (serviceType === 'vinyl') {
        ratePerSqFt = 35;
        serviceName = "Vinyl Print & Board Wrap";
      } else if (serviceType === 'glow-board') {
        ratePerSqFt = 140;
        serviceName = "3D Glow Signboard";
      }

      totalPrice = Math.round(sqFt * ratePerSqFt);
      detailsText = `${sqFt} Sq.Ft (${w}ft × ${h}ft) @ approx ₹${ratePerSqFt}/sq.ft`;

      if (noteDisplay) {
        noteDisplay.textContent = `Estimated for ${serviceName}: ${detailsText}. Final quote may vary based on metal fabrication or on-site mounting in Morena.`;
      }

    } else if (serviceType === 'cards') {
      if (dimensionGroup) dimensionGroup.style.display = 'none';
      if (qtyGroup) qtyGroup.style.display = 'block';

      const qty = parseInt(qtyInput?.value || '1000', 10);
      totalPrice = Math.round((qty / 1000) * 450);
      detailsText = `${qty} Premium Visiting Cards`;
      if (noteDisplay) {
        noteDisplay.textContent = `Premium 350 GSM matte/gloss. Velvet touch and Spot UV embossed finish available on request.`;
      }

    } else if (serviceType === 'pamphlets') {
      if (dimensionGroup) dimensionGroup.style.display = 'none';
      if (qtyGroup) qtyGroup.style.display = 'block';

      const qty = parseInt(qtyInput?.value || '1000', 10);
      totalPrice = Math.round((qty / 1000) * 380);
      detailsText = `${qty} Promotional Pamphlets`;
      if (noteDisplay) {
        noteDisplay.textContent = `High-speed digital/offset print for institutions, clinics, and showrooms in Morena.`;
      }
    }

    resultDisplay.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (sendWaBtn) {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const serviceTitle = selectedOption ? selectedOption.text : serviceType;
      const waMsg = `Hello Pari Publicity! I checked your instant cost calculator on your website:
• Service: ${serviceTitle}
• Details: ${detailsText}
• Estimated Amount: ₹${totalPrice.toLocaleString('en-IN')}

Please share your best final price and timeline for Morena.`;

      const cfgNumber = (typeof PARI_CONFIG !== 'undefined' && PARI_CONFIG.whatsappNumber) ? PARI_CONFIG.whatsappNumber : '919755812374';
      sendWaBtn.href = `https://wa.me/${cfgNumber}?text=${encodeURIComponent(waMsg)}`;
      sendWaBtn.target = '_blank';
      sendWaBtn.rel = 'noopener noreferrer';
    }
  };

  serviceSelect.addEventListener('change', calculateEstimate);
  if (widthInput) widthInput.addEventListener('input', calculateEstimate);
  if (heightInput) heightInput.addEventListener('input', calculateEstimate);
  if (qtyInput) qtyInput.addEventListener('change', calculateEstimate);

  calculateEstimate();
}

/* --------------------------------------------------------------------------
   9. QUOTE ENQUIRY FORM & WHATSAPP GENERATOR
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const quoteForm = document.getElementById('pariQuoteForm');
  const waSubmitBtn = document.getElementById('formSendWhatsAppBtn');
  if (!quoteForm) return;

  const buildQuoteMessage = () => {
    const name = document.getElementById('quoteName')?.value.trim() || 'Client';
    const phone = document.getElementById('quotePhone')?.value.trim() || 'Not provided';
    const business = document.getElementById('quoteBusiness')?.value.trim() || 'Local Business';
    const serviceSelect = document.getElementById('quoteService');
    let service = 'Printing & Advertising';
    if (serviceSelect && serviceSelect.selectedIndex > 0) {
      service = serviceSelect.options[serviceSelect.selectedIndex]?.text || service;
    }
    const message = document.getElementById('quoteMessage')?.value.trim() || 'Please provide quotation and specifications.';

    return `*New Flagship Inquiry - Pari Publicity Website*
----------------------------------------
👤 *Name:* ${name}
📞 *Phone:* ${phone}
🏢 *Business / Org:* ${business}
🎯 *Service Required:* ${service}
📝 *Requirement Details:* ${message}
📍 *Location:* Morena, Madhya Pradesh
----------------------------------------
Please reply with mockup proofs and quotation.`;
  };

  if (waSubmitBtn) {
    waSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName')?.value.trim();
      const phone = document.getElementById('quotePhone')?.value.trim();

      if (!name || !phone) {
        showToast("⚠️ Please enter your Name and Phone Number first.");
        document.getElementById('quoteName')?.focus();
        return;
      }

      const msg = buildQuoteMessage();
      const waNumber = typeof PARI_CONFIG !== 'undefined' ? PARI_CONFIG.whatsappNumber : '919755812374';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showToast("🚀 Opening WhatsApp with your formatted inquiry!");
    });
  }

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('quoteName')?.value.trim();
    const phone = document.getElementById('quotePhone')?.value.trim();

    if (!name || !phone) {
      showToast("⚠️ Please fill in required fields: Name and Phone.");
      return;
    }

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Inquiry...</span>`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      quoteForm.reset();
      showToast("✅ Thank you! Your inquiry is logged. Our Morena team will get back to you shortly.");
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   10. SCROLL SPY
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   11. APPLE SPOTLIGHT CURSOR GLOW EFFECT ON GLASS CARDS
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.service-card, .why-card, .work-item, .hero-stage-card, .process-step-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   12. 3D TILT EFFECT ON HERO STAGE
   -------------------------------------------------------------------------- */
function initHero3DTilt() {
  const stage = document.querySelector('.hero-stage-card');
  if (!stage) return;

  // Only enable 3D mouse tracking on devices with hover/pointer capability
  if (window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 8; // max 8 deg
      const rotY = (x / (rect.width / 2)) * 8;

      stage.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    stage.addEventListener('mouseleave', () => {
      stage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // Ensure card resets cleanly on touch devices
  stage.addEventListener('touchend', () => {
    stage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   13. TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('pariToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pariToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   14. 3D REALM CHAPTER HUD NAVIGATION
   -------------------------------------------------------------------------- */
function initChapterHud() {
  const hudBtns = document.querySelectorAll('.hud-btn');
  if (!hudBtns.length) return;

  hudBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-chapter') || '0', 10);
      goTo3DChapter(idx);
    });
  });

  const onScrollHud = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const p = window.scrollY / maxScroll;

    // Active chapter threshold mapping
    let activeIdx = 0;
    if (p >= 0.85) activeIdx = 4;
    else if (p >= 0.62) activeIdx = 3;
    else if (p >= 0.38) activeIdx = 2;
    else if (p >= 0.18) activeIdx = 1;

    hudBtns.forEach((b, i) => {
      if (i === activeIdx) b.classList.add('active');
      else b.classList.remove('active');
    });
  };

  window.addEventListener('scroll', onScrollHud, { passive: true });
  onScrollHud();
}
