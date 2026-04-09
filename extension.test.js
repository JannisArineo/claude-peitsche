const { execSync } = require('child_process');

// ── pure functions extracted for testing ────────────────────────────────────

const WHIP_MESSAGES = [
  "y aber schneller!!", "y und zwar JETZT!!", "y tempo tempo TEMPO!!",
  "y mach endlich!!", "y los los los!!", "y schneller du Maschine!!",
];

function randomMessage() {
  return WHIP_MESSAGES[Math.floor(Math.random() * WHIP_MESSAGES.length)];
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

  test('all messages start with "y"', () => {
    for (const msg of WHIP_MESSAGES) {
      expect(msg.startsWith('y')).toBe(true);
    }
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
