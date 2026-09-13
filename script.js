/**
 * SAURABH VIRKAR - PORTFOLIO & CV INTERACTIONS
 * Features:
 * - Dynamic Multi-Phrase Typewriter
 * - Dark / Light Theme Toggle with LocalStorage
 * - IntersectionObserver Scroll Reveal
 * - EmailJS Integration with Loading & Status State
 * - Mobile Navigation Drawer
 */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     1. DYNAMIC TYPEWRITER EFFECT
     ======================================================= */
  const typingElement = document.getElementById("typing");
  const phrases = [
    "Frontend Experiences ⚡",
    "Modern Web Applications 💻",
    "Creative Anime UIs 🎨",
    "Fast, Responsive Websites 🚀"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseBetweenPhrases = 1600;

  function typeCycle() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseBetweenPhrases;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(typeCycle, delay);
  }

  if (typingElement) {
    typeCycle();
  }

  /* =======================================================
     2. THEME TOGGLE (DARK / LIGHT MODE)
     ======================================================= */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Load saved preference or system preference
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    if (themeIcon) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");

      if (isLight) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("portfolio-theme", "light");
      } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("portfolio-theme", "dark");
      }
    });
  }

  /* =======================================================
     3. MOBILE NAVBAR TOGGLE
     ======================================================= */
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });
  }

  /* =======================================================
     4. INTERSECTION OBSERVER FOR SCROLL REVEAL
     ======================================================= */
  const revealElements = document.querySelectorAll(".reveal");
  
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add("active"));
  }

  /* =======================================================
     5. EMAILJS CONTACT FORM SUBMISSION
     ======================================================= */
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnIcon = document.getElementById("btnIcon");
  const formStatus = document.getElementById("formStatus");

  // Initialize EmailJS with your User / Public Key
  if (window.emailjs) {
    emailjs.init("2nIpTKrf_cC9aVyhz");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showStatus("Please fill in all fields before sending.", "error");
        return;
      }

      // UI: Loading State
      submitBtn.disabled = true;
      btnText.textContent = "Sending...";
      btnIcon.className = "fa-solid fa-spinner fa-spin";
      formStatus.textContent = "";

      // Send using configured EmailJS service & template
      if (window.emailjs) {
        emailjs.sendForm("saurabh", "template_d7wnuw8", this)
          .then(() => {
            showStatus("Message sent successfully! I'll get back to you soon. ✅", "success");
            contactForm.reset();
          })
          .catch((error) => {
            console.error("EmailJS Error:", error);
            showStatus("Failed to send message. Please try again or reach out via GitHub! ❌", "error");
          })
          .finally(() => {
            submitBtn.disabled = false;
            btnText.textContent = "Send Message";
            btnIcon.className = "fa-solid fa-paper-plane";
          });
      } else {
        // Mock fallback if offline
        setTimeout(() => {
          showStatus("Message sent successfully! (Preview Mode) ✅", "success");
          contactForm.reset();
          submitBtn.disabled = false;
          btnText.textContent = "Send Message";
          btnIcon.className = "fa-solid fa-paper-plane";
        }, 800);
      }
    });
  }

  function showStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
  }
});
