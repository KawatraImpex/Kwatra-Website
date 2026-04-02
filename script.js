/* =========================================================================
   Kawatra Impex - Interactive Scripts
   ========================================================================= */

/**
 * Universal Form Submission Handler with Premium Animation 
 * (Injected to global scope for HTML access)
 */
async function handleFormSubmission(event, formId, successId, formIdAttr) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const successOverlay = document.getElementById(successId);
  const formData = new FormData(form);

  // Disable button and show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "⌛ Sending...";
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${formId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Hide form and show success animation
      form.style.display = 'none';
      if (successOverlay) {
        successOverlay.style.display = 'block';
        // Auto-close after 5 seconds
        setTimeout(() => {
          if (formIdAttr === 'orderQueryForm') closeOrderModal();
          if (formIdAttr === 'contactPopupForm') closeContactPopup();
        }, 5000);
      }
    } else {
      const data = await response.json();
      alert("Oops! There was a problem: " + (data.errors ? data.errors.map(error => error.message).join(', ') : "Error submitting form."));
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.originalText || "📨 Submit";
      }
    }
  } catch (error) {
    alert("Network error. Please check your connection or use the direct email link.");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtn.dataset.originalText || "📨 Submit";
    }
  }
}



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

      /* Order Query Form — handled via onsubmit AJAX handler (handleFormSubmission) */
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
          <!-- Success Animation Overlay -->
          <div id="popupSuccess" class="modal-success-overlay" style="display: none; padding: 2rem; text-align: center;">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h4 style="color: #16a34a; margin-top: 15px;">Thank You!</h4>
            <p style="color: #64748b; font-size: 1rem;">Our team will contact you soon.</p>
            <button class="btn btn-outline" style="margin-top: 1.5rem; width: 100%;" onclick="closeContactPopup()">Close</button>
          </div>

          <form id="contactPopupForm" onsubmit="handleFormSubmission(event, 'kawatraimpex@gmail.com', 'popupSuccess', 'contactPopupForm')" class="contact-popup-form">
            <input type="hidden" name="_subject" value="New Website Lead — Kawatra Impex">
            <div class="form-group">
              <label for="popupName">Name / Company</label>
              <input type="text" id="popupName" name="name" class="contact-popup-input" placeholder="Enter your name" required data-fs-field>
            </div>
            <div class="form-group">
              <label for="popupEmail">Email Address</label>
              <input type="email" id="popupEmail" name="email" class="contact-popup-input" placeholder="Enter your email" required data-fs-field>
            </div>
            <div class="form-group">
              <label for="popupPhone">Phone Number</label>
              <input type="tel" id="popupPhone" name="phone" class="contact-popup-input" placeholder="e.g. +91 98765 43210" required data-fs-field>
            </div>
            <div class="form-group">
              <label for="popupMessage">Message (Optional)</label>
              <textarea id="popupMessage" name="message" class="contact-popup-input" placeholder="How can we help you?" style="min-height: 80px;" data-fs-field></textarea>
            </div>
            <button type="submit" class="contact-popup-submit" id="popupSubmitBtn" data-fs-submit-btn>Submit Details</button>
            
            <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0;">
              <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">Form not working? Contact us directly:</p>
              <a href="mailto:kawatraimpex@gmail.com?subject=Website Lead — Kawatra Impex" style="color: var(--primary-color); font-weight: 600; text-decoration: none; font-size: 0.85rem;">📧 Send via My Email App (Direct)</a>
            </div>
          </form>
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

  // Contact Popup Form - Natural Submission (standard HTML)
  const form = document.getElementById('contactPopupForm');
  if (form) {
    // Browser handles the POST naturally to formsubmit.co
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

