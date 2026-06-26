// portfolio.js - All JavaScript consolidated with proper structure

// Wait for DOM and all scripts to be ready
function initializePortfolio() {
    // ========== HERO COUNTER ==========
    gsap.from("#hero-counter", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out"
    });

    const counterEl = document.getElementById("hero-counter");
    if (counterEl) {
        let countData = { value: 0 };
        gsap.to(countData, {
            value: 120,
            duration: 5,
            delay: 0.9,
            ease: "power4.out",
            onUpdate: () => {
                counterEl.textContent = Math.floor(countData.value);
            }
        });
    }

    // ========== SCROLL COUNTERS ==========
    const counters = document.querySelectorAll(".counter");
    if (counters.length > 0) {
        const startCounter = (el) => {
            const target = parseFloat(el.getAttribute("data-target"));
            gsap.fromTo(el,
                { innerHTML: 0 },
                {
                    innerHTML: target,
                    duration: 2.5,
                    ease: "power4.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        el.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                }
            );
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ========== ANIMATED TEXT (Create/Studio) ==========
    const createElement = document.querySelector('.word-create');
    const studioElement = document.querySelector('.word-studio');

    if (createElement && studioElement) {
        createElement.textContent = 'Front-End';
        studioElement.textContent = 'Developer';

        const createDuration = 2 + ('Create'.length * 0.2);
        const studioDuration = 2 + ('Studio'.length * 0.2);

        createElement.style.animation = `typing ${createDuration}s steps(${'Create'.length}) infinite`;
        studioElement.style.animation = `typing ${studioDuration}s steps(${'Studio'.length}) infinite ${createDuration / 2}s`;

        const totalDuration = createDuration + studioDuration + 1;
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.animation = `blink 1s infinite, pause ${totalDuration}s infinite`;
        }

        // Add custom keyframe for pause
        if (!document.querySelector('#pause-animation-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'pause-animation-style';
            styleSheet.textContent = `
                @keyframes pause {
                    0%, 40% { opacity: 1; }
                    41%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    // ========== WORD HIGHLIGHT ==========
    const words = document.querySelectorAll('.word');
    if (words.length > 0) {
        let currentIndex = 0;
        function highlightNextWord() {
            words.forEach(word => word.classList.remove('highlight'));

            if (currentIndex < words.length) {
                words[currentIndex].classList.add('highlight');
                currentIndex++;
            } else {
                currentIndex = 0;
                words[currentIndex].classList.add('highlight');
                currentIndex++;
            }
        }

        highlightNextWord();
        setInterval(highlightNextWord, 800);
    }

    // ========== LENIS SMOOTH SCROLL ==========
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // ScrollTo links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }

    // ========== MENU TOGGLE ==========
    let menuOpen = false;
    window.toggleMenu = function () {
        const overlay = document.getElementById('menu-overlay');
        const l1 = document.getElementById('line1');
        const l2 = document.getElementById('line2');

        if (!overlay || !l1 || !l2) return;

        menuOpen = !menuOpen;
        overlay.classList.toggle('active');

        if (menuOpen) {
            gsap.to(l1, { rotation: 45, y: 3.5, width: "32px", duration: 0.4 });
            gsap.to(l2, { rotation: -45, y: -3.5, width: "32px", duration: 0.4 });
        } else {
            gsap.to(l1, { rotation: 0, y: 0, width: "32px", duration: 0.4 });
            gsap.to(l2, { rotation: 0, y: 0, width: "20px", duration: 0.4 });
        }
    }

    // ========== SCROLLTRIGGER ANIMATIONS ==========
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Progress bar (vertical)
        gsap.to("#scroll-progress-bar", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });

        // Reveal animations
        document.querySelectorAll('.reveal').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%"
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        });

        // ABOUT section timeline (from index.html 500-534)
        const aboutSection = document.querySelector("#about");
        if (aboutSection) {
            const tlAbout = gsap.timeline({
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });

            tlAbout
                .from(".reveal-text", {
                    y: 100,
                    rotate: 5,
                    duration: 1.2,
                    ease: "expo.out"
                })
                .from(".about-p", {
                    opacity: 0,
                    x: -30,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.8")
                .from(".main-card", {
                    clipPath: "inset(100% 0% 0% 0%)",
                    duration: 1.5,
                    ease: "expo.inOut"
                }, "-=1.2")
                .from(".logo-circle", {
                    scale: 0,
                    rotation: 360,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=0.5");
        }

        // Circular scroll progress (#progress-circle / #scroll-percentage)
        const progressCircle = document.getElementById('progress-circle');
        const percentageText = document.getElementById('scroll-percentage');
        if (progressCircle && percentageText) {
            const totalLength = 251.2;

            gsap.to({}, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const percentage = Math.round(progress * 100);

                        percentageText.innerText = `${percentage}%`;

                        const offset = totalLength - (progress * totalLength);
                        progressCircle.style.strokeDashoffset = offset;
                    }
                }
            });
        }
    }

    // ========== ABOUT PARTICLE CANVAS BACKGROUND ==========
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas && particleCanvas.getContext) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];

        function initParticles() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * particleCanvas.width,
                    y: Math.random() * particleCanvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 150) {
                        ctx.lineWidth = 1 - dist / 150;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', initParticles);
    }

    // ========== CUSTOM CURSOR ==========
    const cursor = document.getElementById('cursor');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
        });
    }

    // ========== PRELOADER ==========
    window.addEventListener('load', () => {
        const tl = gsap.timeline();
        tl.to("#loader-fill", { width: "100%", duration: 1 })
            .to("#loader", { yPercent: -100, duration: 1.9, ease: "expo.inOut" })
            .from("#hero-title", {
                opacity: 0,
                y: 100,
                duration: 1.2,
                ease: "expo.out"
            }, "-=0.2");
    });
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Register GSAP plugins if available
if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
if (typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
}

ScrollTrigger.normalizeScroll(true);

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const answer = item.querySelector('.faq-answer');
        const iconV = item.querySelector('.faq-icon-v');
        let isOpen = false;

        item.addEventListener('click', () => {
            if (!isOpen) {
                // Open Animation
                gsap.to(answer, {
                    height: "auto",
                    opacity: 1,
                    duration: 0.6,
                    ease: "expo.out",
                    paddingBottom: "20px"
                });
                gsap.to(iconV, { rotation: 90, opacity: 0, duration: 0.4 });
                isOpen = true;
            } else {
                // Close Animation
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                });
                gsap.to(iconV, { rotation: 0, opacity: 1, duration: 0.4 });
                isOpen = false;
            }
        });
    });

    // Reveal Image on Scroll
    gsap.from(".reveal-img", {
        scrollTrigger: {
            trigger: ".reveal-img",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.5,
        ease: "expo.out"
    });
});

// Register GSAP
gsap.registerPlugin();

const links = document.querySelectorAll('.service-link');
const allImages = document.querySelectorAll('.service-imgs');

links.forEach(link => {
    const serviceType = link.getAttribute('data-service');
    const targetImages = document.querySelectorAll(`.service-imgs.${serviceType}`);

    link.addEventListener('mouseenter', () => {
        // Hide other images
        gsap.to(allImages, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" });

        // Show specific service images with a "pop"
        gsap.to(targetImages, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            // Add a slight random rotation for the organic look
            rotation: () => Math.random() * 10 - 5
        });
    });

    link.addEventListener('mouseleave', () => {
        // Fade all back to ghost state
        gsap.to(targetImages, {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.inOut"
        });
    });

    // Optional: Follow Mouse movement
    link.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(targetImages, {
            x: xPos,
            y: yPos,
            duration: 1,
            ease: "power3.out"
        });
    });
});

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // 1. Text Splitting & Reveal
    const textElement = document.querySelector('#animate-text');
    const textContent = textElement.textContent.trim();
    const words = textContent.split(' ');

    // Clear and rebuild with spans for character control
    textElement.innerHTML = words.map(word => {
        return `<span class="inline-block overflow-hidden">
            ${word.split('').map(char => `<span class="char inline-block">${char}</span>`).join('')}
        </span>`;
    }).join(' ');

    // GSAP Timeline for the reveal
    gsap.from(".char", {
        scrollTrigger: {
            trigger: "#animate-text",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 150,
        stagger: 0.02,
        duration: 1,
        ease: "expo.out",
        rotation: 10,
        opacity: 0
    });

    // 2. Magnetic Button Animation
    const btn = document.querySelector('#magnetic-btn');

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });

    // 3. Background Subtle Pulse
    gsap.to(".bg-\\[\\#0a0a0a\\]", {
        backgroundColor: "#111111",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});

gsap.utils.toArray(".experience-item").forEach(item => {
    const tl = gsap.timeline({ paused: true });

    tl.to(item, {
        y: -6,
        duration: 0.3,
        ease: "power3.out"
    })
        .to(item, {
            boxShadow: "0 25px 40px rgba(0,0,0,0.45)",
            borderColor: "#ff98007d",
            duration: 0.3,
            ease: "power3.out"
        }, 0);

    item.addEventListener("mouseenter", () => tl.play());
    item.addEventListener("mouseleave", () => tl.reverse());
});


gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Staggered reveal for cards
    gsap.from(".skill-card", {
        scrollTrigger: {
            trigger: "#skills-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1, // Delays each card by 0.1s
        ease: "back.out(1.7)" // Premium spring motion
    });

    // Hover tilt effect (Optional Premium Touch)
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -10, borderColor: "#ff9800", duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, borderColor: "#27272a", duration: 0.3 });
        });
    });
});


gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // 1. Header Reveal
    gsap.from(".reveal-container h2", {
        scrollTrigger: {
            trigger: "#our-work",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        skewY: 7
    });

    // 2. Card Stagger Animation
    gsap.from(".work-card", {
        scrollTrigger: {
            trigger: "#our-work",
            start: "top 85%",
        },
        y: 150,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "expo.out"
    });

    // 3. Magnetic Hover for the Read More button
    const cards = document.querySelectorAll('.work-card');
    cards.forEach(card => {
        const icon = card.querySelector('.w-12');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(icon, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 4. Simple auto-play carousel (no scroll trigger)
    const carousel = document.querySelector("#work-carousel");
    const workCards = gsap.utils.toArray("#work-carousel .work-card");

    if (carousel && workCards.length > 1) {
        let currentIndex = 0;

        const getShift = () => {
            // Match the flex basis in CSS: ~60–80vw depending on screen
            const baseWidth = window.innerWidth >= 1024
                ? window.innerWidth * 0.6
                : window.innerWidth * 0.8;
            return baseWidth * currentIndex;
        };

        const goToSlide = (index) => {
            currentIndex = index;
            gsap.to(carousel, {
                x: -getShift(),
                duration: 1,
                ease: "power3.inOut"
            });
        };

        setInterval(() => {
            const nextIndex = (currentIndex + 1) % workCards.length;
            goToSlide(nextIndex);
        }, 3500);

        window.addEventListener("resize", () => {
            // Keep the active slide centered on resize
            gsap.set(carousel, { x: -getShift() });
        });
    }
});

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // 1. Split Text Reveal Animation
    gsap.from(".contact-title", {
        y: 200,
        opacity: 0,
        skewY: 10,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "#contact-page",
            start: "top 80%"
        }
    });

    // 2. Staggered Form & Info Reveal
    gsap.from(".form-group, .info-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#contact-form",
            start: "top 85%"
        }
    });

    // 3. Magnetic Button Effect
    const btn = document.querySelector('.magnetic-btn');
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.5;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.5;

        gsap.to(btn, {
            x: x,
            y: y,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {

        gsap.to(contactForm, {
            x: 10,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: () => gsap.set(contactForm, { x: 0 })
        });

        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!input.value) {
                gsap.to(input.parentElement, {
                    borderColor: "#ef4444",
                    duration: 0.3
                });
            }
        });

        return;
    }

    const btn = contactForm.querySelector('button');

    btn.disabled = true;

    btn.innerHTML = "<span class='relative z-10'>Sending...</span>";

    const formData = new FormData(contactForm);

    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (result.success) {

        gsap.to(btn, {
            scale: 0.9,
            backgroundColor: "#22c55e",
            duration: 0.3
        });

        btn.innerHTML = "<span class='relative z-10'>Message Sent ✓</span>";

        contactForm.reset();

    } else {

        gsap.to(btn, {
            backgroundColor: "#ef4444",
            duration: 0.3
        });

        btn.innerHTML = "<span class='relative z-10'>Failed!</span>";

        console.log(result);

    }

    setTimeout(() => {

        btn.disabled = false;

        btn.innerHTML = `
            <span class="relative z-10">Submit Now</span>
            <div class="relative z-10 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                →
            </div>
        `;

        gsap.to(btn,{
            scale:1,
            backgroundColor:"#ff9800",
            duration:.3
        });

    },3000);

});

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#project-showcase",
            start: "top 70%",
        }
    });

    // 1. Title Slide-Up
    tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        skewY: 7,
        duration: 1.2,
        ease: "power4.out"
    });

    // 2. Image Reveal (Zoom-out effect)
    tl.to(".main-img", {
        scale: 1,
        duration: 1.5,
        ease: "power2.inOut"
    }, "-=0.8");

    // 3. Metadata Bar Stagger
    tl.from(".metadata-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=1");

    // 4. Content Block Reveal
    gsap.from(".content-block", {
        scrollTrigger: {
            trigger: ".content-block",
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });
});

// ===========================
// WORK PAGE SCROLL ANIMATIONS
// ===========================
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Hero header (Selected Projects / Our Work Archive)
    const workHeader = document.querySelector(".work-header");
    if (workHeader) {
        const tlWorkHeader = gsap.timeline({
            scrollTrigger: {
                trigger: workHeader,
                start: "top 80%",
            }
        });

        tlWorkHeader
            .from(".work-subtext", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .from(".work-title-line", {
                yPercent: 100,
                opacity: 0,
                skewY: 8,
                duration: 1,
                stagger: 0.12,
                ease: "power4.out"
            }, "-=0.3");
    }

    // Project showcase hero image + text (top block)
    const showcaseSection = document.querySelector("#project-showcase");
    if (showcaseSection) {
        gsap.from("#project-showcase .hero-title", {
            scrollTrigger: {
                trigger: showcaseSection,
                start: "top 75%",
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from("#project-showcase p", {
            scrollTrigger: {
                trigger: showcaseSection,
                start: "top 70%",
            },
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out"
        });

        gsap.from("#project-showcase .project-image-container", {
            scrollTrigger: {
                trigger: "#project-showcase .project-image-container",
                start: "top 75%",
            },
            scale: 1.15,
            y: 40,
            opacity: 0,
            duration: 1.3,
            ease: "expo.out"
        });

        gsap.from("#project-showcase .metadata-item", {
            scrollTrigger: {
                trigger: "#project-showcase .metadata-item",
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12
        });
    }

    // Project detail section (Process + images)
    const processSection = document.querySelector("#project-detail");
    if (processSection) {
        gsap.utils.toArray("#project-detail .reveal-up").forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        gsap.utils.toArray("#project-detail .reveal-img").forEach(img => {
            gsap.from(img, {
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                },
                y: 40,
                opacity: 0,
                scale: 1.1,
                duration: 1.1,
                ease: "expo.out"
            });
        });
    }

    // Main hero in WORK page (Modern Portfolio section)
    const mainHero = document.querySelector("main .hero-title");
    const heroImageContainer = document.querySelector(".hero-image-container");
    if (mainHero && heroImageContainer) {
        const tlMainHero = gsap.timeline({
            scrollTrigger: {
                trigger: mainHero.closest("section"),
                start: "top 80%",
            }
        });

        tlMainHero
            .from(mainHero, {
                y: 100,
                opacity: 0,
                duration: 1.1,
                ease: "power4.out",
                skewY: 6
            })
            .from(heroImageContainer, {
                y: 60,
                opacity: 0,
                scale: 1.1,
                duration: 1.2,
                ease: "expo.out"
            }, "-=0.7");
    }

    // Meta info bar under main hero
    gsap.utils.toArray(".meta-item").forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        });
    });

    // Process section (The Process text + image)
    const processText = document.querySelector(".process-text");
    const processImage = document.querySelector(".reveal-image");
    if (processText && processImage) {
        const tlProcess = gsap.timeline({
            scrollTrigger: {
                trigger: processText.closest("section"),
                start: "top 80%",
            }
        });

        tlProcess
            .from(processText, {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
            .from(processImage, {
                y: 60,
                opacity: 0,
                scale: 1.05,
                duration: 1.1,
                ease: "expo.out"
            }, "-=0.6");
    }

    // Related work cards
    gsap.utils.toArray(".related-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
            },
            y: 70,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        });
    });
});


