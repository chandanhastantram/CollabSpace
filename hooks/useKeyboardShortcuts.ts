"use client";

import { useEffect } from 'react';

interface Shortcut {
  key: string;
  description: string;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keys = shortcut.key.toLowerCase().split('+');
        const ctrl = keys.includes('ctrl') || keys.includes('cmd');
        const shift = keys.includes('shift');
        const alt = keys.includes('alt');
        const key = keys[keys.length - 1];

        const ctrlPressed = event.ctrlKey || event.metaKey;
        const shiftPressed = event.shiftKey;
        const altPressed = event.altKey;
        const keyPressed = event.key.toLowerCase();

        if (
          (ctrl === ctrlPressed || !ctrl) &&
          (shift === shiftPressed || !shift) &&
          (alt === altPressed || !alt) &&
          key === keyPressed
        ) {
          event.preventDefault();
          shortcut.handler();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
