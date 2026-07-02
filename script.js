document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNavMenu.classList.toggle('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNavMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavMenu.classList.remove('open');
            mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // -------------------------------------------------------------------------
    // 2. Typing Animation Effect in Hero
    // -------------------------------------------------------------------------
    const typingTextElement = document.getElementById('typing-text');
    const titles = ["MERN Stack Developer", "Data Analyst", "CSE Student", "Problem Solver"];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up deletion
        } else {
            typingTextElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Standard typing speed
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000; // Pause at full title
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextElement) {
        setTimeout(type, 1000);
    }

    // -------------------------------------------------------------------------
    // 3. Interactive Canvas Particle Background
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 65;
    const connectionDistance = 110;
    
    // Mouse coords
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
            this.baseColor = Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();
        }

        update() {
            // Screen wrap-around
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse repulsion
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    let alpha = (1 - (dist / connectionDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // -------------------------------------------------------------------------
    // 4. Project Showcase Filters
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    // Animation delay simulation
                    setTimeout(() => card.style.opacity = '1', 50);
                } else if (category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 5. Scroll-Spy Navigation
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold offset for better trigger accuracy
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. Interactive Card Glowing Coordinates
    // -------------------------------------------------------------------------
    const avatarCard = document.querySelector('.avatar-card');
    if (avatarCard) {
        avatarCard.addEventListener('mousemove', (e) => {
            const rect = avatarCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            avatarCard.style.setProperty('--x', `${x}px`);
            avatarCard.style.setProperty('--y', `${y}px`);
        });
    }

    // -------------------------------------------------------------------------
    // 7. Contact Form Submission Handling (Web3Forms API Integration)
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formResponseMsg = document.getElementById('form-response-msg');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate if access key is still default placeholder
            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            if (accessKeyInput && accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
                formResponseMsg.className = 'form-response error';
                formResponseMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Please configure your Web3Forms Access Key in index.html first.`;
                return;
            }

            // Loading UI state
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
            
            const formData = new FormData(contactForm);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formResponseMsg.className = 'form-response success';
                    formResponseMsg.innerHTML = `<i class="fa-regular fa-circle-check"></i> Thank you! Your message has been sent successfully.`;
                    contactForm.reset();
                } else {
                    formResponseMsg.className = 'form-response error';
                    formResponseMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${json.message || "Something went wrong. Please try again."}`;
                }
            })
            .catch(error => {
                console.log(error);
                formResponseMsg.className = 'form-response error';
                formResponseMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Network error. Please check your connection.`;
            })
            .finally(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
                // Clear response message after 5 seconds
                setTimeout(() => {
                    formResponseMsg.innerHTML = '';
                }, 5000);
            });
        });
    }
});
