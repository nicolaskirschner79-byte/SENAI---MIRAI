/* ===== DADOS DOS PRODUTOS ===== */

const WA = '5515998456556';

const P = [
  {
    n: 'Mirai X-13',
    c: 'scooter',
    img: 'Mirai X-13 (2).jpg',
    a: '45-50 km',
    v: '32 km/h',
    x: '4-6 h',
    xl: 'Carga',
    tag: 'Mais procurada'
  },
  {
    n: 'Mirai Sport',
    c: 'scooter',
    img: 'mirai sport (2).jpg',
    a: '50 km',
    v: '32 km/h',
    x: '5-7 h',
    xl: 'Carga'
  },
  {
    n: 'Mirai Veloster Apollo',
    c: 'scooter',
    img: 'mirai veloster apollo (2).jpg',
    a: '50-60 km',
    v: '32 km/h',
    x: '5-7 h',
    xl: 'Carga'
  },
  {
    n: 'Mirai Scooter Pixxel',
    c: 'scooter',
    img: 'Mirai Scooter Pixxel (2).jpg',
    a: '60-67 km',
    v: '1000 W',
    x: '180 kg',
    xl: 'Suporta',
    vl: 'Potência'
  },
  {
    n: 'Mirai ZX6',
    c: 'moto',
    img: 'Mirai ZX6 (2).jpg',
    a: '60-65 km',
    v: '1000 W',
    x: '170 kg',
    xl: 'Suporta',
    vl: 'Potência',
    tag: 'Maior autonomia'
  },
  {
    n: 'Mirai Capri',
    c: 'moto',
    img: 'Mirai Capri (2).jpg',
    a: '55-60 km',
    v: '1000 W',
    x: '170 kg',
    xl: 'Suporta',
    vl: 'Potência'
  },
  {
    n: 'Mirai A4',
    c: 'moto',
    img: 'Mirai A4 (2).jpg',
    a: '55 km',
    v: '1000 W',
    x: '160 kg',
    xl: 'Suporta',
    vl: 'Potência'
  },
  {
    n: 'Mirai Triciclo Lupy',
    c: 'triciclo',
    img: 'Mirai ZX6 (2).jpg',
    a: '40-45 km',
    v: '1000 W',
    x: '3 lugares',
    xl: 'Capacidade',
    vl: 'Potência',
    tag: 'Família'
  }
];

const K = {
  scooter: 'Scooter elétrica',
  moto: 'Moto elétrica',
  triciclo: 'Triciclo elétrico'
};

const $ = selector => document.querySelector(selector);

const wa = texto =>
  `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;


/* ===== RENDERIZAÇÃO DOS PRODUTOS ===== */

$('#grid').innerHTML = P.map(p => `
  <article class="card" data-c="${p.c}">
    <div class="ph">
      <img
        src="assets/${encodeURI(p.img)}"
        alt="${p.n}"
        loading="lazy"
        onerror="this.remove()"
      >

      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
    </div>

    <div class="cb">
      <div>
        <h3>${p.n}</h3>
        <div class="kind">${K[p.c]}</div>
      </div>

      <div class="specs">
        <div>
          <strong>${p.a}</strong>
          <small>Autonomia</small>
        </div>

        <div>
          <strong>${p.v}</strong>
          <small>${p.vl || 'Vel. máx.'}</small>
        </div>

        <div>
          <strong>${p.x}</strong>
          <small>${p.xl}</small>
        </div>
      </div>

      <a
        class="btn btn-d"
        target="_blank"
        rel="noopener noreferrer"
        href="${wa(
          'Olá! Gostaria de saber o preço do modelo ' + p.n + '.'
        )}"
      >
        Consultar preço
      </a>
    </div>
  </article>
`).join('');

$('#m').innerHTML =
  '<option value="">Ainda não sei</option>' +
  P.map(p => `<option>${p.n}</option>`).join('');


/* ===== FILTROS DO CATÁLOGO ===== */

document.querySelectorAll('.chip').forEach(botao => {
  botao.onclick = () => {
    document.querySelectorAll('.chip').forEach(item => {
      item.setAttribute(
        'aria-pressed',
        String(item === botao)
      );
    });

    document.querySelectorAll('.card').forEach(card => {
      card.hidden =
        botao.dataset.f !== 'todos' &&
        card.dataset.c !== botao.dataset.f;
    });
  };
});


/* ===== MENU RESPONSIVO ===== */

(() => {
  const nav = $('#nav');
  const button = $('#burger');
  const menu = $('#menu');

  const desktop = matchMedia('(min-width: 1101px)');

  let previousOverflow = '';

  function setMenu(open, restoreFocus = false) {
    const wasOpen =
      button.getAttribute('aria-expanded') === 'true';

    nav.classList.toggle('open', open);

    button.setAttribute(
      'aria-expanded',
      String(open)
    );

    button.setAttribute(
      'aria-label',
      open ? 'Fechar menu' : 'Abrir menu'
    );

    document.body.classList.toggle(
      'menu-open',
      open
    );

    if (open && !wasOpen) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    if (!open && wasOpen) {
      document.body.style.overflow = previousOverflow;
    }

    if (restoreFocus) {
      button.focus();
    }
  }

  button.addEventListener('click', () => {
    setMenu(
      button.getAttribute('aria-expanded') !== 'true'
    );
  });

  menu.addEventListener('click', event => {
    if (event.target.closest('a')) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' &&
      button.getAttribute('aria-expanded') === 'true'
    ) {
      setMenu(false, true);
    }
  });

  document.addEventListener(
    'pointerdown',
    event => {
      if (!event.target.closest('header')) {
        setMenu(false);
      }
    },
    { passive: true }
  );

  document.addEventListener('focusin', event => {
    if (!event.target.closest('header')) {
      setMenu(false);
    }
  });

  desktop.addEventListener('change', event => {
    if (event.matches) {
      setMenu(false);
    }
  });

  setMenu(false);
})();


/* ===== REVEAL E CONTADORES ===== */

const reduce = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('in');
    io.unobserve(entry.target);

    if (
      entry.target.tagName === 'H2' &&
      !reduce
    ) {
      scr(entry.target);
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll('.rv').forEach(elemento => {
  io.observe(elemento);
});

const co = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const elemento = entry.target;
    const destino = Number(elemento.dataset.to);
    const inicio = performance.now();

    co.unobserve(elemento);

    if (reduce) {
      elemento.textContent = destino;
      return;
    }

    function animar(tempo) {
      const progresso = Math.min(
        (tempo - inicio) / 1400,
        1
      );

      const suavizado =
        1 - (1 - progresso) * (1 - progresso);

      elemento.textContent = Math.round(
        destino * suavizado
      );

      if (progresso < 1) {
        requestAnimationFrame(animar);
      }
    }

    animar(inicio);
  });
}, {
  threshold: 0.6
});

document.querySelectorAll('.count').forEach(elemento => {
  co.observe(elemento);
});


/* ===== CALCULADORA ===== */
/*
  Premissas da simulação:
  - Energia equivalente a 12% do gasto com combustível.
  - 2,3 kg de CO₂ por litro.
  - Gasolina a R$ 6,20.
*/

const g = $('#gasto');

const fmt = valor =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

function calc() {
  const valor = Number(g.value);

  $('#gv').textContent = fmt(valor);

  $('#r1').textContent = fmt(
    valor * 0.88 * 12
  );

  $('#r2').textContent =
    Math.round(
      valor / 6.2 * 2.3 * 12
    ).toLocaleString('pt-BR') + ' kg';
}

g.oninput = calc;
calc();


/* ===== FORMULÁRIO DO TEST RIDE ===== */

const w = $('#w');

w.oninput = () => {
  const digitos = w.value
    .replace(/\D/g, '')
    .slice(0, 11);

  if (digitos.length > 10) {
    w.value = digitos.replace(
      /(\d{2})(\d{5})(\d*)/,
      '($1) $2-$3'
    );
  } else if (digitos.length > 6) {
    w.value = digitos.replace(
      /(\d{2})(\d{4})(\d*)/,
      '($1) $2-$3'
    );
  } else if (digitos.length > 2) {
    w.value = digitos.replace(
      /(\d{2})(\d*)/,
      '($1) $2'
    );
  } else {
    w.value = digitos;
  }
};

$('#tr').onsubmit = event => {
  event.preventDefault();

  const nome = $('#n').value.trim();
  const digitos = w.value.replace(/\D/g, '');

  $('#en').textContent =
    nome.length < 3
      ? 'Digite seu nome completo.'
      : '';

  $('#ew').textContent =
    digitos.length < 10
      ? 'Digite um WhatsApp com DDD.'
      : '';

  if (
    nome.length < 3 ||
    digitos.length < 10
  ) {
    return;
  }

  const modelo = $('#m').value;

  $('#ok').classList.add('show');

  const mensagem =
    `Olá! Sou ${nome} (${w.value}) e quero agendar um test ride` +
    (modelo ? ` do modelo ${modelo}` : '') +
    '.';

  window.open(
    wa(mensagem),
    '_blank',
    'noopener'
  );
};


/* ===== AMBIENT BACKGROUND MOTION ===== */

(() => {
  const canvas = $('#net');
  const backdrop = canvas.parentElement;
  const contexto = canvas.getContext('2d');

  if (!contexto) return;

  const motion = matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const compact = matchMedia(
    '(max-width: 800px), (pointer: coarse)'
  );

  const mouse = {
    x: -999,
    y: -999
  };

  let largura = 0;
  let altura = 0;
  let particulas = [];

  let frame = 0;
  let ultimoTempo = 0;

  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;

  function parallax(reset = false) {
    if (
      reset ||
      compact.matches ||
      motion.matches
    ) {
      targetX = 0;
      targetY = 0;
      offsetX = 0;
      offsetY = 0;
    } else {
      offsetX += (targetX - offsetX) * 0.12;
      offsetY += (targetY - offsetY) * 0.12;
    }

    backdrop.style.setProperty(
      '--ambient-x',
      offsetX.toFixed(2) + 'px'
    );

    backdrop.style.setProperty(
      '--ambient-y',
      offsetY.toFixed(2) + 'px'
    );
  }

  function desenhar(passo = 0) {
    contexto.clearRect(
      0,
      0,
      largura,
      altura
    );

    for (const particula of particulas) {
      particula.x += particula.vx * passo;
      particula.y += particula.vy * passo;

      if (
        particula.x < 0 ||
        particula.x > largura
      ) {
        particula.vx *= -1;
      }

      if (
        particula.y < 0 ||
        particula.y > altura
      ) {
        particula.vy *= -1;
      }

      const dx = particula.x - mouse.x;
      const dy = particula.y - mouse.y;

      const distancia =
        Math.hypot(dx, dy) || 1;

      if (distancia < 120 && passo) {
        particula.x +=
          dx / distancia * 0.45 * passo;

        particula.y +=
          dy / distancia * 0.45 * passo;
      }

      contexto.fillStyle =
        'rgba(0,255,130,.55)';

      contexto.fillRect(
        particula.x,
        particula.y,
        1.5,
        1.5
      );
    }

    for (
      let i = 0;
      i < particulas.length;
      i++
    ) {
      for (
        let j = i + 1;
        j < particulas.length;
        j++
      ) {
        const distancia = Math.hypot(
          particulas[i].x - particulas[j].x,
          particulas[i].y - particulas[j].y
        );

        if (distancia < 145) {
          const opacidade =
            0.16 * (1 - distancia / 145);

          contexto.strokeStyle =
            `rgba(0,255,130,${opacidade})`;

          contexto.beginPath();

          contexto.moveTo(
            particulas[i].x,
            particulas[i].y
          );

          contexto.lineTo(
            particulas[j].x,
            particulas[j].y
          );

          contexto.stroke();
        }
      }
    }
  }

  function animar(tempo) {
    frame = 0;

    if (
      document.hidden ||
      motion.matches
    ) {
      return;
    }

    const intervalo = compact.matches
      ? 50
      : 33.33;

    if (
      !ultimoTempo ||
      tempo - ultimoTempo >= intervalo
    ) {
      const passo = ultimoTempo
        ? Math.min(
            (tempo - ultimoTempo) / 16.67,
            3
          )
        : 1;

      ultimoTempo = tempo;

      desenhar(passo);
      parallax();
    }

    frame = requestAnimationFrame(animar);
  }

  function sincronizar() {
    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = 0;
    ultimoTempo = 0;

    const pausado =
      document.hidden ||
      motion.matches;

    backdrop.classList.toggle(
      'is-paused',
      pausado
    );

    parallax(pausado);

    if (!document.hidden) {
      desenhar();

      if (!pausado) {
        frame = requestAnimationFrame(animar);
      }
    }
  }

  function redimensionar() {
    largura =
      canvas.clientWidth || innerWidth;

    altura =
      canvas.clientHeight || innerHeight;

    const escala = Math.min(
      window.devicePixelRatio || 1,
      compact.matches ? 1 : 1.5
    );

    canvas.width = Math.round(
      largura * escala
    );

    canvas.height = Math.round(
      altura * escala
    );

    contexto.setTransform(
      escala,
      0,
      0,
      escala,
      0,
      0
    );

    const quantidade = Math.min(
      compact.matches ? 18 : 44,
      Math.floor(
        largura * altura /
        (compact.matches ? 32000 : 24000)
      )
    );

    particulas = Array.from(
      { length: quantidade },
      () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18
      })
    );

    sincronizar();
  }

  document.addEventListener(
    'pointermove',
    event => {
      if (
        motion.matches ||
        compact.matches
      ) {
        return;
      }

      mouse.x = event.clientX;
      mouse.y = event.clientY;

      targetX =
        (
          Math.max(
            0,
            Math.min(
              1,
              event.clientX / largura
            )
          ) - 0.5
        ) * 24;

      targetY =
        (
          Math.max(
            0,
            Math.min(
              1,
              event.clientY / altura
            )
          ) - 0.5
        ) * 18;
    },
    { passive: true }
  );

  document.addEventListener(
    'pointerleave',
    () => {
      mouse.x = -999;
      mouse.y = -999;

      targetX = 0;
      targetY = 0;
    }
  );

  document.addEventListener(
    'visibilitychange',
    sincronizar
  );

  motion.addEventListener(
    'change',
    sincronizar
  );

  compact.addEventListener(
    'change',
    redimensionar
  );

  addEventListener(
    'resize',
    redimensionar,
    { passive: true }
  );

  redimensionar();
})();


/* ===== ANIMAÇÃO DOS TÍTULOS ===== */

document.querySelectorAll('h2.rv').forEach(titulo => {
  titulo.setAttribute(
    'aria-label',
    titulo.textContent
  );

  titulo.innerHTML = titulo.textContent
    .split(' ')
    .map((palavra, indice) =>
      `<span class="w" aria-hidden="true"><span style="--i:${indice}">${palavra}</span></span>`
    )
    .join(' ');
});

const scr = elemento =>
  requestAnimationFrame(() => {
    elemento.querySelectorAll('.w').forEach(palavra => {
      palavra.classList.add('go');
    });
  });


/* ===== BARRA DE PROGRESSO ===== */

const bar = document.createElement('div');

bar.id = 'bar';
document.body.prepend(bar);

addEventListener('scroll', () => {
  bar.style.width =
    scrollY /
    (
      document.documentElement.scrollHeight -
      innerHeight
    ) * 100 + '%';
}, {
  passive: true
});


/* ===== EFEITOS NOS CARDS E BOTÕES ===== */

if (
  matchMedia('(pointer:fine)').matches &&
  !reduce
) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty(
        '--mx',
        x + 'px'
      );

      card.style.setProperty(
        '--my',
        y + 'px'
      );

      card.style.transform =
        'perspective(900px) ' +
        `rotateX(${(0.5 - y / rect.height) * 8}deg) ` +
        `rotateY(${(x / rect.width - 0.5) * 8}deg) ` +
        'translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.btn-p').forEach(botao => {
    botao.addEventListener('mousemove', event => {
      const rect = botao.getBoundingClientRect();

      const x =
        (
          event.clientX -
          rect.left -
          rect.width / 2
        ) * 0.2;

      const y =
        (
          event.clientY -
          rect.top -
          rect.height / 2
        ) * 0.3;

      botao.style.transform =
        `translate(${x}px,${y}px)`;
    });

    botao.addEventListener('mouseleave', () => {
      botao.style.transform = '';
    });
  });
}


/* ===== VITRINE DE DESTAQUES ===== */

const FEAT = [
  ['Mirai X-13', 'Destaque da loja'],
  ['Mirai ZX6', 'Destaque da loja'],
  ['Mirai Scooter Pixxel', 'Destaque da loja'],
  ['Mirai Capri', 'Destaque da loja']
].map(([nome, rotulo]) => ({
  ...P.find(produto => produto.n === nome),
  l: rotulo
}));

$('#vstage').innerHTML = FEAT.map((p, indice) => `
  <article
    class="sl${indice ? '' : ' on'}"
    id="vpanel-${indice}"
    role="group"
    aria-roledescription="slide"
    aria-labelledby="vtitle-${indice}"
    aria-hidden="${!!indice}"
    ${indice ? 'inert' : ''}
  >
    <div class="vphoto">
      <span class="ghost" aria-hidden="true">
        ${p.n.replace('Mirai ', '')}
      </span>

      <span class="vphoto-fallback">
        Consulte fotos deste modelo pelo WhatsApp.
      </span>

      <img
        src="assets/${encodeURI(p.img)}"
        alt="${p.n}"
        width="640"
        height="420"
        ${indice ? 'loading="lazy"' : 'fetchpriority="high"'}
        decoding="async"
      >
    </div>

    <div class="sinfo">
      <div>
        <span class="lab">${p.l}</span>

        <h3 id="vtitle-${indice}">
          ${p.n}
        </h3>

        <div class="sspec">
          <div>
            <strong>${p.a}</strong>
            <small>Autonomia</small>
          </div>

          <div>
            <strong>${p.v}</strong>
            <small>${p.vl || 'Vel. máx.'}</small>
          </div>

          <div>
            <strong>${p.x}</strong>
            <small>${p.xl}</small>
          </div>
        </div>
      </div>

      <a
        class="btn btn-p"
        target="_blank"
        rel="noopener noreferrer"
        href="${wa(
          'Olá! Gostaria de saber o preço e receber fotos do modelo ' +
          p.n +
          '.'
        )}"
      >
        Consultar preço
      </a>
    </div>
  </article>
`).join('');


/* ===== ALTERNÂNCIA AUTOMÁTICA DOS DESTAQUES ===== */

const vitrine = document.querySelector('.hv');

const vslides = [
  ...vitrine.querySelectorAll('.sl')
];

const vmotion = matchMedia(
  '(prefers-reduced-motion: reduce)'
);

let vcur = 0;
let vvisible = true;
let vhover = false;
let vfocus = false;
let vtimer = 0;

const vgo = numero => {
  vcur = (
    numero + FEAT.length
  ) % FEAT.length;

  $('#vc').textContent =
    `0${vcur + 1} / 0${FEAT.length}`;

  $('#vc').setAttribute(
    'aria-label',
    `Destaque ${vcur + 1} de ${FEAT.length}`
  );

  vslides.forEach((slide, indice) => {
    const ativo = indice === vcur;

    slide.classList.toggle(
      'on',
      ativo
    );

    slide.setAttribute(
      'aria-hidden',
      String(!ativo)
    );

    slide.inert = !ativo;

    slide.querySelector('a').tabIndex =
      ativo ? 0 : -1;
  });
};

const vsync = () => {
  if (vtimer) {
    clearTimeout(vtimer);
    vtimer = 0;
  }

  const reproduzindo =
    !vmotion.matches &&
    !document.hidden &&
    vvisible &&
    !vhover &&
    !vfocus;

  vitrine.dataset.autoplay =
    reproduzindo ? 'playing' : 'paused';

  if (reproduzindo) {
    vtimer = setTimeout(() => {
      vtimer = 0;
      vgo(vcur + 1);
      vsync();
    }, 6000);
  }
};

vitrine.addEventListener('mouseenter', () => {
  vhover = true;
  vsync();
});

vitrine.addEventListener('mouseleave', () => {
  vhover = false;
  vsync();
});

vitrine.addEventListener('focusin', () => {
  vfocus = true;
  vsync();
});

vitrine.addEventListener('focusout', event => {
  vfocus = Boolean(
    event.relatedTarget &&
    vitrine.contains(event.relatedTarget)
  );

  vsync();
});

document.addEventListener(
  'visibilitychange',
  vsync
);

vmotion.addEventListener(
  'change',
  vsync
);

if ('IntersectionObserver' in window) {
  const vobserver = new IntersectionObserver(entries => {
    vvisible = entries[0].isIntersecting;
    vsync();
  }, {
    threshold: 0.05
  });

  vobserver.observe(vitrine);
}


/* ===== CARREGAMENTO DAS IMAGENS DOS DESTAQUES ===== */

vitrine.querySelectorAll('img').forEach(img => {
  const ready = () => {
    if (
      img.naturalWidth &&
      img.parentElement.classList.contains('vphoto')
    ) {
      img.parentElement.classList.add(
        'photo-ready'
      );
    }
  };

  img.addEventListener(
    'load',
    ready,
    { once: true }
  );

  img.addEventListener(
    'error',
    () => img.remove(),
    { once: true }
  );

  if (img.complete) {
    if (img.naturalWidth) {
      ready();
    } else {
      img.remove();
    }
  }
});

vgo(0);
vsync();


/* ===== ANO DO RODAPÉ ===== */

$('#yr').textContent = new Date().getFullYear();