document.addEventListener('DOMContentLoaded', () => {
    // Forzar el inicio en la parte superior y limpiar hashes en la URL
    if (window.location.hash) {
        history.replaceState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Scroll Animation Observer (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .fade-in');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Countdown Timer
    const countDownDate = new Date("Apr 11, 2026 19:30:00").getTime();
    
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        let elDays = document.getElementById("cd-days");
        if(elDays) {
            elDays.innerHTML = days < 10 ? "0" + days : days;
            document.getElementById("cd-hours").innerHTML = hours < 10 ? "0" + hours : hours;
            document.getElementById("cd-minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("cd-seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
        }
        
        if (distance < 0) {
            clearInterval(x);
            if(elDays) {
                elDays.innerHTML = "00";
                document.getElementById("cd-hours").innerHTML = "00";
                document.getElementById("cd-minutes").innerHTML = "00";
                document.getElementById("cd-seconds").innerHTML = "00";
            }
        }
    }, 1000);
    
    // Audio Player Logic
    const audioBtn = document.getElementById('audio-control');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    
    if (audioBtn && bgMusic) {
        audioBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                audioBtn.classList.remove('playing');
                isPlaying = false;
            } else {
                bgMusic.play();
                audioBtn.classList.add('playing');
                isPlaying = true;
            }
        });
        
        
        // Envelope Interaction
        const envelopeWrapper = document.getElementById('envelope-wrapper');
        const envelope = document.getElementById('envelope');
        
        if (envelope && envelopeWrapper) {
            // Escuchar el clic sobre cualquier punto del Wrapper para mayor facilidad táctil
            envelopeWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (envelopeWrapper.classList.contains('opened')) return;

                // Asegurar que estamos en la cima antes de abrir
                window.scrollTo(0, 0);

                envelope.classList.add('open');
                envelopeWrapper.classList.add('opened');
                
                // Permitir el scroll al destapar
                setTimeout(() => {
                    document.body.classList.remove('no-scroll');
                    window.scrollTo(0, 0); // Reasegurar vista al Hero
                }, 800);
                
                // Play music on interaction automatically
                if (!isPlaying) {
                    bgMusic.play().then(() => {
                        audioBtn.classList.add('playing');
                        isPlaying = true;
                    }).catch(err => console.log("Can't play audio:", err));
                }
            });
        }
        
        // Auto-play fallback on interaction
        document.body.addEventListener('click', () => {
            if (!isPlaying && envelopeWrapper.classList.contains('opened')) {
                bgMusic.play().then(() => {
                    audioBtn.classList.add('playing');
                    isPlaying = true;
                }).catch(e => {});
            }
        }, { once: true });
    }

    // WhatsApp RSVP Logic
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('rsvp-name').value;
            const status = document.getElementById('rsvp-status').value;
            const guests = document.getElementById('rsvp-guests').value || '0';
            const message = document.getElementById('rsvp-message').value;

            const attendanceText = status === 'si' ? 'Confirmo mi asistencia ✅' : 'Lamentablemente no podré asistir ❌';
            
            let whatsappMessage = `¡Hola! Soy *${name}*.\n\n${attendanceText}\n`;
            
            if (status === 'si') {
                whatsappMessage += `Iré con *${guests}* acompañante(s).\n`;
            }
            
            if (message) {
                whatsappMessage += `\nMensaje: _${message}_`;
            }

            const phoneNumber = "528115340356";
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

            // Redirigir a WhatsApp (usar location.href para evitar bloqueadores de popups)
            window.location.href = whatsappUrl;
        });
    }
});
