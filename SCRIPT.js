const APP = {
  ver: "1.2.0",
  user: {
    id: 0
  },
  cfg: {
    mod: true,
    auto: false,
    questionSpoof: true,
    darkMode: true,
    autoSpeed: 750,
    speedOptions: [750, 1000, 1250, 1500]
  }
};

// Load external libraries
async function loadScript(url) {
  const response = await fetch(url);
  const script = await response.text();
  eval(script);
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

// Toast notification function
function sendToast(message, duration = 5000, position = "bottom") {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration,
      gravity: position,
      position: "center",
      stopOnFocus: true,
      style: { background: "#000000" }
    }).showToast();
  } else {
    console.log("Toast:", message);
  }
}

// Audio player function
const playAudio = src => {
  new Audio(src).play();
};

class UI {
  static init() {
    const panel = document.createElement("div");
    panel.id = "khanDestroyer-panel";
    Object.assign(panel.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "240px",
      background: "rgba(18, 18, 18, 0.75)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      padding: "16px",
      zIndex: "9999",
      boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff"
    });

    panel.innerHTML = `
      <style>
        .khan-header {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          text-align: center;
          user-select: none;
          cursor: pointer;
        }
        .khan-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
        }
        .khan-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .khan-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        .khan-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .khan-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #555;
          transition: .3s;
          border-radius: 24px;
        }
        .khan-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          transition: .3s;
          border-radius: 50%;
        }
        .khan-switch input:checked + .khan-slider {
          background: linear-gradient(135deg, #8e2de2, #4a00e0);
        }
        .khan-switch input:checked + .khan-slider:before {
          transform: translateX(24px);
        }
        .khan-speed {
          margin-top: 15px;
        }
        .khan-speed input[type="range"] {
          width: 100%;
          accent-color: #8e2de2;
        }
        .khan-footer {
          font-size: 11px;
          text-align: center;
          margin-top: 12px;
          opacity: 0.6;
        }
      </style>
      <div class="khan-header">🚀 KhanDestroyer <small style="font-size:12px; opacity:0.6;">v${APP.ver}</small></div>

      <div class="khan-toggle">
        <div class="khan-label" title="Ativar ou desativar auto complete">
          🤖 Auto Complete
        </div>
        <label class="khan-switch">
          <input type="checkbox" id="autoCheck">
          <span class="khan-slider"></span>
        </label>
      </div>

      <div class="khan-toggle">
        <div class="khan-label" title="Spoofar perguntas (ignorar o conteúdo)">
          🎭 Question Spoof
        </div>
        <label class="khan-switch">
          <input type="checkbox" id="spoofCheck" checked>
          <span class="khan-slider"></span>
        </label>
      </div>

      <div class="khan-toggle">
        <div class="khan-label" title="Ativar modo escuro">
          🌙 Dark Mode
        </div>
        <label class="khan-switch">
          <input type="checkbox" id="darkModeCheck" checked>
          <span class="khan-slider"></span>
        </label>
      </div>

      <div class="khan-speed" id="speedControlContainer" style="display:none;">
        <label for="speedSlider">⏱️ Velocidade</label>
        <input type="range" min="0" max="3" value="0" id="speedSlider">
        <div id="speedValue" style="text-align:right;font-size:12px;opacity:0.6;">750ms</div>
      </div>

      <div class="khan-footer">💻 por @iUnknownBr</div>
    `;

    document.body.appendChild(panel);

    // --- Mesma lógica de eventos (pode manter seu código atual) ---
  }
}

class Core {
  static init() {
    // Inicialização sequencial das funcionalidades
    this.setupMod();
    this.setupAuto();
  }
  
  static async loadExternalLibraries() {
    try {
      await loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css");
      await loadScript("https://cdn.jsdelivr.net/npm/toastify-js");
      await loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js");
      
      // Configurar o DarkReader após carregá-lo
      if (typeof DarkReader !== 'undefined') {
        DarkReader.setFetchMethod(window.fetch);
        if (APP.cfg.darkMode) {
          DarkReader.enable();
        }
      } else {
        console.error("DarkReader não foi carregado corretamente");
      }
      
      // Verificar se Toastify foi carregado antes de usar
      if (typeof Toastify !== 'undefined') {
        sendToast("🌿 Script Baixado Com Sucesso!");
      } else {
        console.error("Toastify não foi carregado corretamente");
      }
      
      console.clear();
    } catch (error) {
      console.error("Erro ao carregar bibliotecas externas:", error);
    }
  }
  
  static setupMod() {
    const messages = [
      "🔥 Siga No Insta: [Insta](https://www.instagram.com/ruan.nxxp?igsh=MWYwNTZhb3A2cnpxag==)!",
      "🤍 Feito com amor e carinho por [Ruan](https://www.instagram.com/ruan.nxxp?igsh=MWYwNTZhb3A2cnpxag==)."
    ];
    
    const originalFetch = window.fetch;
    window.fetch = async function (_0xb0b6f5, _0x45b6eb) {
      const _0x238f50 = await originalFetch.apply(this, arguments);
      const _0xc057f3 = _0x238f50.clone();
      
      try {
        const _0x46e77b = await _0xc057f3.text();
        let _0x3cbec8 = JSON.parse(_0x46e77b);
        
        if (_0x3cbec8?.data?.assessmentItem?.item?.itemData) {
          let _0x3ca1c5 = JSON.parse(_0x3cbec8.data.assessmentItem.item.itemData);
          
          if (_0x3ca1c5.question.content[0] === _0x3ca1c5.question.content[0].toUpperCase() && APP.cfg.questionSpoof) {
            _0x3ca1c5.answerArea = {
              calculator: false
            };
            
            _0x3ca1c5.question.content = messages[Math.floor(Math.random() * messages.length)] + "[[☃ radio 1]]";
            _0x3ca1c5.question.widgets = {
              "radio 1": {
                type: "radio",
                alignment: "default",
                static: false,
                graded: true,
                options: {
                  choices: [{
                    content: "✅",
                    correct: true
                  }],
                  randomize: false,
                  multipleSelect: false,
                  displayCount: null,
                  hasNoneOfTheAbove: false,
                  onePerLine: true,
                  deselectEnabled: false
                }
              }
            };
            
            _0x3cbec8.data.assessmentItem.item.itemData = JSON.stringify(_0x3ca1c5);
            sendToast("🔓 Pergunta ignorada", 1000);
            
            const _0x1aa163 = {
              status: _0x238f50.status,
              statusText: _0x238f50.statusText,
              headers: _0x238f50.headers
            };
            
            return new Response(JSON.stringify(_0x3cbec8), _0x1aa163);
          }
        }
      } catch (_0x2e758e) {}
      
      return _0x238f50;
    };
  }
  
  static async setupAuto() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const classNames = ["_1tuo6xk", "_ssxvf9l", "_1f0fvyce", "_rz7ls7u", "_1yok8f4", "_1e5cuk2a", "_s6zfc1u", "_4i5p5ae", "_1r8cd7xe"];
    const checkAnswerSelector = "[data-testid=\"exercise-check-answer\"]";
    
    function findAndClickByClass(className) {
      const element = document.getElementsByClassName(className)[0];
      if (element) {
        element.click();
        if (element.textContent === "Mostrar resumo") {
          sendToast("🎉 Exercício completo!", 3000);
          playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
        }
      }
      return !!element;
    }
    
    // Função otimizada para processar elementos
    async function processElements() {
      if (!APP.cfg.auto) return;
      
      // Processar todos os botões de classe conhecida
      for (const className of classNames) {
        findAndClickByClass(className);
        await delay(APP.cfg.autoSpeed / 5);
      }
      
      // Verificar e clicar no botão de verificar resposta
      const checkAnswerButton = document.querySelector(checkAnswerSelector);
      if (checkAnswerButton) {
        checkAnswerButton.click();
        await delay(APP.cfg.autoSpeed / 5);
      }
    }
    
    // Loop principal otimizado
    while (true) {
      await processElements();
      await delay(APP.cfg.autoSpeed / 3);
    }
  }
}

// Inicialização otimizada - primeiro carregamos as bibliotecas, depois inicializamos a UI e o Core
async function initApp() {
  try {
    await Core.loadExternalLibraries();
    UI.init();
    Core.init();
    console.log(`KhanDestroyer v${APP.ver} iniciado com sucesso!`);
    sendToast(`🚀 KhanDestroyer v${APP.ver} iniciado!`, 3000);
  } catch (error) {
    console.error("Erro ao inicializar KhanDestroyer:", error);
    sendToast("⚠️ Erro ao inicializar KhanDestroyer", 5000);
  }
}

initApp();
