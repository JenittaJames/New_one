import { Injectable, signal } from '@angular/core';
import { DEFAULT_SURPRISE_CONFIG, SurpriseConfig } from '../config/surprise.config';

const STORAGE_KEY = 'bijeesh_birthday_surprise_config_v1';

@Injectable({
  providedIn: 'root'
})
export class SurpriseStateService {
  readonly config = signal<SurpriseConfig>(this.loadConfig());
  readonly isUnlocked = signal<boolean>(false);
  readonly currentPage = signal<number>(1);
  readonly isCelebrationOpen = signal<boolean>(false);
  readonly isStudioOpen = signal<boolean>(false);
  readonly isDeviceSleeping = signal<boolean>(false);
  readonly isShuttingDown = signal<boolean>(false);

  // Live device system clock
  readonly currentTime = signal<string>('12:00 PM');
  readonly currentDate = signal<string>('Today');

  // Audio state
  readonly isPlaying = signal<boolean>(false);
  readonly userMuted = signal<boolean>(false);

  private audio?: HTMLAudioElement;

  constructor() {
    this.startClock();
    if (typeof window !== 'undefined') {
      this.audio = new Audio('assets/romantic-piano.mp3');
      this.audio.loop = true;
      this.audio.onerror = () => {
        // Fallback to CDN if local asset fails
        if (this.audio) {
          this.audio.src =
            'assets/The-Metro-Proposal-MassTamilan.dev.mp3';
        }
      };

      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'edit' || params.get('edit') === 'true') {
        this.isStudioOpen.set(true);
      }
    }
  }

  private startClock(): void {
    if (typeof window === 'undefined') return;
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      this.currentTime.set(`${formattedHours}:${formattedMinutes} ${ampm}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      };
      this.currentDate.set(now.toLocaleDateString('en-US', options));
    };
    update();
    setInterval(update, 1000);
  }

  private loadConfig(): SurpriseConfig {
    return {
      ...DEFAULT_SURPRISE_CONFIG,
      polaroids: DEFAULT_SURPRISE_CONFIG.polaroids.map(p => ({ ...p })),
      specialDates: DEFAULT_SURPRISE_CONFIG.specialDates.map(d => ({ ...d }))
    };
  }

  updateConfig(partial: Partial<SurpriseConfig>): void {
    this.config.update(curr => {
      const updated = { ...curr, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist config to localStorage:', e);
      }
      return updated;
    });
  }

  resetConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.config.set({
      ...DEFAULT_SURPRISE_CONFIG,
      polaroids: DEFAULT_SURPRISE_CONFIG.polaroids.map(p => ({ ...p })),
      specialDates: DEFAULT_SURPRISE_CONFIG.specialDates.map(d => ({ ...d }))
    });
  }

  toggleMusic(): void {
    if (!this.audio) return;
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
      this.userMuted.set(true);
    } else {
      this.userMuted.set(false);
      this.audio
        .play()
        .then(() => {
          this.isPlaying.set(true);
        })
        .catch(err => {
          console.log('Audio play blocked by browser:', err);
        });
    }
  }

  tryAutoPlayMusic(): void {
    if (!this.audio || this.isPlaying() || this.userMuted()) return;
    this.audio
      .play()
      .then(() => {
        this.isPlaying.set(true);
      })
      .catch(err => {
        console.log('Auto-play prevented:', err);
      });
  }

  pauseMusicForVideo(): void {
    if (this.audio && this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    }
  }

  resumeMusicAfterVideo(): void {
    if (this.audio && !this.userMuted() && !this.isPlaying()) {
      this.audio
        .play()
        .then(() => {
          this.isPlaying.set(true);
        })
        .catch(() => {});
    }
  }

  unlockExperience(): void {
    this.isUnlocked.set(true);
    this.currentPage.set(1);
    this.tryAutoPlayMusic();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openCelebration(): void {
    this.isCelebrationOpen.set(true);
    this.tryAutoPlayMusic();
  }

  closeCelebration(): void {
    this.isCelebrationOpen.set(false);
  }

  restartExperience(): void {
    this.isCelebrationOpen.set(false);
    this.currentPage.set(1);
    this.isUnlocked.set(false);
  }

  lockAndSleepDevice(): void {
    this.isShuttingDown.set(true);
    this.pauseMusicForVideo();
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.isShuttingDown.set(false);
        this.isDeviceSleeping.set(false);
        this.isUnlocked.set(false);
        this.currentPage.set(1);
      }, 950);
    }
  }

  wakeDevice(): void {
    this.isDeviceSleeping.set(false);
    this.isUnlocked.set(false);
    this.currentPage.set(1);
  }

  toggleStudio(): void {
    this.isStudioOpen.update(v => !v);
  }
}
