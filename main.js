// ==========================================
// BANCO DE DADOS LOCAL DO PROJETO
// ==========================================
const pioresSenhas = [
    { rank: 1, password: "123456", risk: "critico", icon: "🔢", desc: "A campeã absoluta de uso mundial. Descoberta instantaneamente." },
    { rank: 2, password: "password", risk: "critico", icon: "🔤", desc: "A própria palavra 'senha' em inglês. O óbvio que falha." },
    { rank: 3, password: "admin", risk: "critico", icon: "🛠️", desc: "Padrão de fábrica para roteadores e sistemas corporativos." },
    { rank: 4, password: "qwerty", risk: "alto", icon: "⌨️", desc: "A primeira sequência física de letras do teclado padrão." },
    { rank: 5, password: "123456789", risk: "critico", icon: "🔢", desc: "Apenas uma extensão preguiçosa do primeiro colocado." },
    { rank: 6, password: "abc123", risk: "alto", icon: "🔠", desc: "Tentativa básica de misturar letras sequenciais com números." },
    { rank: 7, password: "000000", risk: "alto", icon: "⭕", desc: "Sequência repetitiva muito usada em bloqueios numéricos simples." },
    { rank: 8, password: "111111", risk: "alto", icon: "🚏", desc: "Outra repetição previsível baseada na lei do menor esforço." },
    { rank: 9, password: "senha", risk: "critico", icon: "🇧🇷", desc: "Variante regional clássica em países de língua portuguesa." },
    { rank: 10, password: "iloveyou", risk: "alto", icon: "❤️", desc: "Expressões emocionais comuns estão em todos os dicionários de ataque." }
];

const perguntasQuiz = [
    { q: "A senha 'P@$$w0rd2026!' é considerada 100% inquebrável?", o: ["Sim", "Não"], a: 1, e: "Não! Apesar de possuir símbolos, baseia-se na palavra previsível 'password' substituindo letras por símbolos comuns, mapeados por softwares de ataque." },
    { q: "Qual o método mais seguro para gerenciar dezenas de senhas complexas?", o: ["Anotar em um bloco de notas físico", "Usar um Gerenciador de Senhas confiável", "Salvar em um documento no computador"], a: 1, e: "O Gerenciador de Senhas criptografa seus dados e preenche automaticamente, eliminando a falha humana de esquecimento ou repetição." },
    { q: "Se uma plataforma vazou sua senha, o que você deve fazer imediatamente?", o: ["Mudar a senha apenas nesse site", "Mudar a senha desse site e de qualquer outro onde ela era repetida", "Não precisa mudar se tiver antivírus"], a: 1, e: "Mude em todos! Hackers usam listas vazadas automatizadas em centenas de outros sites populares (Credential Stuffing)." },
    { q: "O que caracteriza uma autêntica 'Passphrase' forte?", o: ["Uma palavra curta com muitos números", "Uma frase longa combinando palavras aleatórias", "Seu nome completo invertido"], a: 1, e: "Frases longas com palavras aleatórias elevam exponencialmente a entropia matemática, inviabilizando ataques de força bruta." },
    { q: "A autenticação de dois fatores (2FA) anula a necessidade de uma senha forte?", o: ["Sim, pois protege tudo", "Não, é apenas uma camada extra essencial"], a: 1, e: "Não anula. O 2FA impede o acesso direto, mas uma senha fraca expõe seus dados estruturais em vazamentos indiretos." }
];

// ==========================================
// INICIALIZAÇÃO E LOADING
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.classList.add('fade-out');
        initTypingEffect();
    }, 1200);

    renderRanking(pioresSenhas);
    initQuiz();
    setupTheme();
});

// ==========================================
// RENDERIZAR E FILTRAR CARDS
// ==========================================
function renderRanking(data) {
    const grid = document.getElementById('ranking-grid');
    grid.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="rank-badge">#${item.rank}</span>
                <span class="risk-tag ${item.risk}">${item.risk}</span>
            </div>
            <div class="card-icon">${item.icon}</div>
            <h3><code>${item.password}</code></h3>
            <p>${item.desc}</p>
        `;
        grid.appendChild(card);
    });
}

// Filtros & Busca
document.getElementById('search-input').addEventListener('input', filterCards);
document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.btn-filter.active').classList.remove('active');
        e.target.classList.add('active');
        filterCards();
    });
});

function filterCards() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const activeFilter = document.querySelector('.btn-filter.active').getAttribute('data-filter');

    const filtrados = pioresSenhas.filter(item => {
        const matchesSearch = item.password.toLowerCase().includes(searchText);
        const matchesType = (activeFilter === 'all') || (item.risk === activeFilter);
        return matchesSearch && matchesType;
    });
    renderRanking(filtrados);
}

// ==========================================
// EFECTO DE DIGITAÇÃO (HERO)
// ==========================================
function initTypingEffect() {
    const target = document.getElementById('typing-text');
    const text = "As Senhas Mais Absurdas que Milhões de Pessoas Ainda Utilizam.";
    let index = 0;

    function type() {
        if (index < text.length) {
            target.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    type();
}

// ==========================================
// SIMULADOR DE FORÇA DE SENHA
// ==========================================
const passwordInput = document.getElementById('password-input');
const viewToggle = document.getElementById('toggle-password-view');
const strengthMeter = document.getElementById('strength-meter');
const strengthLabel = document.getElementById('strength-label');
const suggestionsList = document.getElementById('suggestions-list');

viewToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    viewToggle.textContent = type === 'password' ? '👁️' : '🙈';
});

passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    if (!val) {
        strengthMeter.style.width = '0%';
        strengthLabel.textContent = "Aguardando senha...";
        suggestionsList.innerHTML = '';
        return;
    }

    let score = 0;
    let suggestions = [];

    if (val.length >= 8) score++; else suggestions.push("Muito curta (mínimo de 8 caracteres).");
    if (val.length >= 14) score++;
    if (/[A-Z]/.test(val)) score++; else suggestions.push("Adicione letras maiúsculas.");
    if (/[a-z]/.test(val)) score++; else suggestions.push("Adicione letras minúsculas.");
    if (/[0-9]/.test(val)) score++; else suggestions.push("Adicione números.");
    if (/[^A-Za-z0-9]/.test(val)) score++; else suggestions.push("Adicione caracteres especiais (ex: !, @, #).");
    
    // Check de sequencias comuns basica
    if (/123|abc|qwerty|senha/i.test(val)) {
        score = Math.max(1, score - 2);
        suggestions.push("Contém sequências ou termos extremamente previsíveis!");
    }

    // Apresentação visual do medidor
    let pct = (score / 6) * 100;
    strengthMeter.style.width = `${pct}%`;

    let state = { text: "Muito Fraca", color: "#ef4444" };
    if (score >= 2) state = { text: "Fraca", color: "#f97316" };
    if (score >= 4) state = { text: "Média", color: "#eab308" };
    if (score === 5) state = { text: "Forte", color: "#38bdf8" };
    if (score === 6) state = { text: "Excelente ✨", color: "#22c55e" };

    strengthMeter.style.backgroundColor = state.color;
    strengthLabel.textContent = `Força: ${state.text}`;
    strengthLabel.style.color = state.color;

    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
});

// ==========================================
// GERADOR DE SENHAS
// ==========================================
const slider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const btnGenerate = document.getElementById('btn-generate');
const btnCopy = document.getElementById('btn-copy');

slider.addEventListener('input', () => lengthVal.textContent = slider.value);

function generatePassword() {
    const length = parseInt(slider.value);
    const upper = document.getElementById('chk-uppercase').checked;
    const lower = document.getElementById('chk-lowercase').checked;
    const numbers = document.getElementById('chk-numbers').checked;
    const symbols = document.getElementById('chk-symbols').checked;

    let charPool = "";
    if (upper) charPool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) charPool += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charPool += "0123456789";
    if (symbols) charPool += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charPool) {
        showToast("Selecione pelo menos uma opção de caracteres!");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * charPool.length);
        password += charPool.charAt(randIndex);
    }

    document.getElementById('generated-password').textContent = password;
}

btnGenerate.addEventListener('click', generatePassword);
btnCopy.addEventListener('click', () => {
    const text = document.getElementById('generated-password').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Senha copiada para a área de transferência!");
    });
});

// ==========================================
// NOTIFICAÇÃO TOAST CUSTOMIZADA
// ==========================================
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// SISTEMA DE QUIZ INTERATIVO
// ==========================================
let currentQuestionIndex = 0;
let scoreQuiz = 0;

function initQuiz() {
    const container = document.getElementById('quiz-container');
    if (currentQuestionIndex < perguntasQuiz.length) {
        const qData = perguntasQuiz[currentQuestionIndex];
        container.innerHTML = `
            <p class="quiz-question">${qData.q}</p>
            <div class="quiz-options">
                ${qData.o.map((opt, i) => `<button class="btn-option" onclick="submitAnswer(${i})">${opt}</button>`).join('')}
            </div>
            <div class="footer-msg" style="margin-top:15px">Pergunta ${currentQuestionIndex + 1} de ${perguntasQuiz.length}</div>
        `;
    } else {
        let msgCustom = "Precisa estudar mais sobre cybersecurity! 🛡️";
        if (scoreQuiz >= 4) msgCustom = "Excelente! Você tem ótimos hábitos digitais! 🔐";
        container.innerHTML = `
            <h3>Quiz Concluído!</h3>
            <p style="font-size:1.2rem; margin:15px 0;">Sua pontuação: <strong>${scoreQuiz} / ${perguntasQuiz.length}</strong></p>
            <p>${msgCustom}</p>
            <button class="btn btn-primary" style="margin-top:20px" onclick="resetQuiz()">Refazer Quiz</button>
        `;
    }
}

window.submitAnswer = function(selectedIndex) {
    const qData = perguntasQuiz[currentQuestionIndex];
    const container = document.getElementById('quiz-container');
    
    if (selectedIndex === qData.a) {
        scoreQuiz++;
    }

    container.innerHTML = `
        <p class="quiz-question">${qData.q}</p>
        <div class="quiz-explanation">
            <strong>${selectedIndex === qData.a ? "✅ Correto!" : "❌ Incorreto!"}</strong><br>
            ${qData.e}
        </div>
        <button class="btn btn-primary" style="margin-top:20px;" onclick="nextQuestion()">Avançar</button>
    `;
};

window.nextQuestion = function() {
    currentQuestionIndex++;
    initQuiz();
};

window.resetQuiz = function() {
    currentQuestionIndex = 0;
    scoreQuiz = 0;
    initQuiz();
};

// ==========================================
// CONTADOR ANIMADO (ESTATÍSTICAS)
// ==========================================
function startCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 80;

        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.floor(count).toLocaleString('pt-BR');
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString('pt-BR');
            }
        };
        updateCount();
    });
}

// ==========================================
// INTERSECTION OBSERVER (ANIMAÇÃO AO ROLAR)
// ==========================================
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.id === 'curiosidades') {
                startCounters();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ==========================================
// UTILITÁRIOS DA PÁGINA (SCROLL, TOP, NAV)
// ==========================================
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    // Barra de progresso
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';

    // Botão topo
    if (window.scrollY > 400) backToTop.style.display = "block";
    else backToTop.style.display = "none";
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Menu Mobile Responsivo
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('toggle');
});

// Fecha menu mobile ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Configuração Automática do Ano no Footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// ==========================================
// SISTEMA DE TEMA (CLARO/ESCURO) PERSISTENTE
// ==========================================
function setupTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', newTheme);
    });
}
