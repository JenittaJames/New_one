import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
  swayTime: number;
}

@Component({
  selector: 'app-hearts-canvas',
  standalone: true,
  template: `<canvas #heartsCanvas id="canvas-hearts"></canvas>`
})
export class HeartsCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heartsCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private hearts: FloatingHeart[] = [];
  private readonly maxHearts = 40;
  private animationFrameId = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.initHearts();
    this.animate();
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createHeart(spreadY = false): FloatingHeart {
    const canvas = this.canvasRef.nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: spreadY ? Math.random() * canvas.height : canvas.height + Math.random() * 25,
      size: Math.random() * 15 + 8,
      speed: Math.random() * 1.2 + 0.5,
      opacity: Math.random() * 0.4 + 0.15,
      sway: Math.random() * 1.5 - 0.75,
      swaySpeed: Math.random() * 0.02 + 0.005,
      swayTime: Math.random() * 100
    };
  }

  private initHearts(): void {
    this.hearts = [];
    for (let i = 0; i < this.maxHearts; i++) {
      this.hearts.push(this.createHeart(true));
    }
  }

  private animate = (): void => {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const h of this.hearts) {
      h.y -= h.speed;
      h.swayTime += h.swaySpeed;
      h.x += Math.sin(h.swayTime) * h.sway;

      if (h.y < -h.size) {
        const reset = this.createHeart(false);
        Object.assign(h, reset);
      }

      ctx.save();
      ctx.beginPath();
      ctx.translate(h.x, h.y);
      ctx.moveTo(0, -h.size / 4);
      ctx.bezierCurveTo(
        h.size / 2,
        -h.size,
        h.size * 1.2,
        -h.size / 3,
        0,
        h.size * 0.8
      );
      ctx.bezierCurveTo(
        -h.size * 1.2,
        -h.size / 3,
        -h.size / 2,
        -h.size,
        0,
        -h.size / 4
      );
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 117, 143, ${h.opacity})`;
      ctx.fill();
      ctx.restore();
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
