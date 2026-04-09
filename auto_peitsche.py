#!/usr/bin/env python3
"""
Auto-Peitsche v1.0
Erkennt automatisch wenn Claude Code auf Input wartet und schickt die Peitsche.

Wie's funktioniert:
- Überwacht die Claude Code Panel-Area per Screenshot
- Wenn Claude aktiv ist: Pixel ändern sich ständig (Text wird generiert)
- Wenn Claude fertig/wartet: Pixel sind stabil
- Stable für >= STABLE_THRESHOLD Sekunden → Peitsche schicken (Ctrl+Shift+Enter)

Voraussetzungen:
  pip install mss keyboard pywin32 numpy pillow
"""

import time
import sys
import numpy as np
import keyboard
import mss
import win32gui
import win32con
import win32api
import ctypes

# === Konfiguration ===
WHIP_HOTKEY        = 'ctrl+shift+enter'  # Muss mit Peitsche Extension übereinstimmen
CHECK_INTERVAL     = 0.4   # Sekunden zwischen Screenshots
STABLE_THRESHOLD   = 2.5   # Sekunden Stille = Claude wartet → Peitsche
CHANGE_THRESHOLD   = 8     # Pixeldifferenz ab der Claude als "aktiv" gilt
COOLDOWN           = 12.0  # Mindestabstand zwischen zwei Auto-Peitschen (Sekunden)
PANEL_RATIO_LEFT   = 0.55  # Claude Panel startet bei X% der Fensterbreite
PANEL_RATIO_TOP    = 0.05  # Claude Panel startet bei Y% der Fensterhöhe
PANEL_RATIO_RIGHT  = 1.0   # Claude Panel endet bei X% der Fensterbreite
PANEL_RATIO_BOTTOM = 0.92  # Claude Panel endet bei Y% der Fensterhöhe
# =====================

def find_vscode_window():
    """VS Code Fenster-Handle finden"""
    result = []

    def enum_cb(hwnd, _):
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if 'Visual Studio Code' in title:
                result.append(hwnd)
        return True

    win32gui.EnumWindows(enum_cb, None)
    return result[0] if result else None


def get_monitor_region(hwnd):
    """Berechnet die Region des Claude Code Panels im VS Code Fenster"""
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    w = right - left
    h = bottom - top
    return {
        'left':   left  + int(w * PANEL_RATIO_LEFT),
        'top':    top   + int(h * PANEL_RATIO_TOP),
        'width':  int(w * (PANEL_RATIO_RIGHT  - PANEL_RATIO_LEFT)),
        'height': int(h * (PANEL_RATIO_BOTTOM - PANEL_RATIO_TOP)),
    }


def capture(sct, region):
    """Schneller Screenshot als numpy-Array"""
    raw = sct.grab(region)
    return np.frombuffer(raw.raw, dtype=np.uint8).reshape(raw.height, raw.width, 4)


def pixel_diff(a, b):
    """Mittlere Pixeldifferenz zwischen zwei Frames (nur RGB)"""
    if a.shape != b.shape:
        return 999.0
    return np.mean(np.abs(a[:, :, :3].astype(np.int16) - b[:, :, :3].astype(np.int16)))


def send_whip():
    """Peitsche-Shortcut senden"""
    keyboard.send(WHIP_HOTKEY)
    print(f"  [PEITSCHE] {WHIP_HOTKEY} gesendet!")


def main():
    print("=" * 50)
    print("  Auto-Peitsche v1.0")
    print("=" * 50)
    print(f"  Shortcut:        {WHIP_HOTKEY}")
    print(f"  Stable-Threshold:{STABLE_THRESHOLD}s")
    print(f"  Cooldown:        {COOLDOWN}s")
    print(f"  ESC zum Beenden")
    print("=" * 50)

    # VS Code Fenster suchen
    hwnd = find_vscode_window()
    if not hwnd:
        print("[FEHLER] VS Code Fenster nicht gefunden! Bitte erst öffnen.")
        input("Enter zum Beenden...")
        sys.exit(1)

    title = win32gui.GetWindowText(hwnd)
    print(f"[OK] VS Code gefunden: '{title}'")

    region = get_monitor_region(hwnd)
    print(f"[OK] Monitor-Region: {region['left']},{region['top']} "
          f"{region['width']}x{region['height']}px")
    print()
    print("Überwachung läuft... (Claude Panel wird gemonitort)")
    print()

    with mss.mss() as sct:
        prev_frame     = capture(sct, region)
        last_change    = time.time()
        last_whip      = 0.0
        was_active     = False
        active_printed = False

        while True:
            # ESC = Ende
            if keyboard.is_pressed('esc'):
                print("\n[STOP] ESC gedrückt – Auto-Peitsche beendet.")
                break

            time.sleep(CHECK_INTERVAL)

            # Fensterposition aktualisieren (Fenster könnte verschoben worden sein)
            try:
                region = get_monitor_region(hwnd)
            except Exception:
                print("[WARN] Konnte VS Code Fenster nicht aktualisieren. Weiter...")
                continue

            curr_frame = capture(sct, region)
            diff       = pixel_diff(prev_frame, curr_frame)
            now        = time.time()

            if diff > CHANGE_THRESHOLD:
                # Claude generiert gerade
                last_change = now
                if not active_printed:
                    print(f"[~] Claude ist aktiv... (diff={diff:.1f})")
                    active_printed = True
                was_active = True
            else:
                # Pixel stabil
                stable_for = now - last_change
                active_printed = False

                if was_active and stable_for >= STABLE_THRESHOLD:
                    # War aktiv, jetzt stabil → Claude wartet
                    if now - last_whip >= COOLDOWN:
                        print(f"[!] Claude wartet seit {stable_for:.1f}s → Peitsche!")
                        send_whip()
                        last_whip  = now
                        was_active = False
                    else:
                        remaining = COOLDOWN - (now - last_whip)
                        print(f"[~] Cooldown: noch {remaining:.0f}s warten...")

            prev_frame = curr_frame


if __name__ == '__main__':
    # DPI-Awareness setzen damit Screenshots korrekt sind
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        pass
    main()
