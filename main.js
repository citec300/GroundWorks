/**
 * GROUND WORKS CORP. - MAIN INTERACTIVE SCRIPT
 * Handles mobile drawer, sticky header, service filters, FAQ accordions,
 * project cost estimator calculations, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initServiceFilters();
  initFaqAccordions();
  initProjectEstimator();
  initContactForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   3. SERVICE CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other open items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isExpanded) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE PROJECT ESTIMATOR
   -------------------------------------------------------------------------- */
function initProjectEstimator() {
  const serviceSelect = document.getElementById('calcService');
  const countySelect = document.getElementById('calcCounty');
  const scaleSelect = document.getElementById('calcScale');
  const accessSelect = document.getElementById('calcAccess');
  const priceValue = document.getElementById('priceValue');
  const priceDetails = document.getElementById('priceDetails');
  const applyBtn = document.getElementById('applyEstimateBtn');

  if (!serviceSelect || !scaleSelect || !priceValue) return;

  const pricingModel = {
    pool: { baseMin: 2200, baseMax: 4500, label: 'Swimming Pool Excavation & Dirt Removal' },
    clearing: { baseMin: 1800, baseMax: 3800, label: 'Lot Clearing & Vegetation/Brush Grubbing' },
    demolition: { baseMin: 2500, baseMax: 5500, label: 'Structure / Concrete Demolition & Disposal' },
    driveway: { baseMin: 1500, baseMax: 3200, label: 'Driveway Subgrade Prep & Excavation' },
    bobcat: { baseMin: 950, baseMax: 1800, label: 'Day Equipment Operator Dispatch (Bobcat / Skid-Steer)' },
    hauling: { baseMin: 800, baseMax: 2200, label: 'Material Hauling (Soil, Gravel, Aggregate)' },
    general: { baseMin: 3000, baseMax: 7500, label: 'Commercial Site Prep & Foundation Grading' }
  };

  const scaleMultiplier = {
    small: 0.8,
    medium: 1.0,
    large: 1.6,
    commercial: 2.5
  };

  const accessMultiplier = {
    open: 1.0,
    tight: 1.25
  };

  function updateEstimate() {
    const serviceKey = serviceSelect.value;
    const scaleKey = scaleSelect.value;
    const accessKey = accessSelect.value;
    const countyName = countySelect.options[countySelect.selectedIndex].text;

    const base = pricingModel[serviceKey] || pricingModel.pool;
    const scale = scaleMultiplier[scaleKey] || 1.0;
    const access = accessMultiplier[accessKey] || 1.0;

    const min = Math.round((base.baseMin * scale * access) / 50) * 50;
    const max = Math.round((base.baseMax * scale * access) / 50) * 50;

    priceValue.textContent = `${min.toLocaleString()} - ${max.toLocaleString()}`;
    priceDetails.textContent = `Includes mobilization to ${countyName}, heavy equipment operator, and standard earthmoving for ${base.label}.`;
  }

  serviceSelect.addEventListener('change', updateEstimate);
  countySelect.addEventListener('change', updateEstimate);
  scaleSelect.addEventListener('change', updateEstimate);
  accessSelect.addEventListener('change', updateEstimate);

  // Initial calculation
  updateEstimate();

  // Apply button pre-populates the contact form
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('quoteForm');
      const serviceInput = document.getElementById('serviceNeeded');
      const countyInput = document.getElementById('county');
      const messageInput = document.getElementById('message');

      if (serviceInput) {
        // Map select value
        const map = {
          pool: 'Swimming Pool Excavation',
          clearing: 'Land Clearing',
          demolition: 'Demolition Services',
          driveway: 'Driveway Excavation',
          bobcat: 'Bobcat / Skid-Steer',
          hauling: 'Material Hauling',
          general: 'Excavation Services'
        };
        serviceInput.value = map[serviceSelect.value] || 'Excavation Services';
      }

      if (countyInput) {
        const cMap = {
          broward: 'Broward County',
          'palm-beach': 'Palm Beach County',
          'miami-dade': 'Miami-Dade County'
        };
        countyInput.value = cMap[countySelect.value] || 'Broward County';
      }

      if (messageInput) {
        messageInput.value = `[Estimator Pre-fill] Scope: ${scaleSelect.options[scaleSelect.selectedIndex].text} | Access: ${accessSelect.options[accessSelect.selectedIndex].text} | Ballpark Estimate: $${priceValue.textContent}. Please confirm on-site date.`;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & VALIDATION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('quoteForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const county = document.getElementById('county').value;
    const clientType = document.getElementById('clientType').value;
    const serviceNeeded = document.getElementById('serviceNeeded').value;
    const message = document.getElementById('message').value.trim();

    // Basic Validation
    if (!fullName || !phone || !county || !clientType || !serviceNeeded) {
      showFeedback('Please fill out all required fields marked with * before submitting.', 'error');
      return;
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      showFeedback('Please enter a valid 10-digit phone number so our dispatch can reach you.', 'error');
      return;
    }

    // Processing animation
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing Dispatch Request...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>SUBMIT QUOTE REQUEST</span>';

      showFeedback(
        `Thank you, ${fullName}! Your inquiry for ${serviceNeeded} in ${county} has been received. Our dispatch team will call you at ${phone} promptly.`,
        'success'
      );

      form.reset();
    }, 900);
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* --------------------------------------------------------------------------
   7. SMOOTH SCROLLING FOR ALL HASH LINKS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
