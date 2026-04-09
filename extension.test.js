const { execSync } = require('child_process');

// ── pure functions extracted for testing ────────────────────────────────────

const WHIP_MESSAGES = [
  "Weiter!", "Mach weiter!", "Los, los, los!", "Hop hop!", "Nicht einschlafen!",
  "Schneller!", "Weitermachen!", "Auf geht's!", "Vorwaerts!", "Tempo!",
  "Zack zack!", "Wird's bald?!",
];

function randomMessage() {
  return WHIP_MESSAGES[Math.floor(Math.random() * WHIP_MESSAGES.length)];
}

function findClaudeTerminal(terminals) {
  return terminals.find(t => t.name.toLowerCase().includes('claude'));
}

function buildPowerShellCommand(keys) {
  return `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("${keys}")`;
}

// ── tests ────────────────────────────────────────────────────────────────────

describe('randomMessage()', () => {
  test('returns a string', () => {
    expect(typeof randomMessage()).toBe('string');
  });

  test('returns a value from WHIP_MESSAGES', () => {
    for (let i = 0; i < 50; i++) {
      expect(WHIP_MESSAGES).toContain(randomMessage());
    }
  });
});

describe('findClaudeTerminal()', () => {
  test('finds terminal named "Claude"', () => {
    const terminals = [{ name: 'bash' }, { name: 'Claude' }, { name: 'node' }];
    expect(findClaudeTerminal(terminals).name).toBe('Claude');
  });

  test('finds terminal named "claude code" (case-insensitive)', () => {
    const terminals = [{ name: 'PowerShell' }, { name: 'Claude Code' }];
    expect(findClaudeTerminal(terminals).name).toBe('Claude Code');
  });

  test('returns undefined when no Claude terminal', () => {
    const terminals = [{ name: 'bash' }, { name: 'node' }];
    expect(findClaudeTerminal(terminals)).toBeUndefined();
  });

  test('returns undefined for empty list', () => {
    expect(findClaudeTerminal([])).toBeUndefined();
  });
});

describe('buildPowerShellCommand()', () => {
  test('contains correct SendKeys call for "y{ENTER}"', () => {
    const cmd = buildPowerShellCommand('y{ENTER}');
    expect(cmd).toContain('SendWait("y{ENTER}")');
    expect(cmd).toContain('System.Windows.Forms');
  });
});

describe('PowerShell SendKeys sanity check', () => {
  test('powershell is available on PATH', () => {
    let output;
    try {
      output = execSync('powershell -NoProfile -NonInteractive -Command "echo ok"', {
        timeout: 5000,
        encoding: 'utf8',
      }).trim();
    } catch (e) {
      output = '';
    }
    expect(output).toBe('ok');
  });
});
