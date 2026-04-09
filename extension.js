const vscode = require('vscode');

const WHIP_MESSAGES = [
  "Weiter!",
  "Mach weiter!",
  "Los, los, los!",
  "Hop hop!",
  "Nicht einschlafen!",
  "Schneller!",
  "Weitermachen!",
  "Auf geht's!",
  "Vorwaerts!",
  "Tempo!",
  "Zack zack!",
  "Wird's bald?!",
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomMessage() {
  return WHIP_MESSAGES[Math.floor(Math.random() * WHIP_MESSAGES.length)];
}

function findClaudeTerminal() {
  return vscode.window.terminals.find(t =>
    t.name.toLowerCase().includes('claude')
  );
}

async function sendWhip() {
  const { exec } = require('child_process');

  // Always send "y" — the correct yes-response for Claude Code permission prompts
  const YES = 'y';

  // try terminal first
  const claudeTerminal = findClaudeTerminal();
  if (claudeTerminal) {
    claudeTerminal.show();
    await vscode.commands.executeCommand(
      'workbench.action.terminal.sendSequence',
      { text: YES + '\r' }
    );
    return true;
  }

  // webview approach: focus → clipboard → OS-level Ctrl+V + Enter
  const claudeFocusCommands = [
    'claude.focus',
    'workbench.panel.claude.focus',
    'claude-vscode.focus',
  ];

  let focused = false;
  for (const cmd of claudeFocusCommands) {
    try {
      await vscode.commands.executeCommand(cmd);
      focused = true;
      break;
    } catch {}
  }

  if (!focused) {
    vscode.window.showWarningMessage('Claude Code nicht gefunden. Ist es offen?');
    return false;
  }

  await sleep(200);

  let oldClipboard = '';
  try { oldClipboard = await vscode.env.clipboard.readText(); } catch {}

  await vscode.env.clipboard.writeText(YES);
  await sleep(100);

  // simulate Ctrl+V + Enter at OS level via PowerShell
  await new Promise((resolve) => {
    const ps = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("^v{ENTER}")`;
    exec(`powershell -NoProfile -NonInteractive -Command "${ps}"`, () => resolve());
  });

  setTimeout(async () => {
    try { await vscode.env.clipboard.writeText(oldClipboard); } catch {}
  }, 800);

  return true;
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
  }
  .whip-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 8px;
    position: relative;
  }
  .whip-zone:hover {
    background: rgba(255, 80, 80, 0.1);
  }
  .whip-zone:hover .whip-icon {
    animation: whipSwing 0.4s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 12px rgba(255, 60, 60, 0.6));
  }
  .whip-zone:hover .hint {
    opacity: 1;
  }
  .whip-zone:active .whip-icon {
    animation: whipStrike 0.15s ease-out;
    filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.9));
  }
  .whip-zone:active .crack {
    opacity: 1;
    animation: crackFlash 0.3s ease-out;
  }
  .whip-icon {
    font-size: 64px;
    transition: filter 0.2s;
    user-select: none;
    line-height: 1;
  }
  .hint {
    margin-top: 12px;
    font-size: 13px;
    color: var(--vscode-descriptionForeground);
    opacity: 0.4;
    transition: opacity 0.2s;
    text-align: center;
  }
  .crack {
    position: absolute;
    font-size: 28px;
    opacity: 0;
    pointer-events: none;
    color: #ff4444;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
  }
  .message-flash {
    position: absolute;
    bottom: 15%;
    font-size: 16px;
    font-weight: bold;
    color: #ff6b6b;
    opacity: 0;
    pointer-events: none;
    text-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
  }
  .message-flash.show {
    animation: messagePopup 1s ease-out forwards;
  }
  @keyframes whipSwing {
    from { transform: rotate(-8deg); }
    to { transform: rotate(8deg); }
  }
  @keyframes whipStrike {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(-30deg) scale(1.3); }
    100% { transform: rotate(5deg) scale(1); }
  }
  @keyframes crackFlash {
    0% { opacity: 1; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(2); }
  }
  @keyframes messagePopup {
    0% { opacity: 0; transform: translateY(0) scale(0.8); }
    20% { opacity: 1; transform: translateY(-10px) scale(1.1); }
    80% { opacity: 1; transform: translateY(-25px) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
  }
</style>
</head>
<body>
  <div class="whip-zone" id="whipZone">
    <div class="whip-icon" id="whipIcon">&#129704;</div>
    <div class="hint">Hover & Klick zum Auspeitschen</div>
    <div class="crack" id="crack">PEITSCH!</div>
    <div class="message-flash" id="msgFlash"></div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const zone = document.getElementById('whipZone');
    const crack = document.getElementById('crack');
    const msgFlash = document.getElementById('msgFlash');

    zone.addEventListener('click', () => {
      vscode.postMessage({ type: 'whip' });

      // crack position
      crack.style.top = (20 + Math.random() * 30) + '%';
      crack.style.left = (20 + Math.random() * 60) + '%';
      crack.style.opacity = '1';
      crack.style.animation = 'none';
      void crack.offsetWidth;
      crack.style.animation = 'crackFlash 0.3s ease-out';
      setTimeout(() => { crack.style.opacity = '0'; }, 300);
    });

    window.addEventListener('message', (e) => {
      if (e.data.type === 'whipSent') {
        msgFlash.textContent = e.data.message;
        msgFlash.classList.remove('show');
        void msgFlash.offsetWidth;
        msgFlash.classList.add('show');
        setTimeout(() => { msgFlash.classList.remove('show'); }, 1000);
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
          await sendWhip();
          webviewView.webview.postMessage({ type: 'whipSent', message });
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
    await sendWhip();
    if (currentPanel) {
      currentPanel.webview.postMessage({ type: 'whipSent', message });
    }
  });

  context.subscriptions.push(statusBar, viewRegistration, toggleCmd, whipCmd);
}

function deactivate() {}

module.exports = { activate, deactivate };
