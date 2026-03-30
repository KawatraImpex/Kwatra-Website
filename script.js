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
