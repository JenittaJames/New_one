import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
  input,
  signal
} from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  isHeart: boolean;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface LoveCoupon {
  id: number;
  icon: string;
  title: string;
  perk: string;
  code: string;
  claimed: boolean;
}

@Component({
  selector: 'app-celebration-modal',
  standalone: true,
  template: `
    <div
      id="celebration-modal"
      [class.active]="open()"
      [attr.aria-hidden]="!open()"
      role="dialog"
    >
      <canvas #confettiCanvas id="canvas-confetti"></canvas>

      <!-- Floating Birthday Balloons in Background -->
      <div class="celebration-balloons-bg" aria-hidden="true">
        <span class="balloon b-1">🎈</span>
        <span class="balloon b-2">💖</span>
        <span class="balloon b-3">🎂</span>
        <span class="balloon b-4">✨</span>
        <span class="balloon b-5">🎈</span>
        <span class="balloon b-6">💕</span>
        <span class="balloon b-7">🎉</span>
      </div>

      <div #cardContainer class="celebration-card-enhanced">
        <!-- Cute Animated Couple Bears GIF -->
        <div class="celebration-avatar-wrapper">
          <div class="avatar-sparkle-decor">💍 ✨ 💕 ✨ 🎂</div>
          <img
            [src]="state.config().celebrationImage"
            alt="Celebration Bears GIF"
            class="celebration-bears-img"
          />
        </div>

        <!-- Title & Subtitle -->
        <div class="celebration-text-group">
          <h2 class="celebration-title">{{ state.config().celebrationTitle }}</h2>
          <div class="celebration-badge-pill">
            <span>🔒 Officially Locked Together Forever · July 27, 2023 ♾️</span>
          </div>
          <p class="celebration-message">
            Happy Birthday, my love! You said <strong>YES</strong>, which means you are officially stuck with me forever and ever! No refunds, no exchanges, and infinite cuddles guaranteed! 😘❤️
          </p>
        </div>

        <!-- Official Lifetime Love Agreement Certificate -->
        <div class="official-cert-card">
          <div class="cert-ribbon">📜 OFFICIAL FOREVER CERTIFICATE 📜</div>
          <h3 class="cert-name">
            Entered Between <strong>Kallippodi & Chachaaa</strong>
          </h3>
          <p class="cert-date">Effective July 27, 2023 · Lifetime & Non-Negotiable</p>

          <div class="cert-clauses">
            <div class="cert-clause-item">
              <span class="clause-emoji">🫂</span>
              <span><strong>Mandatory Hugs:</strong> Minimum 10 tight cuddles & kisses daily (in-person only! 🥺)</span>
            </div>
            <div class="cert-clause-item">
              <span class="clause-emoji">🥺</span>
              <span><strong>Fight Expiry Clause:</strong> Anger strictly expires within 5 minutes, followed by an immediate tight hug.</span>
            </div>
            <div class="cert-clause-item">
              <span class="clause-emoji">💍</span>
              <span><strong>Lifetime Exclusivity:</strong> 100% exclusive rights to my heart, my smile, and our future home together.</span>
            </div>
          </div>

          <div class="cert-footer-row">
            <span class="cert-sign">✍️ Signed by Kallippodi ❤️</span>
            <span class="cert-seal-pill">✓ 100% BINDING</span>
          </div>
        </div>

        <!-- Interactive Birthday Love Coupons -->
        <div class="coupons-section">
          <div class="coupons-header">
            <span class="coupons-section-tag">🎟️ YOUR BIRTHDAY LOVE COUPONS</span>
            <span class="coupons-help-hint">Tap to claim yours! 👇</span>
          </div>

          <div class="coupons-list">
            @for (cp of coupons(); track cp.id) {
              <div
                class="love-coupon-interactive"
                [class.redeemed]="cp.claimed"
                (click)="claimCoupon(cp)"
              >
                <div class="coupon-left">
                  <span class="coupon-icon">{{ cp.icon }}</span>
                  <div class="coupon-info">
                    <h4 class="coupon-name">{{ cp.title }}</h4>
                    <p class="coupon-perk">{{ cp.perk }}</p>
                    <span class="coupon-code-pill">{{ cp.code }}</span>
                  </div>
                </div>

                @if (!cp.claimed) {
                  <button type="button" class="coupon-claim-btn">
                    Claim 🎁
                  </button>
                } @else {
                  <div class="redeemed-stamp animate-stamp">
                    <span>✓ CLAIMED!</span>
                    <small>In Person Only 💋</small>
                  </div>
                }
              </div>
            }
          </div>

          @if (claimToast()) {
            <div class="coupon-toast-msg">
              {{ claimToast() }}
            </div>
          }
        </div>

        <!-- Next Step Action -->
        <div class="celebration-action-group">
          <p class="action-tease-text">
            👀 Wait, the surprise isn't over yet! Your secret birthday mission awaits...
          </p>
          <button
            type="button"
            class="btn btn-yes celebration-unlock-btn pulse-glow-btn"
            (click)="continueToPuzzle()"
          >
            <span>Unlock Secret Surprise 🧩 ➔</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class CelebrationModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly state = inject(SurpriseStateService);
  readonly open = input<boolean>(false);

  @ViewChild('confettiCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('cardContainer')
  cardContainerRef?: ElementRef<HTMLElement>;

  readonly coupons = signal<LoveCoupon[]>([
    {
      id: 1,
      icon: '🫂',
      title: 'One Super Tight Warm Hug',
      perk: 'Redeemable anytime you feel tired, stressed, or just miss me.',
      code: 'HUG-CHACHA',
      claimed: false
    },
    {
      id: 2,
      icon: '👑',
      title: '"Chacha is 100% Right" Pass',
      perk: 'Use this during any argument to win instantly! (Valid once per fight 🙈)',
      code: 'CHACHA-WINS',
      claimed: false
    },
    {
      id: 3,
      icon: '🍨',
      title: 'Midnight Treat & Cuddle Date',
      perk: 'Your favorite snacks, cozy blanket, and my head on your chest.',
      code: 'SWEET-NIGHT',
      claimed: false
    }
  ]);

  readonly claimToast = signal<string | null>(null);

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animationId = 0;
  private isConfettiActive = false;

  private readonly palette = [
    '#ff758f',
    '#ff8fa3',
    '#ffb3c1',
    '#b33939',
    '#e5a99e',
    '#fbc531',
    '#a855f7',
    '#38bdf8'
  ];

  claimCoupon(coupon: LoveCoupon): void {
    if (coupon.claimed) return;
    this.coupons.update(list =>
      list.map(c => (c.id === coupon.id ? { ...c, claimed: true } : c))
    );
    this.claimToast.set(`🎉 "${coupon.title}" Claimed! Offline redemption only with Kallippodi! 🥺💋`);
    setTimeout(() => {
      this.claimToast.set(null);
    }, 4000);
  }

  continueToPuzzle(): void {
    this.state.closeCelebration();
    this.state.goToPage(6);
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open()) {
        this.startConfetti();
        // Always reset card scroll to top so bears gif is 100% visible
        setTimeout(() => {
          if (this.cardContainerRef) {
            this.cardContainerRef.nativeElement.scrollTop = 0;
          }
        }, 50);
      } else {
        this.stopConfetti();
      }
    }
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticle(spreadAbove = false): ConfettiParticle {
    const canvas = this.canvasRef.nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: spreadAbove ? Math.random() * -canvas.height : -20 - Math.random() * 40,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 4 + 3,
      speedX: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.5,
      isHeart: Math.random() > 0.4,
      color: this.palette[Math.floor(Math.random() * this.palette.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.05 - 0.025
    };
  }

  private startConfetti(): void {
    this.resizeCanvas();
    this.particles = [];
    for (let i = 0; i < 180; i++) {
      this.particles.push(this.createParticle(true));
    }
    this.isConfettiActive = true;
    this.animateConfetti();
  }

  private stopConfetti(): void {
    this.isConfettiActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    if (this.ctx && this.canvasRef) {
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
  }

  private animateConfetti = (): void => {
    if (!this.isConfettiActive || !this.ctx || !this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.isHeart) {
        this.drawHeart(this.ctx, 0, 0, p.size);
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      this.ctx.restore();

      if (p.y > canvas.height + 20) {
        this.particles[i] = this.createParticle(false);
      }
    }

    this.animationId = requestAnimationFrame(this.animateConfetti);
  };

  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + s / 4);
    ctx.quadraticCurveTo(x, y, x + s / 2, y);
    ctx.quadraticCurveTo(x + s, y, x + s, y + s / 2);
    ctx.quadraticCurveTo(x + s, y + s, x, y + s * 1.5);
    ctx.quadraticCurveTo(x - s, y + s, x - s, y + s / 2);
    ctx.quadraticCurveTo(x - s, y, x - s / 2, y);
    ctx.quadraticCurveTo(x, y, x, y + s / 4);
    ctx.fill();
  }

  ngOnDestroy(): void {
    this.stopConfetti();
  }
}
