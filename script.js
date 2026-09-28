/**
 * MIRAI ELÉTRICOS - CORE SCRIPT & CYBERNETIC ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    initMobileNav();
    initCyberCanvasBackground();
    initTypewriterEffect();
    init3dTiltEffect();
    initScrollReveal();
    initNavbarScroll();
    initScrollProgressBar();
    initFooterYear();
    initTrustCounters();
    initReviewLikeButtons();
    initProductFilter();
});

/* ==========================================================
   1. INICIALIZAÇÃO DE ÍCONES
   ========================================================== */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* ==========================================================
   2. CONTROLE DA BOTTOM NAV (MOBILE)
   ========================================================== */
function initMobileNav() {
    const mobileLinks = document.querySelectorAll('.mobile-bottom-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================
   3. BACKGROUND INTERATIVO: MALHA NEON / PARTÍCULAS
   ========================================================== */
function initCyberCanvasBackground() {
    // Em telas de toque não há cursor de mouse, então reduzimos o custo
    // e evitamos travar dispositivos mais fracos.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const canvas = document.createElement('canvas');
    canvas.id = 'cyber-canvas';
    document.body.appendChild(canvas);

    // Estilização direta via JS para garantir cobertura total
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '-1',
        opacity: '0.4'
    });

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    if (!isTouch) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Interação com o mouse (apenas em dispositivos com mouse)
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * 2;
                    this.y -= Math.sin(angle) * 2;
                }
            }
        }

        draw() {
            ctx.fillStyle = '#00FF66';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Popula o array de partículas conforme a densidade da tela
    // (menos partículas em telas pequenas/dispositivos móveis)
    function createParticles() {
        particles = [];
        const divisor = isTouch ? 22000 : 12000;
        const count = Math.floor((width * height) / divisor);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Desenha linhas conectando partículas próximas
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(0, 255, 102, ${1 - dist / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    // Recria as partículas com a densidade certa ao redimensionar/rotacionar a tela
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createParticles, 200);
    });
}

/* ==========================================================
   4. EFEITO DE DIGITAÇÃO (TYPEWRITER)
   ==========================================================

   Antes, o efeito era do tipo "decodificação Matrix" e disparava
   a cada passada do mouse (mouseover) sobre o título — repetindo
   sem parar, e ainda com um bug: como usava innerText, na primeira
   passada ele destruía o <span class="neon-text"> interno (a
   palavra em verde), que nunca mais voltava a ficar colorida.

   Agora o efeito é de "digitação" (estilo terminal, com cursor
   piscando) e dispara UMA ÚNICA VEZ por carregamento de página,
   no momento em que o título entra na tela ao rolar (mesmo padrão
   do scroll-reveal dos cards, via IntersectionObserver + unobserve).
   A estrutura interna do título (como a palavra destacada em
   .neon-text) é preservada durante a digitação.
   ========================================================== */
function initTypewriterEffect() {
    const targets = document.querySelectorAll('.section-title, .hero-title');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    targets.forEach(el => observer.observe(el));
}

// Converte o conteúdo do título em uma lista de "unidades" (1 por
// caractere), guardando a classe do elemento em que cada caractere
// estava (ex.: "neon-text"), para poder reconstruir a formatação
// original enquanto o texto é digitado aos poucos.
function parseTypedUnits(element) {
    const units = [];

    function walk(node, cls) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const ch of node.textContent) units.push({ ch, cls });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const nodeCls = node.className ? node.className : cls;
            node.childNodes.forEach(child => walk(child, nodeCls));
        }
    }

    element.childNodes.forEach(child => walk(child, null));
    return units;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Reconstrói o HTML apenas com os primeiros "count" caracteres já
// digitados, reagrupando caracteres consecutivos da mesma classe
// dentro do mesmo <span>, para restaurar o destaque em neon.
function renderTypedUnits(units, count) {
    let html = '';
    let i = 0;
    while (i < count) {
        const cls = units[i].cls;
        let chunk = '';
        while (i < count && units[i].cls === cls) {
            chunk += escapeHtml(units[i].ch);
            i++;
        }
        html += cls ? `<span class="${cls}">${chunk}</span>` : chunk;
    }
    return html;
}

function typeElement(element) {
    const units = parseTypedUnits(element);
    const total = units.length;
    if (!total) return;

    element.innerHTML = '<span class="type-text"></span><span class="type-caret"></span>';
    const textEl = element.querySelector('.type-text');
    const caret = element.querySelector('.type-caret');

    let i = 0;
    const caretBlink = setInterval(() => {
        caret.style.opacity = caret.style.opacity === '0' ? '1' : '0';
    }, 500);

    const typer = setInterval(() => {
        i++;
        textEl.innerHTML = renderTypedUnits(units, i);

        if (i >= total) {
            clearInterval(typer);
            // Deixa o cursor piscando um pouco mais (efeito terminal)
            // e então some suavemente, sem ficar piscando para sempre.
            setTimeout(() => {
                clearInterval(caretBlink);
                caret.style.transition = 'opacity 0.4s ease';
                caret.style.opacity = '0';
                setTimeout(() => caret.remove(), 400);
            }, 1200);
        }
    }, 45);
}

/* ==========================================================
   5. EFEITO TILT 3D INTERATIVO NOS CARDS
   ========================================================== */
function init3dTiltEffect() {
    // Em telas de toque não existe "mousemove" contínuo, então o efeito
    // é ignorado para não deixar os cards "travados" em ângulo após o toque.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const cards = document.querySelectorAll('.card, .hero-card-preview');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/* ==========================================================
   6. ANIMAÇÃO DE REVELAÇÃO AO ROLAR A PÁGINA (SCROLL REVEAL)
   ==========================================================

   CORREÇÃO APLICADA:
   Antes, o efeito era aplicado em "section, .card" ao mesmo tempo.
   Isso deixava a <section> inteira com opacity: 0 até que 15% da
   PRÓPRIA seção estivesse visível na tela. No celular, o grid de
   produtos vira 1 coluna e a seção fica extremamente alta (muitos
   cards empilhados), então esses 15% quase nunca eram atingidos —
   e como os .card ficam DENTRO dessa section com opacity 0, eles
   nunca apareciam, mesmo que o observer já tivesse "revelado" cada
   card individualmente. Resultado: página parecia vazia no mobile.

   Agora o efeito é aplicado somente nos elementos de conteúdo
   (.card), nunca na <section> como um todo. Também paramos de
   observar o elemento assim que ele aparece (unobserve), o que
   evita reprocessamento desnecessário ao rolar a página.
   ========================================================== */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Removido "section" da seleção — só os cards recebem o fade/translate.
    const revealElements = document.querySelectorAll('.card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

/* ==========================================================
   7. NAVBAR REATIVA AO SCROLL
   ========================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================
   8. BARRA DE PROGRESSO NEON (SCROLL)
   ========================================================== */
function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        progressBar.style.width = scrolled + '%';
    });
}

/* ==========================================================
   9. ANO ATUAL NO FOOTER
   ========================================================== */
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* ==========================================================
   10. CONTADORES ANIMADOS DA BARRA DE CONFIANÇA (AVALIAÇÕES)
   ========================================================== */
function initTrustCounters() {
    const counters = document.querySelectorAll('.trust-bar .counter');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1400;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // easeOutQuad para uma desaceleração suave e "high-tech"
            const eased = 1 - (1 - progress) * (1 - progress);
            const value = target * eased;
            el.textContent = value.toFixed(decimals);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toFixed(decimals);
            }
        }

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================
   11. BOTÃO "GOSTEI" NOS CARDS DE AVALIAÇÃO (FEEDBACK VISUAL)
   ========================================================== */
function initReviewLikeButtons() {
    document.querySelectorAll('.review-action-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        const isLike = icon && icon.dataset.lucide === 'thumbs-up';
        if (!isLike) return;

        btn.addEventListener('click', () => {
            btn.classList.toggle('is-liked');
            btn.style.color = btn.classList.contains('is-liked') ? 'var(--neon-green)' : '';
        });
    });
}

/* ==========================================================
   12. FILTRO DE PRODUTOS POR CATEGORIA
   ==========================================================

   Cada botão da barra ".product-filters" tem um atributo
   data-filter ("todos", "scooter", "moto", "triciclo") e cada
   card de produto tem um atributo data-category correspondente.

   Ao clicar num filtro:
   - marca o botão clicado como .active (visual) e aria-selected
   - esconde (hidden) todo card cujo data-category não bate com
     o filtro escolhido, exceto quando o filtro é "todos"

   Usar o atributo "hidden" em vez de manipular display via JS
   deixa a regra de CSS "#produtos .card[hidden]" no controle do
   layout, e funciona tanto no grid de 1 coluna (desktop) quanto
   no grid de 2 colunas (mobile), sem gerar espaços vazios.
   ========================================================== */
function initProductFilter() {
    const filterBar = document.querySelector('.product-filters');
    if (!filterBar) return;

    const chips = Array.from(filterBar.querySelectorAll('.filter-chip'));
    const cards = Array.from(document.querySelectorAll('#produtos .card[data-category]'));

    function applyFilter(filter) {
        const visibleCards = [];

        cards.forEach(card => {
            const matches = filter === 'todos' || card.dataset.category === filter;
            card.hidden = !matches;
            if (matches) visibleCards.push(card);
        });

        // No grid mobile o número de colunas é fixo em 2 (ver CSS). Se o
        // filtro deixar só 1 card visível (ex.: "Triciclos & Cargo", que
        // hoje tem um único produto), esse card ficaria preso na 1ª coluna
        // ocupando só metade da largura da tela, com a outra metade vazia
        // — dando a impressão de estar cortado. Por isso, quando sobra
        // exatamente 1 resultado, ele passa a ocupar a linha inteira.
        cards.forEach(card => card.classList.remove('span-full'));
        if (visibleCards.length === 1) {
            visibleCards[0].classList.add('span-full');
        }

        // Garantia extra: se o card ainda não tinha sido "revelado" pelo
        // scroll-reveal (observer nunca chegou a interceptar esse elemento
        // porque ele estava fora da tela), força a exibição completa assim
        // que ele aparece via filtro, para não parecer cortado/transparente.
        visibleCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-selected', 'false');
            });

            chip.classList.add('active');
            chip.setAttribute('aria-selected', 'true');

            applyFilter(chip.dataset.filter);
        });
    });
}