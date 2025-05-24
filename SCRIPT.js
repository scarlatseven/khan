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
    panel.innerHTML = `
      <style>
        #khanDestroyer-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 260px;
          max-width: 90vw;
          background: rgba(24, 24, 24, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 16px;
          z-index: 9999;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
          transition: all 0.3s ease;
        }
        .khan-header {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
        }
        .khan-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0;
        }
        .khan-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
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
          top: 0; left: 0; right: 0; bottom: 0;
          background: #444;
          border-radius: 24px;
          transition: .3s;
        }
        .khan-slider:before {
          content: "";
          position: absolute;
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: .3s;
        }
        .khan-switch input:checked + .khan-slider {
          background: linear-gradient(135deg, #8e2de2, #4a00e0);
        }
        .khan-switch input:checked + .khan-slider:before {
          transform: translateX(24px);
        }
        .khan-speed {
          margin-top: 16px;
        }
        .khan-speed input[type="range"] {
          width: 100%;
          accent-color: #8e2de2;
        }
        .khan-footer {
          font-size: 11px;
          text-align: center;
          margin-top: 14px;
          opacity: 0.6;
        }
        .khan-collapse-btn {
          background: none;
          border: none;
          color: #aaa;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .khan-collapse-btn:hover {
          color: #fff;
        }
        .khan-collapsed #khanBody {
          display: none;
        }
        .khan-collapsed {
          width: 60px !important;
          height: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .khan-collapsed .khan-header {
          flex-direction: column;
          font-size: 16px;
          gap: 4px;
        }
      </style>

      <div class="khan-header">
        <span>🚀</span>
        <button class="khan-collapse-btn" title="Minimizar painél">☰</button>
      </div>

      <div id="khanBody">
        <div class="khan-toggle">
          <div class="khan-label" title="Auto Complete">🤖 Auto Complete</div>
          <label class="khan-switch">
            <input type="checkbox" id="autoCheck">
            <span class="khan-slider"></span>
          </label>
        </div>

        <div class="khan-toggle">
          <div class="khan-label" title="Question Spoof">🎭 Question Spoof</div>
          <label class="khan-switch">
            <input type="checkbox" id="spoofCheck" checked>
            <span class="khan-slider"></span>
          </label>
        </div>

        <div class="khan-toggle">
          <div class="khan-label" title="Dark Mode">🌙 Dark Mode</div>
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
      </div>
    `;

    document.body.appendChild(panel);

    // Botão colapsar
    const collapseBtn = panel.querySelector(".khan-collapse-btn");
    collapseBtn.addEventListener("click", () => {
      panel.classList.toggle("khan-collapsed");
    });

    // Adicionar evento de clique ao cabeçalho para encolher/expandir o menu
    const header = document.querySelector('.khandestroyer-header');
    const content = document.querySelector('.khandestroyer-content');
    
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      content.classList.toggle('collapsed');
      
      // Salvar o estado do menu no localStorage
      const isCollapsed = header.classList.contains('collapsed');
      localStorage.setItem('khanDestroyer-collapsed', isCollapsed);
      
      // Mostrar toast informativo
      sendToast(isCollapsed ? "🔼 Menu recolhido" : "🔽 Menu expandido", 1000);
    });
    
    // Verificar se o menu estava recolhido anteriormente
    const wasCollapsed = localStorage.getItem('khanDestroyer-collapsed') === 'true';
    if (wasCollapsed) {
      header.classList.add('collapsed');
      content.classList.add('collapsed');
    }
    
    // Setup event listeners
    document.getElementById("autoCheck").onchange = event => {
      APP.cfg.auto = event.target.checked;
      document.getElementById("speedControlContainer").style.display = APP.cfg.auto ? "flex" : "none";
      sendToast(APP.cfg.auto ? "✅ Auto Complete Enabled" : "❌ Auto Complete Disabled", 2000);
    };
    
    // Configurar o slider de velocidade
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    
    // Definir o valor inicial do slider
    const initialIndex = APP.cfg.speedOptions.indexOf(APP.cfg.autoSpeed);
    speedSlider.value = initialIndex >= 0 ? initialIndex : 0;
    
    // Adicionar evento de mudança ao slider
    speedSlider.oninput = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      APP.cfg.autoSpeed = speed;
      speedValue.textContent = speed + "ms";
    };
    
    // Adicionar evento de mudança completa para mostrar toast
    speedSlider.onchange = () => {
      const index = parseInt(speedSlider.value);
      const speed = APP.cfg.speedOptions[index];
      sendToast(`⏱️ Velocidade alterada para ${speed}ms`, 2000);
    };

    
    document.getElementById("spoofCheck").onchange = event => {
      APP.cfg.questionSpoof = event.target.checked;
      sendToast(APP.cfg.questionSpoof ? "✅ Question Spoof Enabled" : "❌ Question Spoof Disabled", 2000);
    };
    
    document.getElementById("darkModeCheck").onchange = event => {
      APP.cfg.darkMode = event.target.checked;
      if (typeof DarkReader !== 'undefined') {
        if (APP.cfg.darkMode) {
          DarkReader.enable();
          sendToast("🌑 Dark Mode Enabled", 2000);
        } else {
          DarkReader.disable();
          sendToast("☀️ Dark Mode Disabled", 2000);
        }
      } else {
        console.error("DarkReader não está disponível");
        sendToast("⚠️ Dark Mode não disponível. Recarregue a página.", 3000);
      }
    };
    
    // Ativar Dark Mode por padrão
    if (APP.cfg.darkMode && typeof DarkReader !== 'undefined') {
      DarkReader.enable();
    }
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
