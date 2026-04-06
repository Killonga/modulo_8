document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar-main');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Seleccionar elementos con getElementById
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');

        // Validar que los campos no estén vacíos
        if (nameField.value.trim() === '' || emailField.value.trim() === '' || messageField.value.trim() === '') {
            formError.textContent = 'Error: Todos los campos son obligatorios.';
            formError.classList.remove('d-none');
            formSuccess.classList.add('d-none');
        } else {
            // Mostrar mensaje de agradecimiento
            formSuccess.innerHTML = '<strong>¡Gracias por contactarnos, ' + nameField.value + '!</strong> Hemos recibido tu mensaje correctamente.';
            formSuccess.classList.remove('d-none');
            formError.classList.add('d-none');
            
            // Opcional: Limpiar el formulario
            contactForm.reset();
        }
    });

    // Smooth Scroll for links (Bootstrap handles some of this, but manual enhancement for offsets)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
});
