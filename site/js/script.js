/*=============================================================================
  CODESCHOOL — SCRIPT DO SITE PÚBLICO (script.js)
  =============================================================================
  Este arquivo controla TODAS as interações do site principal.

  Está organizado em seções numeradas para facilitar o acompanhamento:

    1. Menu Hambúrguer (Navegação Mobile)
    2. Alternância de Tema Claro/Escuro (Dark Mode)
    3. Carousel / Slider do Topo
    4. Contadores Animados (Intersection Observer)
    5. Integração com a API via Axios (Conteúdo Dinâmico)

  IMPORTANTE: Todo o código está dentro do evento 'DOMContentLoaded'.
  Isso garante que o JavaScript só roda DEPOIS que o HTML foi totalmente
  carregado pelo navegador — evitando erros de "elemento não encontrado".
=============================================================================*/

document.addEventListener('DOMContentLoaded', () => {


    /* =========================================================================
       1. MENU HAMBÚRGUER (Navegação Mobile)
       =========================================================================
       Em telas pequenas (celular), o menu fica oculto por padrão.
       O botão com o ícone de "três linhas" (hambúrguer) o exibe/oculta
       ao ser clicado, alternando a classe CSS 'active' no <nav>.
    ======================================================================= */

    const navMenu  = document.getElementById('nav');
    const menuBtn  = document.getElementById('menu-btn');
    const menuIcon = menuBtn.querySelector('i');
    // Selecionamos todos os links do menu para fechar automaticamente ao clicar
    const navLinks = document.querySelectorAll('.nav-link');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Alterna o ícone: lista (ph-list) ↔ X (ph-x)
        if (navMenu.classList.contains('active')) {
            menuIcon.classList.replace('ph-list', 'ph-x');
        } else {
            menuIcon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Fecha o menu ao clicar em qualquer link (o scroll já rola para a seção correta)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.classList.replace('ph-x', 'ph-list');
        });
    });


    /* =========================================================================
       2. ALTERNÂNCIA DE TEMA CLARO / ESCURO (  Mode)
       =========================================================================
       Usamos o localStorage para lembrar a preferência do usuário entre sessões.
       A troca de tema é feita adicionando/removendo a classe 'dark-mode' no <body>.
       O CSS cuida de aplicar as cores corretas com base nessa classe.
    ======================================================================= */

    const themeBtn  = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');

    // Ao carregar a página, verificamos se o usuário já escolheu o tema escuro antes
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const estaModoEscuro = document.body.classList.contains('dark-mode');

        if (estaModoEscuro) {
            themeIcon.classList.replace('ph-moon', 'ph-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('ph-sun', 'ph-moon');
            localStorage.setItem('theme', 'light');
        }
    });


    /* =========================================================================
       3. CAROUSEL / SLIDER DO TOPO
       =========================================================================
       O carousel exibe um slide de cada vez adicionando a classe 'active'.
       Há dois controles:
         - Manual: botões Anterior e Próximo
         - Automático: troca sozinho a cada 6 segundos (autoplay)

       O autoplay é reiniciado toda vez que o usuário interagir manualmente,
       para não sobrepor ao que o usuário acabou de escolher ver.
    ======================================================================= */

    const slides  = document.querySelectorAll('.carousel-slide');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    let slideAtual = 0;   // índice do slide em exibição (começa no 0)
    let timerAuto;        // guardamos a referência do setInterval para poder cancelá-lo

    /**
     * exibirSlide — ativa visualmente o slide no índice informado.
     * Trata os casos de "passar do último" e "voltar do primeiro" (looping).
     */
    function exibirSlide(indice) {
        slides.forEach(s => s.classList.remove('active'));

        // Looping circular: se ultrapassar o último, volta ao primeiro
        if (indice >= slides.length) indice = 0;
        if (indice < 0)             indice = slides.length - 1;

        slideAtual = indice;
        slides[slideAtual].classList.add('active');
    }

    btnNext.addEventListener('click', () => {
        exibirSlide(slideAtual + 1);
        reiniciarAutoplay(); // reinicia o timer ao clicar
    });

    btnPrev.addEventListener('click', () => {
        exibirSlide(slideAtual - 1);
        reiniciarAutoplay();
    });

    function iniciarAutoplay() {
        timerAuto = setInterval(() => exibirSlide(slideAtual + 1), 6000);
    }

    function reiniciarAutoplay() {
        clearInterval(timerAuto);
        iniciarAutoplay();
    }

    iniciarAutoplay(); // inicia o autoplay ao carregar a página


    /* =========================================================================
       4. CONTADORES ANIMADOS (Intersection Observer API)
       =========================================================================
       Os números da seção "Impacto CodeSchool" animam de 0 até o valor final.
       Usamos a Intersection Observer API para disparar a animação apenas quando
       a seção ficar visível na tela — economizando processamento.
    ======================================================================= */

    const contadores = document.querySelectorAll('.stat-num');

    /**
     * animarContador — incrementa o número de 0 até data-target em ~2 segundos.
     * @param {HTMLElement} el - o elemento <span> com o atributo data-target
     */
    function animarContador(el) {
        const valorFinal  = parseInt(el.getAttribute('data-target'));
        const duracao     = 2000; // milissegundos total da animação
        const incremento  = valorFinal / (duracao / 20); // quantos valores subir a cada 20ms
        let   valorAtual  = 0;

        const timer = setInterval(() => {
            valorAtual += incremento;
            if (valorAtual >= valorFinal) {
                el.innerText = valorFinal; // garante o número exato no final
                clearInterval(timer);
            } else {
                el.innerText = Math.ceil(valorAtual);
            }
        }, 20); // atualiza a cada 20ms (~50 frames por segundo)
    }

    /**
     * IntersectionObserver — "observa" elementos e avisa quando entram na tela.
     * threshold: 0.6 significa que 60% do elemento precisa estar visível.
     */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContador(entry.target);
                // Para de observar após a primeira vez (não anima de novo ao rolar)
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    contadores.forEach(c => observer.observe(c));


    /* =========================================================================
       5. INTEGRAÇÃO COM A API VIA AXIOS (Conteúdo Dinâmico)
       =========================================================================
       Esta seção é onde o site deixa de ser estático e passa a ser dinâmico.

       O HTML já possui os containers vazios (com id="formations-container" etc.).
       Aqui fazemos GET requests para a API e preenchemos esses containers
       com os dados vindos do banco de dados.

       Axios é uma biblioteca que simplifica o uso do fetch() nativo.
       Sintaxe: axios.get(url).then(resposta => { ... }).catch(erro => { ... })
    ======================================================================= */

    const API_URL = 'http://localhost:3000';

    // ── 5.1 Jogo ──────────────────────────────────────────────────────────
    axios.get(`${API_URL}/game`)
        .then(resposta => {
            const container = document.getElementById('formations-container');
            const dados     = resposta.data; // array de formações vindos da API

            // Limpa o texto "Carregando..."
            container.innerHTML = '';

            if (dados.length === 0) {
                container.innerHTML = '<p>Nenhuma formação cadastrada ainda.</p>';
                return;
            }

            // Para cada formação, criamos um "card" com o mesmo HTML do site original
            dados.forEach(game => {
                container.innerHTML += `
                    <article class="card">  
                        <h3>${game.title}</h3>
                        <p>${game.description}</p>
                        <p>${game.genre}</p>
                        <img src="${API_URL}${game.image_url}" alt="${game.title}" class="news-img">
                        <a href="#" class="btn btn-outline">Detalhes</a>
                    </article>
                `;
            });
        })
        .catch(err => console.error('Erro ao carregar formações:', err));


    // ── 5.1 Formações ──────────────────────────────────────────────────────────
    axios.get(`${API_URL}/publisher`)
        .then(resposta => {
            const container = document.getElementById('publishers-container');
            const dados     = resposta.data; // array de formações vindos da API

            // Limpa o texto "Carregando..."
            container.innerHTML = '';

            if (dados.length === 0) {
                container.innerHTML = '<p>Nenhuma empresa cadastrada ainda.</p>';
                return;
            }

            // Para cada formação, criamos um "card" com o mesmo HTML do site original
            dados.forEach(publisher => {
                container.innerHTML += `
                    <article class="card">  
                        <h3>${publisher.name}</h3>
                        <p>${publisher.country}</p>
                        <a href="#" class="btn btn-outline">Detalhes</a>
                    </article>
                `;
            });
        })
        .catch(err => console.error('Erro ao carregar formações:', err));

    // ── 5.2 Notícias do Blog ───────────────────────────────────────────────────
    axios.get(`${API_URL}/news`)
        .then(resposta => {
            const container = document.getElementById('news-container-inner');
            const dados     = resposta.data;

            container.innerHTML = '';

            if (dados.length === 0) {
                container.innerHTML = '<p>Nenhuma notícia cadastrada ainda.</p>';
                return;
            }

            dados.forEach(noticia => {
                container.innerHTML += `
                    <article class="news-item">
                        <img src="${API_URL}${noticia.image_url}" alt="${noticia.title}" class="news-img">
                        <div class="news-text">
                            <h4>${noticia.title}</h4>
                            <span class="news-date">${noticia.date}</span>
                            <p>${noticia.description}</p>
                        </div>
                    </article>
                `;
            });
        })
        .catch(err => console.error('Erro ao carregar notícias:', err));


    // ── 5.3 Próximos Eventos ───────────────────────────────────────────────────
    axios.get(`${API_URL}/events`)
        .then(resposta => {
            const container = document.getElementById('events-container-inner');
            const dados     = resposta.data;

            container.innerHTML = '';

            if (dados.length === 0) {
                container.innerHTML = '<p>Nenhum evento cadastrado ainda.</p>';
                return;
            }

            dados.forEach(evento => {
                container.innerHTML += `
                    <div class="event-item">
                        <div class="event-calendar">
                            <span class="day">${evento.day}</span>
                            <span class="month">${evento.month}</span>
                        </div>
                        <div class="event-text">
                            <h4>${evento.title}</h4>
                            <span class="event-meta">
                                <i class="ph ph-map-pin"></i> ${evento.location} |
                                <i class="ph ph-clock"></i> ${evento.time}
                            </span>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error('Erro ao carregar eventos:', err));

}); // fim do DOMContentLoaded
