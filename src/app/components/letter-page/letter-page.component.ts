import {
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
  input,
  signal
} from '@angular/core';
import { BIRTHDAY_LETTER_DATA } from '../../config/birthday-letter.data';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-letter-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-3"
    >
      <div class="page-content letter-page-content" style="max-width: 880px; width: 94%;">
        <!-- Closed 3D Wax-Sealed Envelope -->
        @if (!isLetterRevealed()) {
          <div
            id="letter-box-btn"
            style="cursor: pointer;"
            (click)="openEnvelope()"
          >
            <div
              class="envelope-wrapper"
              [class.open]="isEnvelopeOpening()"
              style="margin: 0 auto; display: block; pointer-events: none;"
            >
              <div class="envelope"></div>
              <div class="flap"></div>
              <div class="pocket"></div>
              <div class="letter-preview">
                <p>Click to open with love</p>
                <span>For {{ state.config().receiverShortName || state.config().receiverName }} ❤️</span>
              </div>
              <div class="seal"></div>
            </div>
            <p
              style="
                text-align: center;
                color: var(--accent-red);
                font-family: var(--font-serif);
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 2rem;
                animation: pulseLight 2s infinite alternate;
              "
            >
              Click to open your birthday letter 💌
            </p>
            <p class="letter-sub-prompt">
              🥺 Sorry, it's a long letter! Take your time and read it slowly... ❤️
            </p>
          </div>
        }

        <!-- Royal Handwritten Parchment Love Letter Card -->
        @if (isLetterRevealed()) {
          <div class="letter-wrapper">
            <!-- Reading Progress Bar -->
            <div class="letter-progress-track">
              <div
                class="letter-progress-bar"
                [style.width.%]="readProgress()"
              ></div>
            </div>

            <article
              #letterArticle
              class="letter-card expanded-letter-card"
              id="birthday-letter-card"
              (scroll)="onLetterScroll($event)"
            >
              <!-- Letter Parchment Header -->
              <header class="letter-header-block">
                <div class="letter-top-seal">💌 ♾️ 🌹</div>
                <h1 class="letter-main-heading">{{ letterData.title }}</h1>
                <div class="letter-sweet-notice">
                  <span class="notice-icon">🥺❤️</span>
                  <p class="notice-text">
                    <strong>Sorry, it's a long letter!</strong> Please take your time and read it slowly... Every single word came straight from my heart.
                  </p>
                </div>
                <div class="letter-header-flourish">~ ❤️ ~</div>
              </header>

              <!-- Letter Body with All 11 Sections -->
              <div class="letter-body-flow">
                @for (sec of letterData.sections; track $index) {
                  <section
                    class="letter-section-block"
                    [id]="'letter-sec-' + $index"
                  >
                    @if (sec.title) {
                      <div class="letter-section-header">
                        <h2 class="letter-sec-title">{{ sec.title }}</h2>
                        <div class="section-floral-divider">❦ ~ ✨ ~ ❦</div>
                      </div>
                    }

                    <div class="letter-paragraphs-group">
                      @for (para of sec.paragraphs; track $index) {
                        <p
                          class="letter-p"
                          [innerHTML]="formatMarkdown(para)"
                        ></p>
                      }
                    </div>
                  </section>
                }
              </div>

              <!-- Romantic Climax & Signature Section -->
              <footer class="letter-grand-signature">
                <div class="sig-seal-badge">💍 ❤️ ♾️</div>
                <p class="sig-closing-note">
                  "Yours today. Yours tomorrow. Yours through all the beautiful years ahead."
                </p>
                <div class="sig-signoff">
                  <span class="sig-phrase">With all my love & heart,</span>
                  <span class="sig-name">{{ state.config().senderName }}</span>
                  <span class="sig-dedication">Forever Your Kallippodi ❤️</span>
                </div>

                <!-- Next Page Action Button -->
                <div class="letter-action-footer">
                  <button
                    type="button"
                    class="next-page-btn pulse-glow-btn"
                    style="margin-top: 1.5rem; font-size: 1.15rem; padding: 14px 38px;"
                    (click)="state.goToPage(4)"
                  >
                    Our Memories ➔
                  </button>
                </div>
              </footer>
            </article>

            @if (!hasScrolled()) {
              <div class="letter-fade"></div>
              <p class="scroll-hint">↓ Scroll to read my whole heart ↓</p>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class LetterPageComponent implements OnChanges {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  @ViewChild('letterArticle')
  letterArticleRef?: ElementRef<HTMLElement>;

  readonly letterData = BIRTHDAY_LETTER_DATA;
  readonly isEnvelopeOpening = signal<boolean>(false);
  readonly isLetterRevealed = signal<boolean>(false);
  readonly hasScrolled = signal<boolean>(false);
  readonly readProgress = signal<number>(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && !this.active()) {
      if (!this.state.isUnlocked()) {
        this.resetLetter();
      }
    }
  }

  openEnvelope(): void {
    if (this.isEnvelopeOpening()) return;
    this.isEnvelopeOpening.set(true);

    setTimeout(() => {
      this.isLetterRevealed.set(true);
    }, 1100);
  }

  onLetterScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;

    this.hasScrolled.set(scrollTop > 30);

    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
      this.readProgress.set(progress);
    }
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  private resetLetter(): void {
    this.isEnvelopeOpening.set(false);
    this.isLetterRevealed.set(false);
    this.hasScrolled.set(false);
    this.readProgress.set(0);
  }
}
