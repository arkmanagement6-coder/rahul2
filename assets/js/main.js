document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Sticky Header on Scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      // Toggle menu icon
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (isActive) {
          icon.classList.remove('lucide-menu');
          icon.classList.add('lucide-x');
        } else {
          icon.classList.remove('lucide-x');
          icon.classList.add('lucide-menu');
        }
      }
    });
  }

  // Active Nav Link based on URL
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Slider / Carousel Logic
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (sliderWrapper && dotsContainer) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoPlayInterval;

    // Generate Dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
      currentSlide = index;
      sliderWrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % totalSlides;
        goToSlide(nextSlide);
      }, 5000); // Change slide every 5 seconds
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // Statistics Counter Animation (Scroll triggered)
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.5
    };

    const countUp = (element) => {
      const target = +element.getAttribute('data-target');
      const suffix = element.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = 100; // lower is slower, higher is faster
      const increment = Math.ceil(target / speed);
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          element.innerText = count + suffix;
          setTimeout(updateCount, 15);
        } else {
          element.innerText = target + suffix;
        }
      };
      
      updateCount();
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
  }

  // FAQ Accordion
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Client Side Form Validation & Success Modal
  const inquiryForm = document.getElementById('inquiryForm');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (inquiryForm && modalOverlay) {
    
    // Custom Validator on inputs
    const inputs = inquiryForm.querySelectorAll('.form-control[required]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
      });
    });

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Show success modal popup
        modalOverlay.classList.add('active');
        inquiryForm.reset();
      }
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
      });
    }

    // Close modal clicking outside
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  function validateField(input) {
    const errorEl = document.getElementById(`${input.id}Error`);
    if (!errorEl) return true;

    let valid = true;
    let message = '';

    if (input.value.trim() === '') {
      valid = false;
      message = 'This field is required.';
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        valid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (input.id === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(input.value)) {
        valid = false;
        message = 'Please enter a valid 10-digit Indian phone number.';
      }
    }

    if (!valid) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      input.style.borderColor = '#DC2626';
    } else {
      errorEl.style.display = 'none';
      input.style.borderColor = 'rgba(0, 87, 255, 0.15)';
    }

    return valid;
  }
});
