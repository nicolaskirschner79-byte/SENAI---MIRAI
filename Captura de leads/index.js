// =====================================
// FUNDO ANIMADO (mesmo efeito do site principal)
// =====================================

function initCyberCanvasBackground() {

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const canvas = document.createElement('canvas');
    canvas.id = 'cyber-canvas';
    document.body.appendChild(canvas);

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

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createParticles, 200);
    });
}

document.addEventListener('DOMContentLoaded', initCyberCanvasBackground);


// =====================================
// CONFIGURAÇÃO SUPABASE
// =====================================

const SUPABASE_URL = "https://kzmupeaneswnveeohjjt.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6bXVwZWFuZXN3bnZlZW9oamp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NTc2MDIsImV4cCI6MjEwNDIzMzYwMn0.U2irNJz-lySLr_-aHUbfssOSs65vDW6b6iwilLtSALA";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// =====================================
// ELEMENTOS
// =====================================

const form = document.getElementById("contactForm");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const loadingScreen = document.getElementById("loadingScreen");
const progress = document.getElementById("progress");
const percentage = document.getElementById("percentage");
const loadingText = document.getElementById("loadingText");
const submitBtn = document.getElementById("submitBtn");


// =====================================
// MÁSCARA TELEFONE
// =====================================

phone.addEventListener("input", () => {

    let value = phone.value.replace(/\D/g, "");

    value = value.substring(0, 11);


    if (value.length <= 2) {

        value = value.replace(
            /^(\d*)/,
            "($1"
        );

    }

    else if (value.length <= 6) {

        value = value.replace(
            /^(\d{2})(\d*)/,
            "($1) $2"
        );

    }

    else if (value.length <= 10) {

        value = value.replace(
            /^(\d{2})(\d{4})(\d*)/,
            "($1) $2-$3"
        );

    }

    else {

        value = value.replace(
            /^(\d{2})(\d{5})(\d*)/,
            "($1) $2-$3"
        );

    }


    phone.value = value;

});


// =====================================
// ENVIO DO FORMULÁRIO
// =====================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name = document
        .getElementById("name")
        .value
        .trim();


    const phoneValue = phone
        .value
        .trim();


    const email = document
        .getElementById("email")
        .value
        .trim();


    // VALIDAÇÃO DO NOME

    if (name.length < 3) {

        showError("Digite seu nome completo.");

        return;

    }


    // VALIDAÇÃO DO TELEFONE

    const numbers = phoneValue.replace(/\D/g, "");


    if (numbers.length < 10) {

        showError("Digite um número válido.");

        return;

    }


    // VALIDAÇÃO DO EMAIL

    if (email !== "") {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            showError("Digite um e-mail válido.");

            return;

        }

    }


    // DESABILITA BOTÃO

    submitBtn.disabled = true;

    submitBtn.querySelector("span").textContent =
        "SALVANDO...";


    // SALVAR NO SUPABASE

    try {

        const { error } = await supabaseClient
            .from("contatos")
            .insert([
                {
                    nome: name,
                    telefone: phoneValue,
                    email: email || null
                }
            ]);


        if (error) {

            console.error(error);

            showError(
                "Erro ao salvar seus dados. Tente novamente."
            );

            submitBtn.disabled = false;

            submitBtn.querySelector("span").textContent =
                "ENTRAR NO SITE";

            return;

        }


        // SALVAR LOCALMENTE (OPCIONAL)

        localStorage.setItem("mirai_nome", name);
        localStorage.setItem("mirai_telefone", phoneValue);
        localStorage.setItem("mirai_email", email);


        // DADOS SALVOS COM SUCESSO — INICIA O LOADING

        startLoading();


    } catch (error) {

        console.error(error);

        showError(
            "Erro de conexão. Tente novamente."
        );

        submitBtn.disabled = false;

        submitBtn.querySelector("span").textContent =
            "ENTRAR NO SITE";

    }

});


// =====================================
// ERRO
// =====================================

function showError(text) {

    message.textContent = text;

    message.classList.add("show");


    setTimeout(() => {

        message.classList.remove("show");

    }, 4000);

}


// =====================================
// LOADING
// =====================================

function startLoading() {

    loadingScreen.classList.add("active");


    let value = 0;


    const interval = setInterval(() => {

        value++;


        progress.style.width = `${value}%`;

        percentage.textContent = `${value}%`;


        if (value < 20) {

            loadingText.textContent =
                "Inicializando sistema...";

        }

        else if (value < 45) {

            loadingText.textContent =
                "Verificando informações...";

        }

        else if (value < 70) {

            loadingText.textContent =
                "Conectando à plataforma Mirai...";

        }

        else if (value < 90) {

            loadingText.textContent =
                "Preparando sua experiência...";

        }

        else {

            loadingText.textContent =
                "Sistema pronto.";

        }


        if (value >= 100) {

            clearInterval(interval);


            setTimeout(() => {

                window.location.href =
                    "site.html";

            }, 500);

        }

    }, 30);

}