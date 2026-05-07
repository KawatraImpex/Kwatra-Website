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

