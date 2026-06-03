document.addEventListener('DOMContentLoaded', () => {
    
    // MENÚ RESPONSIVO MÓVIL
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });


    // LÓGICA REUTILIZABLE DE CARRUSELES
    function initCarousel(trackId, prevBtnId, nextBtnId, dotsId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !prevBtn || !nextBtn) return;

        const originalCards = Array.from(track.children);
        const originalCount = originalCards.length;
        if (originalCount === 0) return;

        // Clonar tarjetas al inicio y al final para crear un efecto de loop infinito real
        originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
        [...originalCards].reverse().forEach(card => track.prepend(card.cloneNode(true)));

        const cards = track.children;
        let currentIndex = originalCount; // Empezar en la primera tarjeta del set real

        const getVisibleCards = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        };

        const moveCarousel = (transition = true) => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32; 
            
            track.style.transition = transition ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            const amountToMove = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${amountToMove}px)`;

            // Actualizar estado visual de los puntos (dots)
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                const activeIndex = (currentIndex - originalCount + originalCount) % originalCount;
                dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
            }
        };

        // Lógica para saltar entre clones y originales sin que el usuario lo note
        track.addEventListener('transitionend', () => {
            if (currentIndex >= originalCount * 2) {
                currentIndex = originalCount;
                moveCarousel(false);
            } else if (currentIndex < originalCount) {
                currentIndex = (originalCount * 2) - 1;
                moveCarousel(false);
            }
        });

        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < originalCount; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => { 
                    currentIndex = originalCount + i; 
                    moveCarousel(); 
                    resetAutoSlide(); 
                });
                dotsContainer.appendChild(dot);
            }
        };

        const startAutoSlide = () => setInterval(() => {
            currentIndex++;
            moveCarousel();
        }, 4000);

        let autoSlideInterval = startAutoSlide();

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = startAutoSlide();
        };

        nextBtn.addEventListener('click', () => { currentIndex++; moveCarousel(); resetAutoSlide(); });
        prevBtn.addEventListener('click', () => { currentIndex--; moveCarousel(); resetAutoSlide(); });
        window.addEventListener('resize', () => { moveCarousel(false); });

        createDots();
        moveCarousel(false); // Posicionar inicialmente sin transición
    }

    // Inicializar carruseles
    initCarousel('clientTrack', 'clientPrev', 'clientNext', 'clientDots');
    initCarousel('personalTrack', 'personalPrev', 'personalNext', 'personalDots');
    initCarousel('servicesTrack', 'servicesPrev', 'servicesNext', 'serviceDots');


    // ENVÍO DEL FORMULARIO DE CONTACTO ÁGIL
    const contactForm = document.getElementById('contactForm');
    const btnSubmit = contactForm.querySelector('.btn-submit');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando...';

        try {
            // REEMPLAZA 'TU_ID_DE_FORMSPREE' con el ID que te proporcione Formspree.io
            const response = await fetch('https://formspree.io/f/xvzyeaee', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('¡Gracias por contactarme! Tu mensaje ha sido enviado con éxito.');
                contactForm.reset();
            } else {
                alert('Ups! Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
            }
        } catch (error) {
            alert('Error de red. Por favor, verifica tu conexión.');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Enviar Mensaje';
        }
    });

    // FUNCIONALIDAD DE LIGHTBOX (VER IMAGEN EN GRANDE)
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imgFull');
    const closeBtn = document.querySelector('.close-modal');

    // Seleccionar todas las imágenes de servicios y proyectos
    const clickableImages = document.querySelectorAll('.service-image img, .card-image img');

    clickableImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden'; // Evita el scroll mientras está abierto
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura el scroll
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
});