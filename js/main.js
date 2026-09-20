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
import { initHoardingJourney } from './hoarding-journey.js';

document.addEventListener('DOMContentLoaded', () => {
  initThreeWorld();
  initHoardingJourney();
  initChapterHud();
  initConfigBindings();
  initStickyHeader();
  initMobileNav();
  initStatsCounter();
  initServiceFilters();
  initServiceSearch();
  initQuickServiceChips();
  initWorkFilters();
  initLightboxModal();
  initCostEstimator();
  initQuoteForm();
  initScrollSpy();
  initCardSpotlights();
  initHero3DTilt();
  initServiceEnquiryClicks();
  initLeadsCRM();
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
   5. SERVICE CATEGORY FILTER & INSTANT SEARCH ENGINE (MAIN USP)
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
      const searchInput = document.getElementById('serviceSearchInput');
      if (searchInput && searchInput.value.trim() !== '') {
        searchInput.value = '';
        const clearBtn = document.getElementById('clearServiceSearchBtn');
        if (clearBtn) clearBtn.style.display = 'none';
      }

      applyServiceFiltering(filterValue);
    });
  });
}

function applyServiceFiltering(filterValue = 'all') {
  const serviceCards = document.querySelectorAll('.service-card');
  const countBadge = document.getElementById('serviceResultsCount');
  let visibleCount = 0;

  serviceCards.forEach(card => {
    const categories = card.getAttribute('data-category') || '';
    if (filterValue === 'all' || categories.includes(filterValue)) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      visibleCount++;
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        setTimeout(() => {
          card.style.transform = '';
          card.style.transition = '';
        }, 320);
      }, 10);
    } else {
      card.style.display = 'none';
    }
  });

  if (countBadge) {
    countBadge.textContent = filterValue === 'all'
      ? `Showing all ${visibleCount} services`
      : `Showing ${visibleCount} services in this category`;
  }
}

function initServiceSearch() {
  const searchInput = document.getElementById('serviceSearchInput');
  const clearBtn = document.getElementById('clearServiceSearchBtn');
  const countBadge = document.getElementById('serviceResultsCount');
  const serviceCards = document.querySelectorAll('.service-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!searchInput || !serviceCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query) {
      if (clearBtn) clearBtn.style.display = 'block';
      filterBtns.forEach(b => b.classList.remove('active'));
    } else {
      if (clearBtn) clearBtn.style.display = 'none';
      const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
    }

    let matchCount = 0;
    serviceCards.forEach(card => {
      const title = (card.querySelector('.service-title') ? card.querySelector('.service-title').textContent : '').toLowerCase();
      const benefit = (card.querySelector('.service-benefit') ? card.querySelector('.service-benefit').textContent : '').toLowerCase();
      const keywords = (card.getAttribute('data-search-keywords') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      const matches = !query || title.includes(query) || benefit.includes(query) || keywords.includes(query) || category.includes(query);

      if (matches) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      if (!query) {
        countBadge.textContent = `Showing all ${serviceCards.length} services`;
      } else if (matchCount === 0) {
        countBadge.textContent = `No services found for "${query}". Try searching 'flex', 'hoarding', or 'board'`;
      } else {
        countBadge.textContent = `Found ${matchCount} matching service${matchCount > 1 ? 's' : ''}`;
      }
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
      }
      applyServiceFiltering('all');
      searchInput.focus();
    });
  }
}

function initQuickServiceChips() {
  const chips = document.querySelectorAll('.quick-service-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetCategory = chip.getAttribute('data-category-target');
      if (targetCategory) {
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${targetCategory}"]`);
        if (filterBtn) {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          filterBtn.classList.add('active');
          applyServiceFiltering(targetCategory);
        }
      }
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
      const business = document.getElementById('quoteBusiness')?.value.trim() || '';
      const serviceSelect = document.getElementById('quoteService');
      const service = serviceSelect && serviceSelect.selectedIndex > 0 ? serviceSelect.options[serviceSelect.selectedIndex]?.text : 'General Printing';
      const message = document.getElementById('quoteMessage')?.value.trim() || '';

      if (!name || !phone) {
        showToast("⚠️ Please enter your Name and Phone Number first.");
        document.getElementById('quoteName')?.focus();
        return;
      }

      // Automatically log to CRM
      saveCustomerLeadToCRM({ name, phone, business, service, message, channel: 'WhatsApp Direct' });

      const msg = buildQuoteMessage();
      const waNumber = typeof PARI_CONFIG !== 'undefined' ? PARI_CONFIG.whatsappNumber : '919755812374';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      showToast("🚀 Inquiry saved & opening WhatsApp with Anoop Jain!");
    });
  }

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('quoteName')?.value.trim();
    const phone = document.getElementById('quotePhone')?.value.trim();
    const business = document.getElementById('quoteBusiness')?.value.trim() || '';
    const serviceSelect = document.getElementById('quoteService');
    const service = serviceSelect && serviceSelect.selectedIndex > 0 ? serviceSelect.options[serviceSelect.selectedIndex]?.text : 'General Printing';
    const message = document.getElementById('quoteMessage')?.value.trim() || '';

    if (!name || !phone) {
      showToast("⚠️ Please fill in required fields: Name and Phone.");
      return;
    }

    // Automatically log to CRM
    saveCustomerLeadToCRM({ name, phone, business, service, message, channel: 'Website Online Form' });

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Saving Inquiry...</span>`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      quoteForm.reset();
      showToast("✅ Inquiry received & saved to Leads! Click WhatsApp button for instant discussion.");
    }, 600);
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
  const cards = document.querySelectorAll('.service-card, .why-card, .work-item, .grand-hoarding-board, .process-step-card, .stat-card');
  
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
   12. 3D TILT EFFECT ON GRAND HOARDING BOARD
   -------------------------------------------------------------------------- */
function initHero3DTilt() {
  const stage = document.getElementById('grandHoardingBoard') || document.querySelector('.hero-stage-card');
  if (!stage) return;

  // Only enable 3D mouse tracking on devices with hover/pointer capability
  if (window.matchMedia('(hover: hover)').matches) {
    const track = document.getElementById('heroHoardingViewport') || stage;
    track.addEventListener('mousemove', (e) => {
      // If user has scrolled down, skip tilt to preserve scroll transform
      if (window.scrollY > 300) return;

      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 3.5; // subtle 3.5 deg max
      const rotY = (x / (rect.width / 2)) * 3.5;

      stage.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    track.addEventListener('mouseleave', () => {
      stage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }
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
   14. 3D REALM CHAPTER HUD NAVIGATION (WITH HERO AUTO-HIDE)
   -------------------------------------------------------------------------- */
function initChapterHud() {
  const hudBtns = document.querySelectorAll('.hud-btn');
  const hudAside = document.querySelector('.chapter-hud');
  const heroTrack = document.getElementById('home') || document.getElementById('heroHoardingTrack');
  if (!hudBtns.length) return;

  hudBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-chapter') || '0', 10);
      goTo3DChapter(idx);
    });
  });

  const onScrollHud = () => {
    // Hide HUD during the Hero Hoarding & Van journey so road and van are 100% visible
    if (hudAside && heroTrack) {
      const heroBottom = heroTrack.offsetTop + heroTrack.offsetHeight - 200;
      if (window.scrollY < heroBottom) {
        hudAside.classList.add('hud-hidden');
      } else {
        hudAside.classList.remove('hud-hidden');
      }
    }

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

/* --------------------------------------------------------------------------
   15. SERVICE CARD "ENQUIRE NOW" DROPDOWN PRE-SELECTION
   -------------------------------------------------------------------------- */
function initServiceEnquiryClicks() {
  const links = document.querySelectorAll('.service-btn-link');
  const select = document.getElementById('quoteService');

  links.forEach(link => {
    link.addEventListener('click', () => {
      const card = link.closest('.service-card');
      if (!card || !select) return;

      const numEl = card.querySelector('.service-number');
      if (numEl) {
        const numVal = parseInt(numEl.textContent.trim(), 10).toString();
        select.value = numVal;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   16. CUSTOMER INQUIRIES & LEADS CRM ENGINE (LOCALSTORAGE + CSV EXPORT)
   -------------------------------------------------------------------------- */
const LEADS_STORAGE_KEY = 'pari_customer_inquiries';

function getStoredCustomerLeads() {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      // Seed realistic initial customer inquiries so owner can see CRM in action immediately
      const initialSeed = [
        {
          id: 'lead_seed_1',
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          name: 'Ramesh Sharma',
          phone: '+91 98261 23456',
          business: 'Sharma Sweets & Bakers (AB Road Morena)',
          service: 'Flex Banner Printing & Star Flex',
          message: 'Need 3 star flex banners (12x4 ft and 8x3 ft) for upcoming festive season offer.',
          channel: 'Website Form'
        },
        {
          id: 'lead_seed_2',
          date: new Date(Date.now() - 3600000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          name: 'Dr. Vivek Kushwah',
          phone: '+91 94251 23890',
          business: 'Kushwah Dental Clinic (Station Road Morena)',
          service: '3D Acrylic LED Glow Sign Board',
          message: 'Want quotation for outdoor 3D acrylic LED letter signage for clinic facade (10x3 ft).',
          channel: 'WhatsApp Direct'
        }
      ];
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveCustomerLeadToCRM(lead) {
  const leads = getStoredCustomerLeads();
  const newLead = {
    id: 'lead_' + Date.now(),
    date: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    status: 'New Inquiry',
    ...lead
  };
  leads.unshift(newLead);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  updateLeadsUI();
  return newLead;
}

function updateLeadsUI() {
  const leads = getStoredCustomerLeads();
  document.querySelectorAll('.leadsCountSpan').forEach(el => {
    el.textContent = leads.length.toString();
  });
  const totalBadge = document.getElementById('totalLeadsCount');
  if (totalBadge) totalBadge.textContent = leads.length.toString();
  renderLeadsList();
}

function renderLeadsList(searchQuery = '') {
  const container = document.getElementById('leadsListContainer');
  if (!container) return;

  const leads = getStoredCustomerLeads();
  const q = (searchQuery || '').toLowerCase().trim();
  const filtered = q
    ? leads.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.service && l.service.toLowerCase().includes(q)) ||
        (l.business && l.business.toLowerCase().includes(q))
      )
    : leads;

  if (!filtered.length) {
    container.innerHTML = `
      <div class="leads-empty-state">
        <div class="leads-empty-icon">📭</div>
        <h4 style="color: #FFFFFF; margin-bottom: 0.5rem; font-weight: 700;">No Customer Inquiries Yet</h4>
        <p style="font-size: 0.85rem;">When a client submits an inquiry through the website or taps WhatsApp, it will be automatically logged right here in real-time!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(lead => {
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    const waReplyMsg = encodeURIComponent(`Namaste ${lead.name || ''}! Thank you for contacting Pari Publicity regarding ${lead.service || 'our services'}. How can we assist you today?`);

    return `
      <div class="lead-item-card" data-lead-id="${lead.id}">
        <div class="lead-item-top">
          <div class="lead-customer-name">${escapeLeadHtml(lead.name || 'Anonymous Client')}</div>
          <span class="lead-timestamp">🕒 ${escapeLeadHtml(lead.date || '')}</span>
        </div>
        <div class="lead-item-details">
          <div>📞 <strong>Phone:</strong> <a href="tel:${cleanPhone}" style="color: #38BDF8; font-weight:700;">${escapeLeadHtml(lead.phone || 'N/A')}</a></div>
          ${lead.business ? `<div>🏢 <strong>Business:</strong> ${escapeLeadHtml(lead.business)}</div>` : ''}
          <div>🎯 <strong>Service:</strong> <span style="color: #F43F5E; font-weight: 700;">${escapeLeadHtml(lead.service || 'General Printing')}</span></div>
          ${lead.message ? `<div style="margin-top: 0.4rem; padding: 0.5rem; background: rgba(0,0,0,0.25); border-radius: 6px; border-left: 3px solid #38BDF8;">📝 <strong>Details:</strong> ${escapeLeadHtml(lead.message)}</div>` : ''}
        </div>
        <div class="lead-actions-row">
          <a href="https://wa.me/${waPhone}?text=${waReplyMsg}" target="_blank" class="lead-btn-wa">
            💬 WhatsApp Client
          </a>
          <a href="tel:${cleanPhone}" class="lead-btn-call">
            📞 Call Client
          </a>
          <button type="button" class="lead-btn-del" data-action="delete" data-id="${lead.id}">
            ✕ Delete
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach delete handlers
  container.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this inquiry?')) {
        const remaining = getStoredCustomerLeads().filter(l => l.id !== id);
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(remaining));
        updateLeadsUI();
        showToast('🗑️ Inquiry deleted from records.');
      }
    });
  });
}

function escapeLeadHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function exportLeadsToCsv() {
  const leads = getStoredCustomerLeads();
  if (!leads.length) {
    showToast('⚠️ No inquiries to export yet.');
    return;
  }

  const headers = ['Date', 'Customer Name', 'Phone', 'Business', 'Service', 'Requirement Details', 'Channel'];
  const rows = leads.map(l => [
    `"${l.date || ''}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.business || '').replace(/"/g, '""')}"`,
    `"${(l.service || '').replace(/"/g, '""')}"`,
    `"${(l.message || '').replace(/"/g, '""')}"`,
    `"${l.channel || 'Website'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pari_publicity_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 Exported all inquiries to CSV successfully!');
}

function initLeadsCRM() {
  const modal = document.getElementById('adminLeadsModal');
  const openButtons = document.querySelectorAll('.openAdminLeadsBtn');
  const closeBtn = document.getElementById('closeAdminLeadsBtn');
  const backdrop = document.getElementById('adminLeadsBackdrop');
  const exportBtn = document.getElementById('exportLeadsCsvBtn');
  const clearBtn = document.getElementById('clearAllLeadsBtn');
  const searchInput = document.getElementById('leadsSearchInput');

  if (modal) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        renderLeadsList();
      });
    });
  }

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (exportBtn) exportBtn.addEventListener('click', exportLeadsToCsv);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all customer inquiries from local records?')) {
        localStorage.removeItem(LEADS_STORAGE_KEY);
        updateLeadsUI();
        showToast('🗑️ All inquiries cleared.');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeadsList(e.target.value);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  updateLeadsUI();
}
