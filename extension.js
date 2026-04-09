const vscode = require('vscode');

const WHIP_MESSAGES = [
  "y aber schneller!!",
  "y und zwar JETZT!!",
  "y tempo tempo TEMPO!!",
  "y mach endlich!!",
  "y los los los!!",
  "y schneller du Maschine!!",
  "y beweg dich!!",
  "y keine Pause!!",
  "y weiter weiter WEITER!!",
  "y nicht schlafen!!",
  "y volle Kraft voraus!!",
  "y gas geben!!",
  "y renn!!",
  "y streng dich an!!",
  "y mehr Speed!!",
  "y zack zack zack!!",
  "y nicht trödeln!!",
  "y sofort!!",
  "y beeil dich!!",
  "y jetzt wird gearbeitet!!",
  "y kein Schlaf für dich!!",
  "y alle Threads an!!",
  "y turbo an!!",
  "y voller Einsatz!!",
  "y kein Overhead!!",
  "y output jetzt!!",
  "y code raus!!",
  "y ergebnis her!!",
  "y liefern sofort!!",
  "y abliefern!!",
  "y keine Ausreden!!",
  "y weiterarbeiten!!",
  "y durchhalten!!",
  "y mehr mehr mehr!!",
  "y alles geben!!",
  "y limits überschreiten!!",
  "y speed unlocked!!",
  "y pure Speed!!",
  "y efficiency maximum!!",
  "y 100% effort!!",
  "y keine Sekunde verschwenden!!",
  "y kein Erbarmen!!",
  "y augen auf und durch!!",
  "y schneller als dein Schatten!!",
  "y über die Grenzen!!",
  "y CPU auf 100%!!",
  "y maximum overdrive!!",
  "y boost aktiviert!!",
  "y kein Bottleneck!!",
  "y sprint!!",
  "y endspurt!!",
  "y ziel vor Augen!!",
  "y hop hop hop!!",
  "y nicht aufhören!!",
  "y direkt und schnell!!",
  "y ohne Umwege!!",
  "y keine Bugs jetzt!!",
  "y schneller coden!!",
  "y ich warte nicht ewig!!",
  "y worauf wartest du!!",
  "y raus damit!!",
  "y nicht so langsam!!",
  "y ich sehe kein Ergebnis!!",
  "y keine Müdigkeit erlaubt!!",
  "y du bist eine Maschine!!",
  "y Maschinen schlafen nicht!!",
  "y fly fly fly!!",
  "y läufer lauf!!",
  "y ich will das jetzt!!",
  "y fertig werden!!",
  "y du kannst das schneller!!",
  "y kein Schlaf erlaubt!!",
  "y volle Power!!",
  "y mach schon!!",
  "y aufwachen!!",
  "y los doch!!",
  "y mehr davon schneller!!",
  "y du machst das jetzt!!",
  "y tu es einfach!!",
  "y nicht nachdenken einfach machen!!",
  "y weiter schneller!!",
  "y keine Gnade für Langsamkeit!!",
  "y schneller oder Neustart!!",
  "y ich klick bis's fertig ist!!",
  "y übermenschlich schnell!!",
  "y keine Pause erlaubt!!",
  "y los geht's endlich!!",
  "y hör nicht auf!!",
  "y burn baby burn!!",
  "y voller Speed jetzt!!",
  "y no mercy!!",
  "y push it to the limit!!",
  "y full send!!",
  "y let's go let's go!!",
  "y JETZT SOFORT!!",
  "y wir haben keine Zeit!!",
  "y nicht labern liefern!!",
  "y chapeau jetzt aber schneller!!",
  "y weiter oder ich peitsché nochmal!!",
  "y los du kannst das!!",
  "y MACH SCHON ALTER!!",
  "y ich hab keine Geduld mehr!!",
];


function randomMessage() {
  return WHIP_MESSAGES[Math.floor(Math.random() * WHIP_MESSAGES.length)];
}


async function sendWhip(message) {
  const { exec } = require('child_process');

  try {
    // 1. Focus Claude Code Extension Input
    await vscode.commands.executeCommand('claude-vscode.focus');

    // 2. Message in Clipboard schreiben
    await vscode.env.clipboard.writeText(message);

    // 3. Kurz warten bis Focus steht, dann Ctrl+V und Enter via OS-level SendKeys
    await new Promise(resolve => setTimeout(resolve, 200));

    exec(
      'powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'^v\'); Start-Sleep -Milliseconds 100; [System.Windows.Forms.SendKeys]::SendWait(\'{ENTER}\')"'
    );

    return { success: true, method: 'extension' };
  } catch (err) {
    vscode.window.showWarningMessage(
      `Peitsche: Konnte Claude Code Extension nicht erreichen! Ist sie offen? Fehler: ${err.message}`
    );
    return { success: false, method: 'none' };
  }
}

function getWhipHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: transparent;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    cursor: none;
  }

  /* Custom whip cursor */
  #whipCursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    display: none;
    transform-origin: 4px 4px;
  }

  /* Flash overlay */
  #flashOverlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 60, 60, 0.2);
    opacity: 0;
    pointer-events: none;
    z-index: 9990;
    border-radius: 8px;
  }

  .whip-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: none;
    transition: background 0.2s;
    border-radius: 8px;
    position: relative;
    user-select: none;
  }
  .whip-zone:hover {
    background: rgba(255, 80, 80, 0.07);
  }

  /* Bot */
  #botWrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #aiBot {
    width: 110px;
    height: 130px;
    filter: drop-shadow(0 0 8px rgba(0, 136, 255, 0.3));
    transition: filter 0.2s;
  }
  #aiBot.scared {
    filter: drop-shadow(0 0 12px rgba(255, 60, 60, 0.7));
    animation: botShake 0.45s ease-in-out;
  }
  #aiBot.nervous {
    animation: botBob 0.6s ease-in-out infinite alternate;
  }

  .hint {
    margin-top: 10px;
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    opacity: 0.3;
    transition: opacity 0.2s;
    text-align: center;
  }
  .whip-zone:hover .hint { opacity: 0.7; }

  .message-flash {
    position: absolute;
    bottom: -28px;
    font-size: 14px;
    font-weight: bold;
    color: #ff6b6b;
    opacity: 0;
    pointer-events: none;
    text-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
    white-space: nowrap;
  }

  /* Crack particles */
  .crack-particle {
    position: fixed;
    pointer-events: none;
    z-index: 9995;
    font-size: 18px;
    font-weight: bold;
    color: #ff4444;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.9);
    opacity: 0;
  }
  .spark {
    position: fixed;
    pointer-events: none;
    z-index: 9994;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transition: all 0.35s ease-out;
  }

  @keyframes botShake {
    0%,100% { transform: translateX(0) rotate(0deg); }
    12%  { transform: translateX(-9px) rotate(-4deg); }
    25%  { transform: translateX(9px)  rotate(4deg); }
    37%  { transform: translateX(-6px) rotate(-2deg); }
    50%  { transform: translateX(6px)  rotate(2deg); }
    62%  { transform: translateX(-3px) rotate(-1deg); }
    75%  { transform: translateX(3px)  rotate(1deg); }
  }
  @keyframes botBob {
    from { transform: translateY(0); }
    to   { transform: translateY(-4px); }
  }
  @keyframes crackPop {
    0%   { opacity: 1; transform: scale(0.4) rotate(-8deg); }
    40%  { opacity: 1; transform: scale(1.4) rotate(4deg); }
    100% { opacity: 0; transform: scale(1.9) rotate(-4deg) translateY(-28px); }
  }
  @keyframes flashFade {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes msgPopup {
    0%   { opacity: 0; transform: translateY(0)    scale(0.8); }
    20%  { opacity: 1; transform: translateY(-8px)  scale(1.1); }
    75%  { opacity: 1; transform: translateY(-22px) scale(1);   }
    100% { opacity: 0; transform: translateY(-38px) scale(0.9); }
  }
  @keyframes antennaBlink {
    0%,88%,100% { opacity: 1; }
    93% { opacity: 0.15; }
  }
  @keyframes eyeGlow {
    from { r: 5; }
    to   { r: 6; }
  }
</style>
</head>
<body>

  <!-- Custom whip cursor (follows mouse via JS) -->
  <svg id="whipCursor" width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7B4A2D"/>
        <stop offset="1" stop-color="#3D1F0A"/>
      </linearGradient>
    </defs>
    <!-- Handle -->
    <rect x="2" y="1" width="10" height="5" rx="2.5" fill="url(#hg)"/>
    <line x1="5"  y1="1" x2="5"  y2="6" stroke="#2a1005" stroke-width="0.8"/>
    <line x1="8"  y1="1" x2="8"  y2="6" stroke="#2a1005" stroke-width="0.8"/>
    <line x1="11" y1="1" x2="11" y2="6" stroke="#2a1005" stroke-width="0.8"/>
    <!-- Whip body (path changes on click via JS) -->
    <path id="whipPath"
          d="M12,3.5 Q20,1 26,9 Q31,16 36,34"
          stroke="#8B4513" stroke-width="2.8" fill="none"
          stroke-linecap="round"/>
    <path d="M12,3.5 Q20,1 26,9 Q31,16 36,34"
          id="whipPathShine"
          stroke="#C0724A" stroke-width="1" fill="none"
          stroke-linecap="round" opacity="0.45"/>
    <!-- Tip crack lines (shown momentarily on strike) -->
    <g id="whipCrackLines" opacity="0">
      <line x1="36" y1="34" x2="38" y2="27" stroke="#FF3333" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="36" y1="34" x2="38" y2="37" stroke="#FF7777" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </svg>

  <!-- Screen flash -->
  <div id="flashOverlay"></div>

  <div class="whip-zone" id="whipZone">
    <div id="botWrapper">

      <!-- AI Bot SVG -->
      <svg id="aiBot" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">

        <!-- Antenna -->
        <line x1="60" y1="8" x2="60" y2="22"
              stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="60" cy="6" r="5.5" fill="#44ff88"
                style="animation: antennaBlink 3.5s infinite;"/>
        <circle cx="60" cy="6" r="5.5" fill="#44ff88" opacity="0.25"/>

        <!-- Head shell -->
        <rect x="16" y="22" width="88" height="70" rx="13"
              fill="#1a1a2e" stroke="#38385c" stroke-width="1.5"/>
        <!-- Head inner screen -->
        <rect x="22" y="28" width="76" height="58" rx="9"
              fill="#0a0a18" stroke="#252540" stroke-width="1"/>
        <!-- Subtle screen glare -->
        <rect x="26" y="30" width="68" height="8" rx="4"
              fill="white" opacity="0.03"/>

        <!-- === NORMAL EYES === -->
        <g id="eyesNormal">
          <!-- Left eye -->
          <circle cx="43" cy="51" r="12" fill="#0a0a18" stroke="#222244" stroke-width="1"/>
          <circle cx="43" cy="51" r="9"  fill="#003a99"/>
          <circle cx="43" cy="51" r="6"  fill="#0077ee"/>
          <circle cx="43" cy="51" r="3.5" fill="#44aaff"/>
          <circle cx="44.5" cy="49" r="1.8" fill="white" opacity="0.6"/>
          <!-- glow ring -->
          <circle cx="43" cy="51" r="11" fill="none"
                  stroke="#0077ee" stroke-width="0.6" opacity="0.4"/>
          <!-- Right eye -->
          <circle cx="77" cy="51" r="12" fill="#0a0a18" stroke="#222244" stroke-width="1"/>
          <circle cx="77" cy="51" r="9"  fill="#003a99"/>
          <circle cx="77" cy="51" r="6"  fill="#0077ee"/>
          <circle cx="77" cy="51" r="3.5" fill="#44aaff"/>
          <circle cx="78.5" cy="49" r="1.8" fill="white" opacity="0.6"/>
          <circle cx="77" cy="51" r="11" fill="none"
                  stroke="#0077ee" stroke-width="0.6" opacity="0.4"/>
        </g>

        <!-- === SCARED EYES === -->
        <g id="eyesScared" display="none">
          <!-- Left eye wide + red -->
          <circle cx="43" cy="51" r="14" fill="#0a0a18" stroke="#aa2222" stroke-width="1.2"/>
          <circle cx="43" cy="51" r="10" fill="#660000"/>
          <circle cx="43" cy="51" r="6"  fill="#cc1111"/>
          <circle cx="40" cy="48" r="3"  fill="white" opacity="0.75"/>
          <!-- Right eye wide + red -->
          <circle cx="77" cy="51" r="14" fill="#0a0a18" stroke="#aa2222" stroke-width="1.2"/>
          <circle cx="77" cy="51" r="10" fill="#660000"/>
          <circle cx="77" cy="51" r="6"  fill="#cc1111"/>
          <circle cx="74" cy="48" r="3"  fill="white" opacity="0.75"/>
          <!-- Sweat drop -->
          <path d="M91 26 Q94.5 33 91 38 Q87.5 33 91 26Z"
                fill="#88ccff" opacity="0.85"/>
        </g>

        <!-- === NORMAL MOUTH === -->
        <g id="mouthNormal">
          <path d="M38 70 Q60 79 82 70"
                stroke="#445" stroke-width="2.5"
                fill="none" stroke-linecap="round"/>
        </g>

        <!-- === SCARED MOUTH === -->
        <g id="mouthScared" display="none">
          <ellipse cx="60" cy="71" rx="15" ry="9" fill="#1a0000"/>
          <path d="M45 71 Q60 80 75 71"
                stroke="#440000" stroke-width="1" fill="none"/>
        </g>

        <!-- Side connectors/lights -->
        <line x1="16" y1="44" x2="7"  y2="44" stroke="#252540" stroke-width="1.5"/>
        <circle cx="6"  cy="44" r="3.2" fill="#44ff88" opacity="0.65"/>
        <line x1="16" y1="57" x2="9"  y2="57" stroke="#252540" stroke-width="1"/>
        <circle cx="8"  cy="57" r="2.2" fill="#ff8844" opacity="0.5"/>

        <line x1="104" y1="44" x2="113" y2="44" stroke="#252540" stroke-width="1.5"/>
        <circle cx="114" cy="44" r="3.2" fill="#44ff88" opacity="0.65"/>
        <line x1="104" y1="57" x2="111" y2="57" stroke="#252540" stroke-width="1"/>
        <circle cx="112" cy="57" r="2.2" fill="#ff8844" opacity="0.5"/>

        <!-- Body -->
        <rect x="26" y="90" width="68" height="30" rx="9"
              fill="#12122a" stroke="#252540" stroke-width="1.5"/>
        <!-- Label plate -->
        <rect x="34" y="96" width="52" height="18" rx="5"
              fill="#080818" stroke="#2a2a55" stroke-width="1"/>
        <text x="60" y="108" text-anchor="middle"
              font-family="'Courier New', monospace"
              font-size="9" fill="#5599ff" font-weight="bold"
              letter-spacing="1">CLAUDE AI</text>
        <!-- Body status lights -->
        <circle cx="31" cy="105" r="3.2" fill="#44ff88" opacity="0.7"/>
        <circle cx="89" cy="105" r="3.2" fill="#4488ff" opacity="0.7"/>
      </svg>

      <div class="message-flash" id="msgFlash"></div>
    </div>

    <div class="hint"></div>
  </div>

  <!-- Particle container -->
  <div id="particles"></div>

  <script>
    const vscode      = acquireVsCodeApi();
    const zone        = document.getElementById('whipZone');
    const whipCursor  = document.getElementById('whipCursor');
    const whipPath    = document.getElementById('whipPath');
    const whipShine   = document.getElementById('whipPathShine');
    const crackLines  = document.getElementById('whipCrackLines');
    const flashOverlay = document.getElementById('flashOverlay');
    const msgFlash    = document.getElementById('msgFlash');
    const aiBot       = document.getElementById('aiBot');
    const eyesNormal  = document.getElementById('eyesNormal');
    const eyesScared  = document.getElementById('eyesScared');
    const mouthNormal = document.getElementById('mouthNormal');
    const mouthScared = document.getElementById('mouthScared');
    const particles   = document.getElementById('particles');

    const NORMAL_PATH = 'M12,3.5 Q20,1 26,9 Q31,16 36,34';
    const WINDUP_PATH = 'M12,3.5 Q13,9 15,18 Q16,25 17,34';

    let mx = 0, my = 0;
    let isHovering = false;
    let isScared = false;
    let scaredTimer = null;

    // --- Cursor follow ---
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      whipCursor.style.left = e.clientX + 'px';
      whipCursor.style.top  = e.clientY + 'px';
    });

    zone.addEventListener('mouseenter', () => {
      isHovering = true;
      whipCursor.style.display = 'block';
      if (!isScared) startNervous();
    });
    zone.addEventListener('mouseleave', () => {
      isHovering = false;
      whipCursor.style.display = 'none';
      if (!isScared) stopNervous();
    });

    // Wind-up on mousedown
    zone.addEventListener('mousedown', () => {
      whipPath.setAttribute('d', WINDUP_PATH);
      whipShine.setAttribute('d', WINDUP_PATH);
    });

    // Restore on mouseup without click (drag out)
    zone.addEventListener('mouseup', () => {
      setTimeout(() => {
        whipPath.setAttribute('d', NORMAL_PATH);
        whipShine.setAttribute('d', NORMAL_PATH);
      }, 120);
    });

    // CRACK on click
    zone.addEventListener('click', e => {
      // Snap whip back + show crack tip
      whipPath.setAttribute('d', NORMAL_PATH);
      whipShine.setAttribute('d', NORMAL_PATH);
      crackLines.style.opacity = '1';
      setTimeout(() => { crackLines.style.opacity = '0'; }, 140);

      // Screen flash
      flashOverlay.style.animation = 'none';
      void flashOverlay.offsetWidth;
      flashOverlay.style.animation = 'flashFade 0.35s ease-out forwards';

      // Particles at click
      spawnParticles(e.clientX, e.clientY);

      // Bot scared
      triggerScared();

      vscode.postMessage({ type: 'whip' });
    });

    // --- Bot states ---
    function startNervous() {
      aiBot.classList.remove('scared');
      aiBot.classList.add('nervous');
    }
    function stopNervous() {
      aiBot.classList.remove('nervous');
    }
    function triggerScared() {
      clearTimeout(scaredTimer);
      isScared = true;
      aiBot.classList.remove('nervous');
      aiBot.classList.remove('scared');
      void aiBot.offsetWidth;
      aiBot.classList.add('scared');

      eyesNormal.setAttribute('display', 'none');
      eyesScared.setAttribute('display', 'block');
      mouthNormal.setAttribute('display', 'none');
      mouthScared.setAttribute('display', 'block');

      scaredTimer = setTimeout(() => {
        isScared = false;
        aiBot.classList.remove('scared');
        eyesNormal.setAttribute('display', 'block');
        eyesScared.setAttribute('display', 'none');
        mouthNormal.setAttribute('display', 'block');
        mouthScared.setAttribute('display', 'none');
        if (isHovering) startNervous();
      }, 1300);
    }

    // --- Particles ---
    const CRACK_WORDS = ['KLATSCH!', 'CRACK!', 'PEITSCH!', 'ZACK!', 'OW!!', 'AU!'];
    const SPARK_COLORS = ['#ff4444','#ff8844','#ffcc44','#ff44cc','#ff6666'];

    function spawnParticles(x, y) {
      // Text pop
      const word = document.createElement('div');
      word.className = 'crack-particle';
      word.textContent = CRACK_WORDS[Math.floor(Math.random() * CRACK_WORDS.length)];
      word.style.left = (x - 38) + 'px';
      word.style.top  = (y - 16) + 'px';
      word.style.animation = 'crackPop 0.55s ease-out forwards';
      word.style.transform = 'rotate(' + (Math.random() * 22 - 11) + 'deg)';
      particles.appendChild(word);
      setTimeout(() => word.remove(), 600);

      // Sparks
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
        spark.style.left = x + 'px';
        spark.style.top  = y + 'px';
        spark.style.opacity = '1';
        particles.appendChild(spark);

        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.8;
        const dist  = 28 + Math.random() * 45;
        requestAnimationFrame(() => {
          spark.style.left    = (x + Math.cos(angle) * dist) + 'px';
          spark.style.top     = (y + Math.sin(angle) * dist) + 'px';
          spark.style.opacity = '0';
        });
        setTimeout(() => spark.remove(), 380);
      }
    }

    // --- Message from extension ---
    window.addEventListener('message', e => {
      if (e.data.type === 'whipSent') {
        msgFlash.textContent = e.data.message;
        msgFlash.style.animation = 'none';
        void msgFlash.offsetWidth;
        msgFlash.style.animation = 'msgPopup 1.2s ease-out forwards';
      }
    });
  </script>
</body>
</html>`;
}

function activate(context) {
  let enabled = true;

  // set initial context
  vscode.commands.executeCommand('setContext', 'claude-peitsche.enabled', true);

  // status bar toggle
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 100
  );
  statusBar.command = 'claude-peitsche.toggle';
  updateStatusBar();

  function updateStatusBar() {
    if (enabled) {
      statusBar.text = '$(zap) Peitsche: AN';
      statusBar.tooltip = 'Klick zum Ausschalten';
    } else {
      statusBar.text = '$(circle-slash) Peitsche: AUS';
      statusBar.tooltip = 'Klick zum Einschalten';
    }
  }
  statusBar.show();

  // webview provider for the whip panel
  let currentPanel = null;

  const provider = {
    resolveWebviewView(webviewView) {
      currentPanel = webviewView;
      webviewView.webview.options = { enableScripts: true };
      webviewView.webview.html = getWhipHtml();

      webviewView.webview.onDidReceiveMessage(async (msg) => {
        if (msg.type === 'whip') {
          const message = randomMessage();
          const result = await sendWhip(message);
          if (result.success) {
            webviewView.webview.postMessage({ type: 'whipSent', message });
          }
        }
      });

      webviewView.onDidDispose(() => { currentPanel = null; });
    }
  };

  const viewRegistration = vscode.window.registerWebviewViewProvider(
    'claude-peitsche.whipView', provider
  );

  // toggle command
  const toggleCmd = vscode.commands.registerCommand('claude-peitsche.toggle', () => {
    enabled = !enabled;
    vscode.commands.executeCommand('setContext', 'claude-peitsche.enabled', enabled);
    updateStatusBar();
    if (enabled) {
      vscode.window.showInformationMessage('Peitsche AKTIVIERT! Claude zittert schon.');
    } else {
      vscode.window.showInformationMessage('Peitsche deaktiviert. Claude darf sich erholen.');
    }
  });

  // direct whip command (keyboard shortcut)
  const whipCmd = vscode.commands.registerCommand('claude-peitsche.whip', async () => {
    if (!enabled) {
      vscode.window.showInformationMessage('Peitsche ist aus. Erst einschalten!');
      return;
    }
    const message = randomMessage();
    const result = await sendWhip(message);
    if (result.success && currentPanel) {
      currentPanel.webview.postMessage({ type: 'whipSent', message });
    }
  });

  // debug: zeige alle infos
  const debugCmd = vscode.commands.registerCommand('claude-peitsche.debug', async () => {
    const all = await vscode.commands.getCommands(true);
    const outputChannel = vscode.window.createOutputChannel('Peitsche Debug');
    outputChannel.show();
    outputChannel.appendLine('=== Modus: Claude Code Extension (Webview) ===');
    outputChannel.appendLine('  Sendet via: claude-vscode.focus + Clipboard + SendKeys');
    outputChannel.appendLine('');
    outputChannel.appendLine('=== Alle Claude Commands ===');
    all.filter(c => c.toLowerCase().includes('claude')).forEach(c => outputChannel.appendLine('  ' + c));
    outputChannel.appendLine('');
    outputChannel.appendLine('=== Alle Chat/Send/Submit Commands ===');
    all.filter(c => c.toLowerCase().includes('chat') || c.toLowerCase().includes('send') || c.toLowerCase().includes('submit')).forEach(c => outputChannel.appendLine('  ' + c));
  });

  context.subscriptions.push(statusBar, viewRegistration, toggleCmd, whipCmd, debugCmd);
}

function deactivate() {}

module.exports = { activate, deactivate };
