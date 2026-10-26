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
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-proposal-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-5"
    >
      <div class="page-content">
        <section #proposalCard class="proposal-section">
          <h2 class="proposal-question">
            <span>{{ state.config().proposalQuestion }}</span>
            <span class="highlight">{{ state.config().proposalQuestionHighlight }}</span>
          </h2>

          <div class="button-group">
            <button
              type="button"
              id="yes-btn"
              class="btn btn-yes"
              (click)="onYesClick()"
            >
              Yes, Forever! ❤️
            </button>

            <button
              #noBtn
              type="button"
              id="no-btn"
              class="btn btn-no"
              [class.dodge]="isDodging()"
              [style.left]="noLeft()"
              [style.top]="noTop()"
              [style.transform]="noTransform()"
              (mouseenter)="dodge($event)"
              (touchstart)="onTouchDodge($event)"
              (click)="onClickDodge($event)"
            >
              {{ noButtonText() }}
            </button>
          </div>
        </section>
      </div>
    </section>
  `
})
export class ProposalPageComponent implements OnChanges {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  @ViewChild('proposalCard', { static: true })
  proposalCardRef!: ElementRef<HTMLElement>;

  @ViewChild('noBtn', { static: true })
  noBtnRef!: ElementRef<HTMLButtonElement>;

  private readonly noTexts = [
    'No 💔',
    'Are you sure, Bijeesh? 🥺',
    'Think of July 07 & 27! ✨',
    'Please? 💕',
    'Error: option unavailable 😜',
    'No way! 🎂',
    'Jenitta will pout... 😢',
    'Click YES instead! 👉👈',
    'Still trying to click no? 😭',
    "You're stuck with me forever! ❤️"
  ];

  private textIndex = 0;

  readonly isDodging = signal<boolean>(false);
  readonly noButtonText = signal<string>('No');
  readonly noLeft = signal<string>('');
  readonly noTop = signal<string>('');
  readonly noTransform = signal<string>('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && !this.active()) {
      this.resetNoButton();
    }
  }

  onYesClick(): void {
    this.resetNoButton();
    this.state.openCelebration();
  }

  onTouchDodge(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.dodge({
      clientX: touch ? touch.clientX : 0,
      clientY: touch ? touch.clientY : 0
    });
  }

  onClickDodge(event: MouseEvent): void {
    event.preventDefault();
    this.dodge({ clientX: event.clientX, clientY: event.clientY });
  }

  dodge(coords: { clientX?: number; clientY?: number }): void {
    this.isDodging.set(true);

    const cardEl = this.proposalCardRef.nativeElement;
    const btnEl = this.noBtnRef.nativeElement;

    const sectionRect = cardEl.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();

    const padding = 20;
    const maxX = Math.max(padding, sectionRect.width - btnRect.width - padding);
    const maxY = Math.max(padding, sectionRect.height - btnRect.height - padding);

    const clientX = coords.clientX ?? sectionRect.left + sectionRect.width / 2;
    const clientY = coords.clientY ?? sectionRect.top + sectionRect.height - 50;

    const mouseXRel = clientX - sectionRect.left;
    const mouseYRel = clientY - sectionRect.top;

    let newX = Math.max(padding, Math.random() * maxX);
    let newY = Math.max(padding, Math.random() * maxY);

    let distance = Math.hypot(newX - mouseXRel, newY - mouseYRel);
    let attempts = 0;
    while (distance < 120 && attempts < 30) {
      newX = Math.max(padding, Math.random() * maxX);
      newY = Math.max(padding, Math.random() * maxY);
      distance = Math.hypot(newX - mouseXRel, newY - mouseYRel);
      attempts++;
    }

    this.noLeft.set(`${newX}px`);
    this.noTop.set(`${newY}px`);

    const randomRotate = (Math.random() * 20 - 10).toFixed(1);
    this.noTransform.set(`rotate(${randomRotate}deg) scale(0.95)`);

    this.noButtonText.set(this.noTexts[this.textIndex]);
    this.textIndex = (this.textIndex + 1) % this.noTexts.length;
  }

  private resetNoButton(): void {
    this.isDodging.set(false);
    this.noButtonText.set('No');
    this.noLeft.set('');
    this.noTop.set('');
    this.noTransform.set('');
    this.textIndex = 0;
  }
}
