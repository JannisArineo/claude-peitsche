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

async function whipViaTerminal(terminal, message) {
  terminal.show();
  await vscode.commands.executeCommand(
    'workbench.action.terminal.sendSequence',
    { text: message + '\r' }
  );
  return true;
}

async function whipViaWebview(message) {
  // focus claude input
  try {
    await vscode.commands.executeCommand('claude-vscode.focus');
  } catch {
    vscode.window.showWarningMessage('Claude Code nicht gefunden. Ist es offen?');
    return false;
  }

  await sleep(200);

  // save current clipboard, write message, paste, restore
  let oldClipboard;
  try {
    oldClipboard = await vscode.env.clipboard.readText();
  } catch {
    oldClipboard = '';
  }

  await vscode.env.clipboard.writeText(message);

  try {
    await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    await sleep(100);
    await vscode.commands.executeCommand('type', { text: '\n' });
    // restore clipboard after a delay
    setTimeout(async () => {
      try { await vscode.env.clipboard.writeText(oldClipboard); } catch {}
    }, 500);
    return true;
  } catch {
    // paste didn't work in webview - fallback to manual
    vscode.window.showInformationMessage(
      `Peitsche! "${message}" im Clipboard. Drueck Ctrl+V + Enter!`
    );
    return false;
  }
}

function activate(context) {
  // status bar item
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 100
  );
  statusBar.text = '$(zap) Peitsche!';
  statusBar.tooltip = 'Claude antreiben! Klick = Weiter';
  statusBar.command = 'claude-peitsche.whip';
  statusBar.show();

  // register command
  const cmd = vscode.commands.registerCommand('claude-peitsche.whip', async () => {
    const message = randomMessage();

    // animate status bar
    statusBar.text = '$(zap) PEITSCHE!!!';
    setTimeout(() => { statusBar.text = '$(zap) Peitsche!'; }, 1200);

    // try terminal first
    const claudeTerminal = findClaudeTerminal();
    if (claudeTerminal) {
      await whipViaTerminal(claudeTerminal, message);
      return;
    }

    // fallback to webview
    await whipViaWebview(message);
  });

  context.subscriptions.push(statusBar, cmd);
}

function deactivate() {}

module.exports = { activate, deactivate };
