import {
  Component,
  HostListener,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  signal
} from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  template: `
    <div id="envelope-screen" [class.hidden]="isCompletelyHidden()">
      <!-- STAGE 1: Dark OLED Always-On Display (AOD) Front & Lock Screen -->
      @if (!isPasscodeVisible()) {
        <div class="device-aod-screen" (click)="openPasscode()">
          <div class="aod-content">
            <div class="aod-ambient-clock">{{ state.currentTime() }}</div>
            <div class="aod-ambient-date">{{ state.currentDate() }}</div>
            <div class="aod-status-pill">
              <span>🔋 100% · Device Locked with Love 🔒</span>
            </div>
            <div class="aod-heart-pulsing">❤️</div>
            <p class="aod-quote">"From July 27, 2023 to forever... I will always choose you."</p>
            <p class="aod-sign">— Your Kallippodi</p>
            <div class="aod-wake-hint">
              <span>👆 Tap anywhere to wake device ✨</span>
            </div>
          </div>
        </div>
      }

      <!-- STAGE 2: PIN Lock Overlay -->
      <div
        id="pin-modal"
        [class.active-passcode]="isPasscodeVisible()"
        [class.hidden]="!isPasscodeVisible() || isLoading()"
        [class.shake]="hasError()"
      >
        <!-- Return to Glance Screen Button -->
        <button
          type="button"
          class="device-lock-back-btn"
          (click)="lockBackToGlance($event)"
          title="Back to Lock Screen"
        >
          <span>← Lock Screen</span>
        </button>

        <div class="pin-card-container">
          <div class="pin-card-inner" [class.flipped]="isMobileFlipped()">
            <!-- Front / Left Side: Polaroid Frame -->
            <div class="pin-card-front" (click)="flipOnMobile()">
              <div class="lock-screen-content" style="position: relative; margin-bottom: 1.5rem;">
                <h1 class="ls-title">For My Chachaaa</h1>
              </div>
              <div class="pin-image-section">
                <img [src]="state.config().pinImage" alt="Lock Screen Photo" />
                <p class="pin-polaroid-caption">{{ state.config().pinImageCaption }}</p>
              </div>
              <p class="mobile-flip-text">Tap to enter passcode ➔</p>
            </div>

            <!-- Back / Right Side: PIN Keypad -->
            <div class="pin-card-back">
              <div class="pin-keypad-section">
                <h2 class="pin-title" style="margin-bottom: 1.5rem;">Enter PIN</h2>

                <div class="pin-display">
                  @for (dot of [0, 1, 2, 3]; track dot) {
                    <span class="pin-dot" [class.filled]="enteredPin().length > dot"></span>
                  }
                </div>

                <div class="pin-keypad">
                  @for (num of ['1', '2', '3', '4', '5', '6', '7', '8', '9']; track num) {
                    <button type="button" class="pin-btn" (click)="pressDigit(num)">{{ num }}</button>
                  }
                  <button type="button" class="pin-btn pin-clear" (click)="clearPin()">C</button>
                  <button type="button" class="pin-btn" (click)="pressDigit('0')">0</button>
                  <button type="button" class="pin-btn pin-backspace" (click)="backspacePin()">⌫</button>
                </div>

                @if (hasError()) {
                  <p class="pin-error">Incorrect PIN. Try again.</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader Screen -->
      @if (isLoading()) {
        <div id="loader-screen" [style.opacity]="loaderOpacity()">
          <div class="loader-content">
            <p class="loader-text">
              Authenticating Chachaaa... Loading something special...
            </p>
            <div class="loading-bar-container">
              <div class="loading-bar" [style.width]="loadingProgress() + '%'"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LockScreenComponent implements OnChanges {
  readonly state = inject(SurpriseStateService);
  readonly unlockedInput = input<boolean>(false);

  readonly isPasscodeVisible = signal<boolean>(false);
  readonly enteredPin = signal<string>('');
  readonly hasError = signal<boolean>(false);
  readonly isMobileFlipped = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly loadingProgress = signal<number>(0);
  readonly loaderOpacity = signal<number>(1);
  readonly isCompletelyHidden = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unlockedInput'] && !this.unlockedInput()) {
      // Reset when experience restarts or locks
      this.isPasscodeVisible.set(false);
      this.enteredPin.set('');
      this.hasError.set(false);
      this.isMobileFlipped.set(false);
      this.isLoading.set(false);
      this.loadingProgress.set(0);
      this.loaderOpacity.set(1);
      this.isCompletelyHidden.set(false);
    }
  }

  openPasscode(): void {
    if (this.isLoading() || this.isCompletelyHidden()) return;
    this.isPasscodeVisible.set(true);
  }

  lockBackToGlance(event: MouseEvent): void {
    event.stopPropagation();
    this.isPasscodeVisible.set(false);
    this.enteredPin.set('');
    this.hasError.set(false);
  }

  flipOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.isMobileFlipped.set(true);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.isCompletelyHidden() || this.isLoading() || this.state.isStudioOpen()) {
      return;
    }

    // If on Glance Lock screen, wake and transition to passcode
    if (!this.isPasscodeVisible()) {
      if (event.key === ' ' || event.key === 'Enter' || /^[0-9]$/.test(event.key)) {
        event.preventDefault();
        this.openPasscode();
        if (/^[0-9]$/.test(event.key)) {
          setTimeout(() => this.pressDigit(event.key), 50);
        }
      }
      return;
    }

    if (/^[0-9]$/.test(event.key)) {
      this.pressDigit(event.key);
    } else if (event.key === 'Backspace') {
      this.backspacePin();
    } else if (event.key === 'Escape') {
      this.isPasscodeVisible.set(false);
    } else if (event.key.toLowerCase() === 'c') {
      this.clearPin();
    }
  }

  pressDigit(digit: string): void {
    if (this.enteredPin().length >= 4 || this.isLoading()) return;
    this.hasError.set(false);
    const nextPin = this.enteredPin() + digit;
    this.enteredPin.set(nextPin);

    if (nextPin.length === 4) {
      this.verifyPin(nextPin);
    }
  }

  clearPin(): void {
    this.enteredPin.set('');
    this.hasError.set(false);
  }

  backspacePin(): void {
    if (this.enteredPin().length > 0) {
      this.enteredPin.update(p => p.slice(0, -1));
      this.hasError.set(false);
    }
  }

  private verifyPin(pin: string): void {
    const targetPin = (this.state.config().pinCode || '2707').trim();
    if (pin === targetPin) {
      this.triggerUnlockSequence();
    } else {
      this.hasError.set(true);
      setTimeout(() => {
        this.enteredPin.set('');
      }, 450);
    }
  }

  private triggerUnlockSequence(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.loadingProgress.set(100);
    }, 50);

    setTimeout(() => {
      this.loaderOpacity.set(0);
      setTimeout(() => {
        this.isCompletelyHidden.set(true);
        this.state.unlockExperience();
      }, 750);
    }, 2000);
  }
}
