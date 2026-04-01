/* =========================================================================
   Kawatra Impex - Interactive Scripts
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation Toggle --- */
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
  
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    }
  
    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        navbar.style.padding = '0.5rem 0';
      } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        navbar.style.padding = '1rem 0';
      }
    });
  
    /* --- Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated if we only want it strictly once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Grab all elements with .fade-in-section and observe them
    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => sectionObserver.observe(el));

    /* --- Contact Pop-up (Delayed 10s) --- */
    initContactPopup();

    /* --- Product Search Functionality --- */
    initProductSearch();

    /* --- Order Query Modal: close on overlay click & Escape key --- */
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
      orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeOrderModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && orderModal.classList.contains('is-open')) {
          closeOrderModal();
        }
      });

      /* Order Query Form Submission via Formspree AJAX */
      const orderForm = document.getElementById('orderQueryForm');
      if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = orderForm.querySelector('.modal-submit-btn');
          btn.disabled = true;
          btn.innerHTML = '⏳ Sending...';
          try {
            const response = await fetch(orderForm.action, {
              method: 'POST',
              body: new FormData(orderForm),
              headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
              orderForm.style.display = 'none';
              document.getElementById('orderSuccess').style.display = 'block';
              setTimeout(closeOrderModal, 3500);
            } else {
              btn.disabled = false;
              btn.innerHTML = '📨 Send Order Query';
              alert('Submission failed. Please try again or email: kawatraimpex@gmail.com');
            }
          } catch {
            btn.disabled = false;
            btn.innerHTML = '📨 Send Order Query';
            alert('Network error. Please email us at kawatraimpex@gmail.com');
          }
        });
      }
    }

  });

/* =========================================================================
   Order Query Modal — Global Functions (called via onclick attributes)
   ========================================================================= */
function openOrderModal(productName) {
  const overlay = document.getElementById('orderModal');
  const tag     = document.getElementById('modalProductName');
  const input   = document.getElementById('orderProductName');
  const form    = document.getElementById('orderQueryForm');
  const success = document.getElementById('orderSuccess');
  if (!overlay) return;

  if (tag)   tag.textContent = '📦 ' + productName;
  if (input) input.value     = productName;

  if (form) {
    form.style.display = '';
    form.reset();
    if (input) input.value = productName; // restore after reset
    const btn = form.querySelector('.modal-submit-btn');
    if (btn) { btn.disabled = false; btn.innerHTML = '📨 Send Order Query'; }
  }
  if (success) success.style.display = 'none';

  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  const overlay = document.getElementById('orderModal');
  if (overlay) overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* =========================================================================
   Contact Pop-up (Delayed 10s)
   ========================================================================= */
function initContactPopup() {
  // Check if already submitted/closed in this session
  if (sessionStorage.getItem('contactPopupDismissed')) return;

  const popupHtml = `
    <div class="contact-popup-overlay" id="contactPopup">
      <div class="contact-popup-card">
        <button class="contact-popup-close" onclick="closeContactPopup()" aria-label="Close">&times;</button>
        <div class="contact-popup-header">
          <h3>Let's Connect!</h3>
          <p>Our team will reach out to you as soon as possible to discuss your requirements.</p>
        </div>
        <div class="contact-popup-body">
          <form id="contactPopupForm" action="https://formsubmit.co/ajax/kawatraimpex@gmail.com" method="POST" class="contact-popup-form">
            <input type="hidden" name="_subject" value="New Website Lead — Kawatra Impex">
            <div class="form-group">
              <label for="popupName">Name / Company</label>
              <input type="text" id="popupName" name="name" class="contact-popup-input" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
              <label for="popupEmail">Email Address</label>
              <input type="email" id="popupEmail" name="email" class="contact-popup-input" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label for="popupPhone">Phone Number</label>
              <input type="tel" id="popupPhone" name="phone" class="contact-popup-input" placeholder="e.g. +91 98765 43210" required>
            </div>
            <div class="form-group">
              <label for="popupMessage">Message (Optional)</label>
              <textarea id="popupMessage" name="message" class="contact-popup-input" placeholder="How can we help you?" style="min-height: 80px;"></textarea>
            </div>
            <button type="submit" class="contact-popup-submit" id="popupSubmitBtn">Submit Details</button>
          </form>
          <div class="contact-popup-success" id="popupSuccess">
            <span class="contact-popup-success-icon">✅</span>
            <h4>Thank You!</h4>
            <p>We've received your details. One of our experts will contact you shortly.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHtml);

  // Show after 2 seconds (was 10s, reduced for 'instant' feel)
  setTimeout(() => {
    const popup = document.getElementById('contactPopup');
    if (popup) {
      popup.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }
  }, 2000);

  // Form submission logic
  const form = document.getElementById('contactPopupForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('popupSubmitBtn');
      const successDiv = document.getElementById('popupSuccess');
      
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.style.display = 'none';
          successDiv.style.display = 'block';
          sessionStorage.setItem('contactPopupDismissed', 'true');
          setTimeout(closeContactPopup, 4000);
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Submit Details';
        alert('Something went wrong. Please try again or email us: kawatraimpex@gmail.com');
      }
    });
  }

  // Handle overlay click to close
  const overlay = document.getElementById('contactPopup');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeContactPopup();
    });
  }
}

function closeContactPopup() {
  const popup = document.getElementById('contactPopup');
  if (popup) {
    popup.classList.remove('is-visible');
    document.body.style.overflow = '';
    sessionStorage.setItem('contactPopupDismissed', 'true');
  }
}

/* =========================================================================
   Product Search Functionality
   ========================================================================= */
function initProductSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const searchContainer = input.closest('.container');
      const productGrid = searchContainer.querySelector('div[style*="grid"]');
      const products = productGrid.querySelectorAll('.product-item');
      const noResults = searchContainer.querySelector('.no-results');
      
      let matchCount = 0;
      
      products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        // Also check description if it exists (for imported foods)
        const descriptionEl = product.querySelector('p');
        const description = descriptionEl ? descriptionEl.textContent.toLowerCase() : '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          product.style.display = '';
          matchCount++;
        } else {
          product.style.display = 'none';
        }
      });
      
      if (noResults) {
        noResults.style.display = matchCount === 0 ? 'grid' : 'none';
      }
    });
  });
}
