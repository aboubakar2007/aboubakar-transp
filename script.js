document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(navLinks.classList.contains('active')){
                navLinks.classList.remove('active');
                mobileBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // --- 2. Dark/Light Mode Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('aboubakartransp_theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('aboubakartransp_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Form values
    const bookingForm = document.getElementById('booking-form');
    const b_fullname = document.getElementById('fullname');
    const b_phone = document.getElementById('phone');
    const b_departure = document.getElementById('departure');
    const b_destination = document.getElementById('destination');
    const b_date = document.getElementById('date');
    const b_time = document.getElementById('time');
    const b_passengers = document.getElementById('passengers');

    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload

            // Basic validation: departure !== destination
            if (b_departure.value === b_destination.value) {
                showToast("La ville de départ et d'arrivée doivent être différentes.", "error");
                return;
            }

            // Create booking object
            const bookingData = {
                id: 'AT-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                fullname: b_fullname.value.trim(),
                phone: b_phone.value.trim(),
                departure: b_departure.value,
                destination: b_destination.value,
                date: b_date.value,
                time: b_time.value,
                passengers: b_passengers.value,
                timestamp: new Date().toISOString()
            };

            // Save to LocalStorage
            let bookings = JSON.parse(localStorage.getItem('aboubakartransp_bookings')) || [];
            bookings.push(bookingData);
            localStorage.setItem('aboubakartransp_bookings', JSON.stringify(bookings));

            // Save the current booking ID to correctly show it on the next page
            localStorage.setItem('aboubakartransp_current_ticket', bookingData.id);

            showToast("Réservation effectuée avec succès ! Redirection...", "success");
            
            // Redirect to the ticket page
            setTimeout(() => {
                window.location.href = 'ticket.html';
            }, 800);
        });
    }



    // --- 5. Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Votre message a bien été envoyé. Nous vous répondrons bientôt.", "success");
            contactForm.reset();
        });
    }

    // --- 6. Toast Notification Helper ---
    function showToast(message, type = "success") {
        const container = document.getElementById('toast-container');
        if(!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);

        // Remove toast after 3.5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3500);
    }
});
