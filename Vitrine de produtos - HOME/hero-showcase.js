/**
 * MIRAI - HERO SHOWCASE
 * Vitrine rotativa da linha de produtos (site.html)
 *
 * A troca de slide é guiada pelo fim da animação CSS da bolinha ativa
 * (evento "animationend"). Por isso, pausar no hover, respeitar
 * "movimento reduzido" e manter tudo sincronizado funciona sem timers.
 */
(function () {
    function initHeroShowcase() {
        const root = document.getElementById('heroShowcase');
        if (!root) return;

        const slides = Array.from(root.querySelectorAll('.showcase-slide'));
        const dots = Array.from(root.querySelectorAll('.showcase-dot'));
        const counter = document.getElementById('showcaseIndex');
        const card = root.querySelector('.showcase-card');
        let current = 0;

        function goTo(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                const active = i === current;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', String(!active));
            });

            dots.forEach((dot, i) => {
                const active = i === current;
                dot.classList.toggle('is-active', active);
                if (active) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });

            if (counter) counter.textContent = String(current + 1).padStart(2, '0');
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });

        // Fim do preenchimento da bolinha = próximo modelo
        root.addEventListener('animationend', (event) => {
            if (event.animationName === 'showcase-fill') goTo(current + 1);
        });

        // Inclinação 3D suave (só com mouse e sem "movimento reduzido")
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isTouch && !reduceMotion && card) {
            root.addEventListener('mousemove', (event) => {
                const rect = root.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
            });

            root.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroShowcase);
    } else {
        initHeroShowcase();
    }
})();
