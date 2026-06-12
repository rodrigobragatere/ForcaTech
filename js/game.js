/* ============================================================
   CYBER FORCA - Jogo da forca gamificado
   Tema: códigos maliciosos e segurança da informação
   ============================================================ */

// ---------- Banco de palavras (palavra + dica) ----------
const BANCO_PALAVRAS = [
  { palavra: "VIRUS",        dica: "Código malicioso que se replica infectando arquivos." },
  { palavra: "MALWARE",      dica: "Termo geral para qualquer software malicioso." },
  { palavra: "PHISHING",     dica: "Golpe que usa mensagens falsas para roubar dados pessoais." },
  { palavra: "RANSOMWARE",   dica: "Sequestra seus arquivos e exige resgate para devolvê-los." },
  { palavra: "FIREWALL",     dica: "Barreira que controla o tráfego de entrada e saída da rede." },
  { palavra: "TROJAN",       dica: "Se disfarça de programa legítimo para invadir o sistema (Cavalo de...)." },
  { palavra: "SPYWARE",      dica: "Espiona suas atividades e coleta informações sem permissão." },
  { palavra: "BACKDOOR",     dica: "Porta secreta deixada por invasores para retornar ao sistema." },
  { palavra: "BOTNET",       dica: "Rede de computadores zumbis controlados por criminosos." },
  { palavra: "WORM",         dica: "Se espalha sozinho pela rede, sem precisar de hospedeiro." },
  { palavra: "ROOTKIT",      dica: "Se esconde no sistema para ocultar a presença do invasor." },
  { palavra: "KEYLOGGER",    dica: "Registra tudo o que você digita, incluindo senhas." },
  { palavra: "ADWARE",       dica: "Bombardeia o usuário com propagandas indesejadas." },
  { palavra: "ANTIVIRUS",    dica: "Software que detecta e remove ameaças do computador." },
  { palavra: "CRIPTOGRAFIA", dica: "Técnica que embaralha dados para protegê-los de curiosos." },
  { palavra: "SENHA",        dica: "Sua primeira linha de defesa: deve ser forte e única." },
  { palavra: "BACKUP",       dica: "Cópia de segurança que salva seus dados em caso de desastre." },
  { palavra: "SPAM",         dica: "E-mails indesejados enviados em massa." },
  { palavra: "HACKER",       dica: "Especialista que explora vulnerabilidades em sistemas." },
  { palavra: "EXPLOIT",      dica: "Código que aproveita uma falha de segurança para atacar." },
  { palavra: "SPOOFING",     dica: "Falsifica identidade (e-mail, IP ou site) para enganar a vítima." },
  { palavra: "VPN",          dica: "Cria um túnel seguro e privado para navegar na internet." },
  { palavra: "BIOMETRIA",    dica: "Autenticação que usa digital, rosto ou íris." },
  { palavra: "VULNERABILIDADE", dica: "Falha ou brecha que pode ser explorada por atacantes." },
  { palavra: "AUTENTICACAO", dica: "Processo de verificar se você é quem diz ser." },
];

// ---------- Configurações ----------
const MAX_ERROS = 7;
const TOTAL_PALAVRAS = 10;
const DICAS_POR_JOGO = 3;
const PONTOS_LETRA = 10;
const PONTOS_PALAVRA = 50;
const PENALIDADE_ERRO = 5;
const RANKING_KEY = "cyberForcaRanking";
const NOME_KEY = "cyberForcaNome";
const MAX_RANKING = 5;

function dataAtualISO() {
  return new Date().toISOString();
}

function criarRankingPadrao() {
  const hoje = dataAtualISO();
  return [
    { nome: "Rodrigo Braga",  pontos: 990, erros: 0, acertos: 10, data: hoje, padrao: true },
    { nome: "Ana Ciber",      pontos: 920, erros: 1, acertos: 10, data: hoje, padrao: true },
    { nome: "Carlos Tech",    pontos: 845, erros: 2, acertos: 9,  data: hoje, padrao: true },
    { nome: "Maria Guard",    pontos: 710, erros: 3, acertos: 8,  data: hoje, padrao: true },
    { nome: "João Firewall",  pontos: 580, erros: 5, acertos: 7,  data: hoje, padrao: true },
  ];
}

function formatarDataRanking(iso) {
  if (!iso) return formatarDataHoje();
  const data = new Date(iso);
  const hoje = new Date();
  const mesmoDia =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();
  if (mesmoDia) return "Hoje";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatarDataHoje() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const TECLADO_COLS = 13;
const JOY_COOLDOWN = 200;

const NOMES_PARTES = [
  "Cabeça", "Tronco", "Braço esquerdo", "Braço direito",
  "Perna esquerda", "Perna direita", "Olhos X (fim)"
];

const NIVEIS = [
  { min: 0,   nome: "Iniciante" },
  { min: 150, nome: "Aprendiz" },
  { min: 300, nome: "Técnico" },
  { min: 500, nome: "Analista" },
  { min: 700, nome: "Especialista" },
  { min: 900, nome: "Hacker Ético" },
];

const MEDALHAS = [
  { min: 0,   nome: "Recruta Digital",        icone: "bi-shield" },
  { min: 200, nome: "Guardião de Dados",      icone: "bi-shield-check" },
  { min: 400, nome: "Analista de Segurança",  icone: "bi-shield-fill-check" },
  { min: 650, nome: "Defensor Cibernético",   icone: "bi-shield-fill-plus" },
  { min: 850, nome: "Mestre da Cibersegurança", icone: "bi-award-fill" },
];

// ---------- Estado do jogo ----------
let estado = {};
let jogoAtivo = false;
let pausado = false;

// ---------- Estado do joystick ----------
let gamepadIndice = null;
let joyUltimoInput = 0;
let joyIndiceTecla = 0;
let joyFocoMenu = 1;
let joyLoopAtivo = false;

// ---------- Elementos ----------
const el = {
  pontos: document.getElementById("pontos"),
  nivel: document.getElementById("nivel"),
  erros: document.getElementById("erros"),
  palavraAtual: document.getElementById("palavraAtual"),
  medalha: document.getElementById("medalha"),
  medalhaIcone: document.getElementById("medalhaIcone"),
  dica: document.getElementById("dica"),
  palavra: document.getElementById("palavra"),
  teclado: document.getElementById("teclado"),
  barraProgresso: document.getElementById("barraProgresso"),
  dicasRestantes: document.getElementById("dicasRestantes"),
  btnDica: document.getElementById("btnDica"),
  btnNovoJogo: document.getElementById("btnNovoJogo"),
  listaPartes: document.getElementById("listaPartes"),
  panelForca: document.querySelector(".panel-forca"),
};

const modalResultado = new bootstrap.Modal(document.getElementById("modalResultado"));
const modalFimJogo = new bootstrap.Modal(document.getElementById("modalFimJogo"));

const elControles = {
  jogando: document.getElementById("controlesJogo"),
  nomeJogador: document.getElementById("nomeJogador"),
  listaRanking: document.getElementById("listaRanking"),
  overlayPausa: document.getElementById("overlayPausa"),
  btnPausar: document.getElementById("btnPausar"),
  btnSair: document.getElementById("btnSair"),
  btnContinuar: document.getElementById("btnContinuar"),
  statusGamepad: document.getElementById("statusGamepad"),
  nomeGamepad: document.getElementById("nomeGamepad"),
};

// ---------- Ranking ----------
function sincronizarDatasPadrao(ranking) {
  const hoje = dataAtualISO();
  return ranking.map((item) => (item.padrao ? { ...item, data: hoje } : item));
}

function inicializarRanking() {
  try {
    const salvo = localStorage.getItem(RANKING_KEY);
    if (!salvo) {
      localStorage.setItem(RANKING_KEY, JSON.stringify(criarRankingPadrao()));
      return;
    }
    const dados = JSON.parse(salvo);
    if (!Array.isArray(dados) || dados.length === 0) {
      localStorage.setItem(RANKING_KEY, JSON.stringify(criarRankingPadrao()));
      return;
    }
    const atualizado = sincronizarDatasPadrao(dados);
    localStorage.setItem(RANKING_KEY, JSON.stringify(atualizado));
  } catch (_) {
    /* localStorage indisponível */
  }
}
function compararRanking(a, b) {
  if (a.erros !== b.erros) return a.erros - b.erros;
  if (a.pontos !== b.pontos) return b.pontos - a.pontos;
  return b.acertos - a.acertos;
}

function getRanking() {
  try {
    const dados = JSON.parse(localStorage.getItem(RANKING_KEY) || "[]");
    return Array.isArray(dados) ? dados.sort(compararRanking) : [];
  } catch (_) {
    return [];
  }
}

function salvarNoRanking(entrada) {
  const ranking = getRanking();
  const novaEntrada = { ...entrada, padrao: false };
  ranking.push(novaEntrada);
  ranking.sort(compararRanking);
  const top5 = ranking.slice(0, MAX_RANKING);
  try {
    localStorage.setItem(RANKING_KEY, JSON.stringify(top5));
  } catch (_) { /* localStorage indisponível */ }
  return top5;
}

function entrouNoTop5(entrada) {
  const ranking = getRanking();
  if (ranking.length < MAX_RANKING) return true;
  const pior = ranking[ranking.length - 1];
  return compararRanking(entrada, pior) < 0;
}

function renderizarRanking() {
  const ranking = getRanking();
  const classesPos = ["ouro", "prata", "bronze", "", ""];
  const elDataAtual = document.getElementById("dataRankingAtual");

  if (elDataAtual) {
    elDataAtual.innerHTML =
      `<i class="bi bi-calendar3 me-1"></i> Hoje: <strong>${formatarDataHoje()}</strong>`;
  }

  if (ranking.length === 0) {
    elControles.listaRanking.innerHTML =
      '<li class="vazio">Nenhum score registrado ainda. Seja o primeiro!</li>';
    return;
  }

  elControles.listaRanking.innerHTML = ranking.map((item, i) => {
    const cls = classesPos[i] || "";
    const dataFmt = formatarDataRanking(item.data);
    const nomeCls = item.nome === "Rodrigo Braga" && i === 0 ? "campeao" : "";
    return `
      <li>
        <span class="ranking-pos ${cls}">${i + 1}º</span>
        <span class="ranking-nome ${nomeCls}" title="${item.nome}">${item.nome}</span>
        <span class="ranking-stats">
          <strong>${item.pontos}</strong> pts · ${item.erros} err.
          <br><small><i class="bi bi-calendar-event me-1"></i>${dataFmt}</small>
        </span>
      </li>`;
  }).join("");
}

// ---------- Controles de sessão ----------
function setJogoAtivo(ativo) {
  jogoAtivo = ativo;
  elControles.jogando.classList.toggle("d-none", !ativo);
  if (!ativo) {
    pausado = false;
    elControles.overlayPausa.classList.add("d-none");
    elControles.btnPausar.innerHTML =
      '<i class="bi bi-pause-fill me-1"></i><span class="d-none d-sm-inline">PAUSAR</span>';
  }
}

function jogoBloqueado() {
  return !jogoAtivo || pausado || estado.fimDeJogo;
}

function pausarJogo() {
  if (!jogoAtivo || estado.fimDeJogo) return;
  pausado = true;
  elControles.overlayPausa.classList.remove("d-none");
  elControles.btnPausar.innerHTML =
    '<i class="bi bi-pause-fill me-1"></i><span class="d-none d-sm-inline">PAUSADO</span>';
  if (!audioUnisuam.paused) audioUnisuam.pause();
  atualizarFocoJoystick();
}

function continuarJogo() {
  if (!jogoAtivo) return;
  pausado = false;
  elControles.overlayPausa.classList.add("d-none");
  elControles.btnPausar.innerHTML =
    '<i class="bi bi-pause-fill me-1"></i><span class="d-none d-sm-inline">PAUSAR</span>';
  if (audioAtivo) iniciarAudio();
  atualizarFocoJoystick();
}

function sairJogo() {
  if (!jogoAtivo) return;
  const confirmar = window.confirm(
    "Deseja sair do jogo? O progresso atual será perdido e não entrará no ranking."
  );
  if (!confirmar) return;

  pausado = false;
  estado.fimDeJogo = true;
  elControles.overlayPausa.classList.add("d-none");
  modalResultado.hide();
  modalFimJogo.hide();
  setJogoAtivo(false);
  telaInicio.classList.remove("oculta");
  renderizarRanking();
}

// ---------- Inicialização ----------
function novoJogo() {
  const embaralhadas = [...BANCO_PALAVRAS].sort(() => Math.random() - 0.5);
  estado = {
    palavras: embaralhadas.slice(0, TOTAL_PALAVRAS),
    indice: 0,
    pontos: 0,
    errosTotais: 0,
    acertosPalavras: 0,
    dicasRestantes: DICAS_POR_JOGO,
    // estado da rodada atual
    errosRodada: 0,
    letrasTentadas: new Set(),
    fimDeJogo: false,
  };
  iniciarRodada();
}

function iniciarRodada() {
  estado.errosRodada = 0;
  estado.letrasTentadas = new Set();

  montarTeclado();
  desenharPalavra();
  resetarForca();
  atualizarPainel();

  el.dica.textContent = palavraAtual().dica;
}

function palavraAtual() {
  return estado.palavras[estado.indice];
}

// ---------- Teclado ----------
function montarTeclado() {
  el.teclado.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.className = "tecla";
    btn.textContent = letra;
    btn.dataset.letra = letra;
    btn.addEventListener("click", () => tentarLetra(letra));
    el.teclado.appendChild(btn);
  }
  joyIndiceTecla = 0;
  atualizarFocoJoystick();
}

function getTeclasDisponiveis() {
  return [...el.teclado.querySelectorAll(".tecla:not(:disabled)")];
}

function limparFocoJoystick() {
  document.querySelectorAll(".tecla-foco, .btn-foco").forEach((el) => {
    el.classList.remove("tecla-foco", "btn-foco");
  });
}

function atualizarFocoJoystick() {
  limparFocoJoystick();
  if (gamepadIndice === null) return;

  if (!telaInicio.classList.contains("oculta")) {
    if (joyFocoMenu === 0) elControles.nomeJogador.classList.add("btn-foco");
    else btnIniciar.classList.add("btn-foco");
    return;
  }

  if (!elControles.overlayPausa.classList.contains("d-none")) {
    elControles.btnContinuar.classList.add("btn-foco");
    return;
  }

  const modalVisivel = document.querySelector(".modal.show");
  if (modalVisivel) {
    const btn = modalVisivel.querySelector(".btn-primary");
    if (btn) btn.classList.add("btn-foco");
    return;
  }

  if (jogoAtivo && !pausado && !estado.fimDeJogo) {
    const teclas = getTeclasDisponiveis();
    if (teclas.length === 0) return;
    joyIndiceTecla = Math.max(0, Math.min(joyIndiceTecla, teclas.length - 1));
    teclas[joyIndiceTecla].classList.add("tecla-foco");
    teclas[joyIndiceTecla].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function moverFocoTecla(direcao) {
  const teclas = getTeclasDisponiveis();
  if (teclas.length === 0) return;

  const total = teclas.length;
  const atual = teclas[joyIndiceTecla];
  const todas = [...el.teclado.querySelectorAll(".tecla")];
  const idxGrid = todas.indexOf(atual);
  if (idxGrid < 0) { joyIndiceTecla = 0; atualizarFocoJoystick(); return; }

  let linha = Math.floor(idxGrid / TECLADO_COLS);
  let col = idxGrid % TECLADO_COLS;

  if (direcao === "esq") col = Math.max(0, col - 1);
  if (direcao === "dir") col = Math.min(TECLADO_COLS - 1, col + 1);
  if (direcao === "cima") linha = Math.max(0, linha - 1);
  if (direcao === "baixo") linha = Math.min(Math.ceil(26 / TECLADO_COLS) - 1, linha + 1);

  let novoIdx = linha * TECLADO_COLS + col;
  if (novoIdx >= 26) novoIdx = 25;

  const novaTecla = todas[novoIdx];
  if (novaTecla.disabled) {
    const vizinhos = { esq: -1, dir: 1, cima: -TECLADO_COLS, baixo: TECLADO_COLS };
    const passo = vizinhos[direcao] || 0;
    let tentativa = novoIdx + passo;
    while (tentativa >= 0 && tentativa < 26 && todas[tentativa].disabled) tentativa += passo;
    if (tentativa >= 0 && tentativa < 26 && !todas[tentativa].disabled) novoIdx = tentativa;
  }

  const novaDisp = getTeclasDisponiveis().indexOf(todas[novoIdx]);
  if (novaDisp >= 0) joyIndiceTecla = novaDisp;
  atualizarFocoJoystick();
}

function confirmarJoystick() {
  if (!telaInicio.classList.contains("oculta")) {
    if (joyFocoMenu === 1) btnIniciar.click();
    else elControles.nomeJogador.focus();
    return;
  }
  if (!elControles.overlayPausa.classList.contains("d-none")) {
    continuarJogo();
    return;
  }
  const modalVisivel = document.querySelector(".modal.show");
  if (modalVisivel) {
    const btn = modalVisivel.querySelector(".btn-primary");
    if (btn) btn.click();
    return;
  }
  if (jogoAtivo && !pausado && !estado.fimDeJogo) {
    const teclas = getTeclasDisponiveis();
    if (teclas[joyIndiceTecla]) {
      const letra = teclas[joyIndiceTecla].dataset.letra;
      tentarLetra(letra);
      const novasTeclas = getTeclasDisponiveis();
      if (joyIndiceTecla >= novasTeclas.length) {
        joyIndiceTecla = Math.max(0, novasTeclas.length - 1);
      }
      atualizarFocoJoystick();
    }
  }
}

function botaoPressionado(gp, idx) {
  return gp.buttons[idx] && (gp.buttons[idx].pressed || gp.buttons[idx].value > 0.5);
}

function eixoAtivo(valor, limiar = 0.55) {
  return Math.abs(valor) > limiar ? (valor < 0 ? -1 : 1) : 0;
}

function processarGamepad() {
  if (gamepadIndice === null) return;

  const gp = navigator.getGamepads()[gamepadIndice];
  if (!gp) return;

  const agora = Date.now();
  const eixoX = eixoAtivo(gp.axes[0] ?? 0);
  const eixoY = eixoAtivo(gp.axes[1] ?? 0);

  const esq = botaoPressionado(gp, 14) || eixoX === -1;
  const dir = botaoPressionado(gp, 15) || eixoX === 1;
  const cima = botaoPressionado(gp, 12) || eixoY === -1;
  const baixo = botaoPressionado(gp, 13) || eixoY === 1;
  const confirmar = botaoPressionado(gp, 0);
  const pausaBtn = botaoPressionado(gp, 9) || botaoPressionado(gp, 1);

  if (agora - joyUltimoInput < JOY_COOLDOWN) return;

  if (!telaInicio.classList.contains("oculta")) {
    if (cima || baixo) {
      joyFocoMenu = joyFocoMenu === 0 ? 1 : 0;
      joyUltimoInput = agora;
      atualizarFocoJoystick();
    }
    if (confirmar) {
      joyUltimoInput = agora;
      confirmarJoystick();
    }
    return;
  }

  if (pausaBtn && jogoAtivo && !document.querySelector(".modal.show")) {
    joyUltimoInput = agora;
    if (pausado) continuarJogo();
    else pausarJogo();
    atualizarFocoJoystick();
    return;
  }

  if (confirmar) {
    joyUltimoInput = agora;
    confirmarJoystick();
    return;
  }

  if (jogoAtivo && !pausado && !estado.fimDeJogo && !document.querySelector(".modal.show")) {
    if (esq) { moverFocoTecla("esq"); joyUltimoInput = agora; }
    else if (dir) { moverFocoTecla("dir"); joyUltimoInput = agora; }
    else if (cima) { moverFocoTecla("cima"); joyUltimoInput = agora; }
    else if (baixo) { moverFocoTecla("baixo"); joyUltimoInput = agora; }
  }
}

function loopGamepad() {
  processarGamepad();
  requestAnimationFrame(loopGamepad);
}

function conectarGamepad(e) {
  const gp = e.gamepad || navigator.getGamepads()[e.gamepad?.index ?? 0];
  if (!gp) return;
  gamepadIndice = gp.index;
  elControles.statusGamepad.classList.remove("d-none");
  elControles.nomeGamepad.textContent = gp.id || "Joystick";
  atualizarFocoJoystick();
  if (!joyLoopAtivo) {
    joyLoopAtivo = true;
    requestAnimationFrame(loopGamepad);
  }
}

function desconectarGamepad(e) {
  const restantes = [...navigator.getGamepads()].filter(Boolean);
  if (restantes.length === 0) {
    gamepadIndice = null;
    limparFocoJoystick();
    elControles.statusGamepad.classList.add("d-none");
  } else {
    gamepadIndice = restantes[0].index;
    elControles.nomeGamepad.textContent = restantes[0].id || "Joystick";
  }
}

window.addEventListener("gamepadconnected", conectarGamepad);
window.addEventListener("gamepaddisconnected", desconectarGamepad);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && jogoAtivo && !estado.fimDeJogo) {
    if (pausado) continuarJogo();
    else pausarJogo();
    return;
  }
  if (jogoBloqueado()) return;
  const letra = e.key.toUpperCase();
  if (letra.length === 1 && letra >= "A" && letra <= "Z") {
    tentarLetra(letra);
  }
});

// ---------- Lógica principal ----------
function tentarLetra(letra) {
  if (jogoBloqueado() || estado.letrasTentadas.has(letra)) return;
  if (document.querySelector(".modal.show")) return;

  estado.letrasTentadas.add(letra);
  const palavra = palavraAtual().palavra;
  const tecla = el.teclado.querySelector(`[data-letra="${letra}"]`);
  tecla.disabled = true;

  if (palavra.includes(letra)) {
    tecla.classList.add("certa");
    const reveladas = revelarLetra(letra);
    estado.pontos += reveladas * PONTOS_LETRA;

    if (palavraCompleta()) {
      estado.pontos += PONTOS_PALAVRA;
      estado.acertosPalavras++;
      atualizarPainel();
      setTimeout(() => mostrarResultado(true), 600);
      return;
    }
  } else {
    tecla.classList.add("errada");
    estado.errosRodada++;
    estado.errosTotais++;
    estado.pontos = Math.max(0, estado.pontos - PENALIDADE_ERRO);
    mostrarParteCorpo(estado.errosRodada);
    el.panelForca.classList.remove("tremor");
    void el.panelForca.offsetWidth;
    el.panelForca.classList.add("tremor");

    if (estado.errosRodada >= MAX_ERROS) {
      atualizarPainel();
      revelarPalavraInteira();
      setTimeout(() => mostrarResultado(false), 800);
      return;
    }
  }
  atualizarPainel();
}

function revelarLetra(letra) {
  const palavra = palavraAtual().palavra;
  let reveladas = 0;
  [...palavra].forEach((l, i) => {
    if (l === letra) {
      const caixa = el.palavra.children[i];
      caixa.textContent = letra;
      caixa.classList.add("revelada");
      reveladas++;
    }
  });
  return reveladas;
}

function revelarPalavraInteira() {
  const palavra = palavraAtual().palavra;
  [...palavra].forEach((l, i) => {
    el.palavra.children[i].textContent = l;
  });
}

function palavraCompleta() {
  return [...el.palavra.children].every((c) => c.textContent.trim() !== "");
}

function desenharPalavra() {
  el.palavra.innerHTML = "";
  [...palavraAtual().palavra].forEach(() => {
    const caixa = document.createElement("div");
    caixa.className = "letra-caixa";
    caixa.textContent = "";
    el.palavra.appendChild(caixa);
  });
}

// ---------- Dicas extras (revelar letra) ----------
el.btnDica.addEventListener("click", () => {
  if (estado.dicasRestantes <= 0 || jogoBloqueado()) return;

  const palavra = palavraAtual().palavra;
  const ocultas = [...new Set([...palavra])].filter((l) => !estado.letrasTentadas.has(l));
  if (ocultas.length === 0) return;

  const letra = ocultas[Math.floor(Math.random() * ocultas.length)];
  estado.dicasRestantes--;
  atualizarPainel();
  tentarLetra(letra);
});

// ---------- Forca (SVG + lista) ----------
function mostrarParteCorpo(n) {
  const parte = document.getElementById(`parte-${n}`);
  if (parte) parte.classList.add("visivel");
  const item = el.listaPartes.querySelector(`[data-parte="${n}"]`);
  if (item) item.classList.add("perdida");
}

function resetarForca() {
  for (let i = 1; i <= MAX_ERROS; i++) {
    const parte = document.getElementById(`parte-${i}`);
    if (parte) parte.classList.remove("visivel");
    const item = el.listaPartes.querySelector(`[data-parte="${i}"]`);
    if (item) item.classList.remove("perdida");
  }
}

// ---------- Painel / gamificação ----------
function atualizarPainel() {
  el.pontos.textContent = estado.pontos;
  el.erros.textContent = estado.errosRodada;
  el.palavraAtual.textContent = Math.min(estado.indice + 1, TOTAL_PALAVRAS);
  el.dicasRestantes.textContent = estado.dicasRestantes;
  el.btnDica.disabled = estado.dicasRestantes <= 0;

  const nivel = [...NIVEIS].reverse().find((n) => estado.pontos >= n.min);
  el.nivel.textContent = nivel.nome;

  const medalha = [...MEDALHAS].reverse().find((m) => estado.pontos >= m.min);
  el.medalha.textContent = medalha.nome;
  el.medalhaIcone.className = `bi ${medalha.icone} medal-icon`;

  const progresso = Math.round((estado.indice / TOTAL_PALAVRAS) * 100);
  el.barraProgresso.style.width = `${progresso}%`;
  el.barraProgresso.textContent = `${progresso}%`;
}

// ---------- Resultado da rodada ----------
function mostrarResultado(venceu) {
  const icone = document.getElementById("resultadoIcone");
  const titulo = document.getElementById("resultadoTitulo");
  const palavra = document.getElementById("resultadoPalavra");
  const info = document.getElementById("resultadoInfo");

  palavra.textContent = palavraAtual().palavra;

  if (venceu) {
    icone.className = "bi bi-shield-fill-check resultado-icone text-success";
    titulo.textContent = "AMEAÇA NEUTRALIZADA!";
    titulo.className = "resultado-titulo mt-2 text-success";
    info.textContent = `+${PONTOS_PALAVRA} pontos de bônus! Você errou ${estado.errosRodada} vez(es) nesta palavra.`;
  } else {
    icone.className = "bi bi-bug-fill resultado-icone text-danger";
    titulo.textContent = "SISTEMA INVADIDO!";
    titulo.className = "resultado-titulo mt-2 text-danger";
    info.textContent = "A forca foi completada. A palavra era esta acima. Estude e tente de novo!";
  }

  const btnProxima = document.getElementById("btnProxima");
  const ultimaPalavra = estado.indice >= TOTAL_PALAVRAS - 1;
  btnProxima.innerHTML = ultimaPalavra
    ? 'VER RESULTADO FINAL <i class="bi bi-flag-fill ms-1"></i>'
    : 'PRÓXIMA PALAVRA <i class="bi bi-arrow-right-circle-fill ms-1"></i>';

  modalResultado.show();
  setTimeout(atualizarFocoJoystick, 350);
}

document.getElementById("btnProxima").addEventListener("click", () => {
  modalResultado.hide();
  estado.indice++;
  if (estado.indice >= TOTAL_PALAVRAS) {
    fimDeJogo();
  } else {
    iniciarRodada();
  }
});

// ---------- Fim de jogo ----------
function fimDeJogo() {
  estado.fimDeJogo = true;

  el.barraProgresso.style.width = "100%";
  el.barraProgresso.textContent = "100%";

  document.getElementById("fimPontos").textContent = estado.pontos;
  document.getElementById("fimAcertos").textContent = `${estado.acertosPalavras}/${TOTAL_PALAVRAS}`;
  document.getElementById("fimErros").textContent = estado.errosTotais;

  const medalha = [...MEDALHAS].reverse().find((m) => estado.pontos >= m.min);
  document.getElementById("fimMedalha").textContent = medalha.nome;

  const mensagem = document.getElementById("fimMensagem");
  if (estado.errosTotais === 0) {
    mensagem.textContent = "PERFEITO! Nenhum erro — você é um verdadeiro mestre da cibersegurança!";
  } else if (estado.acertosPalavras >= 8) {
    mensagem.textContent = `Excelente! Apenas ${estado.errosTotais} erro(s). Lembre-se: ganha quem erra menos!`;
  } else if (estado.acertosPalavras >= 5) {
    mensagem.textContent = `Bom trabalho! Foram ${estado.errosTotais} erros no total. Continue estudando para errar menos!`;
  } else {
    mensagem.textContent = `Foram ${estado.errosTotais} erros. Revise os conceitos de segurança e tente novamente!`;
  }

  const entrada = {
    nome: estado.nomeJogador || "Jogador",
    pontos: estado.pontos,
    erros: estado.errosTotais,
    acertos: estado.acertosPalavras,
    data: dataAtualISO(),
  };

  const recordeBox = document.getElementById("fimRecorde");
  recordeBox.classList.add("d-none");
  if (entrouNoTop5(entrada)) {
    const top5 = salvarNoRanking(entrada);
    const pos = top5.findIndex(
      (r) => r.nome === entrada.nome && r.data === entrada.data
    ) + 1;
    recordeBox.classList.remove("d-none");
    if (pos === 1) {
      recordeBox.innerHTML = '<i class="bi bi-trophy-fill text-warning"></i> NOVO LÍDER! VOCÊ ULTRAPASSOU O TOPO!';
    } else {
      recordeBox.innerHTML = `<i class="bi bi-star-fill text-warning"></i> VOCÊ ENTROU NO TOP 5 — ${pos}º LUGAR!`;
    }
  }
  renderizarRanking();

  modalFimJogo.show();
  setTimeout(atualizarFocoJoystick, 350);
}

document.getElementById("btnJogarNovamente").addEventListener("click", () => {
  modalFimJogo.hide();
  setJogoAtivo(true);
  novoJogo();
});

el.btnNovoJogo.addEventListener("click", () => {
  if (!jogoAtivo) return;
  pausado = false;
  elControles.overlayPausa.classList.add("d-none");
  novoJogo();
});

// ---------- Rodapé ----------
document.getElementById("anoAtual").textContent = new Date().getFullYear();

// ---------- Áudio de fundo ----------
const audioUnisuam = document.getElementById("audioUnisuam");
const btnAudio = document.getElementById("btnAudio");
const iconeAudio = document.getElementById("iconeAudio");
const telaInicio = document.getElementById("telaInicio");
const btnIniciar = document.getElementById("btnIniciar");

audioUnisuam.volume = 0.45;

let audioAtivo = true;

function atualizarIconeAudio() {
  iconeAudio.className = audioAtivo && !audioUnisuam.muted
    ? "bi bi-volume-up-fill"
    : "bi bi-volume-mute-fill";
  btnAudio.classList.toggle("mudo", !audioAtivo || audioUnisuam.muted);
}

function iniciarAudio() {
  if (!audioAtivo) return;
  audioUnisuam.muted = false;
  const playPromise = audioUnisuam.play();
  if (playPromise) {
    playPromise.catch(() => {
      audioUnisuam.muted = true;
      atualizarIconeAudio();
    });
  }
  atualizarIconeAudio();
}

btnAudio.addEventListener("click", () => {
  if (audioUnisuam.paused && audioAtivo) {
    iniciarAudio();
    return;
  }
  audioAtivo = !audioAtivo;
  audioUnisuam.muted = !audioAtivo;
  if (audioAtivo) iniciarAudio();
  atualizarIconeAudio();
});

btnIniciar.addEventListener("click", () => {
  const nome = elControles.nomeJogador.value.trim();
  if (!nome) {
    elControles.nomeJogador.focus();
    elControles.nomeJogador.classList.add("is-invalid");
    return;
  }
  elControles.nomeJogador.classList.remove("is-invalid");

  try {
    localStorage.setItem(NOME_KEY, nome);
  } catch (_) { /* localStorage indisponível */ }

  estado.nomeJogador = nome;
  telaInicio.classList.add("oculta");
  setJogoAtivo(true);
  iniciarAudio();
  novoJogo();
});

elControles.btnPausar.addEventListener("click", () => {
  if (pausado) continuarJogo();
  else pausarJogo();
});

elControles.btnContinuar.addEventListener("click", continuarJogo);
elControles.btnSair.addEventListener("click", sairJogo);

elControles.nomeJogador.addEventListener("input", () => {
  elControles.nomeJogador.classList.remove("is-invalid");
});

// ---------- Início ----------
inicializarRanking();

try {
  const nomeSalvo = localStorage.getItem(NOME_KEY);
  if (nomeSalvo) elControles.nomeJogador.value = nomeSalvo;
} catch (_) { /* localStorage indisponível */ }

renderizarRanking();
atualizarIconeAudio();
atualizarFocoJoystick();

[...navigator.getGamepads()].filter(Boolean).forEach((gp) => {
  conectarGamepad({ gamepad: gp });
});
