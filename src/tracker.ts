import type { ReactRNPlugin } from '@remnote/plugin-sdk';

export interface SessionSnapshot {
  duration: number; // seconds
  correct: number;
  incorrect: number;
  rate: number; // cards per minute
  topRate: number;
}

export class SessionTracker {
  private startTime: number | undefined;
  private correct = 0;
  private incorrect = 0;
  private topRate = 0;
  private listeners: (() => void)[] = [];

  constructor(private plugin: ReactRNPlugin) {}

  async init() {
    this.topRate = (await this.plugin.storage.getSynced<number>('topRate')) || 0;
  }

  startSession() {
    this.startTime = Date.now();
    this.correct = 0;
    this.incorrect = 0;
    this.notify();
  }

  recordAnswer(correct: boolean) {
    if (!this.startTime) {
      this.startSession();
    }
    correct ? this.correct++ : this.incorrect++;
    this.notify();
  }

  async endSession() {
    const rate = this.snapshot().rate;
    if (rate > this.topRate) {
      this.topRate = rate;
      await this.plugin.storage.setSynced('topRate', this.topRate);
      // celebratory toast and sound
      await this.plugin.app.toast(`New high score: ${rate.toFixed(2)} cards/min!`);
      try {
        const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
        audio.play();
      } catch {
        // ignore audio errors
      }
    }
    this.startTime = undefined;
    this.correct = 0;
    this.incorrect = 0;
    this.notify();
  }

  snapshot(): SessionSnapshot {
    const duration = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    const total = this.correct + this.incorrect;
    const minutes = duration / 60;
    const rate = minutes > 0 ? total / minutes : 0;
    return {
      duration,
      correct: this.correct,
      incorrect: this.incorrect,
      rate,
      topRate: this.topRate,
    };
  }

  onUpdate(f: () => void) {
    this.listeners.push(f);
  }
  offUpdate(f: () => void) {
    this.listeners = this.listeners.filter((l) => l !== f);
  }
  private notify() {
    for (const f of this.listeners) {
      f();
    }
  }
}
