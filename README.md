# Cyber Forca — Cursos Tech EAD (UNISUAM)

Jogo da forca gamificado sobre **códigos maliciosos e segurança da informação**, feito com HTML5, CSS3, Bootstrap 5 e JavaScript puro.

## Como jogar

- A cada partida são sorteadas **10 palavras** do banco de termos de segurança da informação.
- Leia a **dica** e clique nas letras (ou use o teclado físico).
- Cada erro adiciona **uma parte do corpo na forca** (7 erros = palavra perdida).
- **Ganha quem errar menos!** O jogo guarda seu recorde no navegador.

### Pontuação

| Ação | Pontos |
|---|---|
| Letra correta | +10 por letra revelada |
| Palavra completa | +50 de bônus |
| Letra errada | −5 |

Você tem **3 dicas extras** por partida (revelam uma letra). Conforme pontua, você sobe de **nível** e ganha **medalhas** (de Recruta Digital até Mestre da Cibersegurança).

## Rodando localmente

Basta abrir o `index.html` no navegador, ou rodar um servidor local:

```bash
npx serve .
```

## Deploy no Vercel

O projeto é um site estático — não precisa de configuração extra.

1. Instale a CLI do Vercel: `npm i -g vercel`
2. Na pasta do projeto, rode: `vercel`
3. Ou conecte o repositório Git no painel do [vercel.com](https://vercel.com) (framework preset: **Other**).

## Áudio

Ao abrir o jogo, uma tela de início pede para clicar em **INICIAR JOGO** — isso ativa o áudio de fundo (`audio/Unisuam.mp3`) e inicia a partida. O botão de volume no cabeçalho liga/desliga o som a qualquer momento.

## Ranking e controles

- Na tela inicial aparece o **Top 5** com ranking padrão: **Rodrigo Braga** em 1º (990 pts, 0 erros) e mais 4 jogadores.
- Ao terminar a partida, scores melhores entram no ranking e a classificação é **reorganizada automaticamente**.
- O ranking fica salvo no navegador (`localStorage`) e persiste no Vercel.
- Durante o jogo, use **PAUSAR** (ou tecla `Esc`) para interromper e **SAIR** para voltar ao menu.

## Joystick / Gamepad

- **Direcional ou analógico esquerdo:** navegar letras / menu
- **Botão A (0):** confirmar letra ou botão
- **Start ou B:** pausar / continuar
- Letra focada aparece com contorno verde neon

## Estrutura

```
ForcaTech/
├── index.html      # Estrutura da página (Bootstrap 5)
├── css/style.css   # Tema cyber escuro
├── js/game.js      # Lógica do jogo e gamificação
├── audio/          # Trilha sonora UNISUAM
├── img/            # Logos (UNISUAM e Rodrigo Braga)
└── vercel.json     # Headers para servir o MP3 no Vercel
```

---

© Todos os direitos reservados — **@rodrigoBraga** · [www.rodrigobragatere.com](https://www.rodrigobragatere.com)
