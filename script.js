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
    }

    /* --- Handle URL Parameters (e.g., ?order=Rice) --- */
    const urlParams = new URLSearchParams(window.location.search);
    const orderItem = urlParams.get('order');
    if (orderItem) {
      // Small delay to ensure any layout transitions are done
      setTimeout(() => {
        if (typeof openOrderModal === 'function') {
          openOrderModal(orderItem);
        }
      }, 500);
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
