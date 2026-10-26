import { Component, inject, input } from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-ai-video-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-8"
    >
      <div class="page-content" style="max-width: 860px; width: 94%;">
        <!-- Hero Header -->
        <section class="hero" style="padding-bottom: 0.5rem;">
          <div class="final-surprise-badge">
            <span>✨ THE SECRET FINAL SURPRISE ✨</span>
          </div>
          <h1 class="hero-title" style="opacity: 1; margin-top: 0.5rem;">
            <span>Past, Present & Future 🌟</span>
            <br />
            <span class="hero-highlight">Our Love Story & Dream Future ✨</span>
          </h1>
          <p class="hero-subtitle" style="font-size: 1.15rem; max-width: 620px;">
            From where we started, to where we stand today, and all our forever dreams in tomorrow ❤️
          </p>
        </section>

        <!-- Cinema Theater Card for Secret Video -->
        <div class="cinema-theater-card ai-glow-card">
          <div class="cinema-header-info">
            <span class="cinema-badge" style="background: #fdf2f8; color: #be185d; border-color: #fbcfe8;">
              ✨ Our Story · Past, Present & Dream Future
            </span>
            <h2 class="cinema-film-title">{{ state.config().video2Title }}</h2>
            <p class="cinema-film-desc">{{ state.config().video2Description }}</p>
          </div>

          <!-- Video Player Screen -->
          <div class="cinema-screen-wrapper">
            <video
              #videoPlayer
              class="cinema-video"
              controls
              playsinline
              preload="metadata"
              [src]="state.config().video2Src"
              (play)="state.pauseMusicForVideo()"
              (pause)="state.resumeMusicAfterVideo()"
              (ended)="state.resumeMusicAfterVideo()"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Video File Drop Hint -->
            <div class="video-file-hint">
              <span>💡 Video file path:</span>
              <code>{{ state.config().video2Src }}</code>
            </div>
          </div>

          <!-- Watch in Fullscreen Button -->
          <div class="video-fullscreen-action">
            <button
              type="button"
              class="fullscreen-play-btn"
              (click)="playFullscreen(videoPlayer)"
            >
              <span>▶ Watch in Fullscreen 🎬</span>
            </button>
          </div>
        </div>

        <!-- Final Emotional Birthday Note -->
        <div class="cinema-closing-card">
          <h3 class="closing-title">To My Whole World, Chacha ❤️</h3>
          <p class="closing-text">
             Every smile, every photo, and every dream in these moments belongs to you and me.
            Thank you for being my constant, my protector, and the love of my life.
            From July 27, 2023 to forever... I will always choose you, in this lifetime and every other.
          </p>
          <p class="closing-sign">
            Happy Birthday, my love! 🎂✨
            <br />
            <strong>— Your Kallippodi ❤️</strong>
          </p>
        </div>

        <!-- Navigation Actions -->
        <div class="final-nav-actions" style="margin: 2rem 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;">
          <button
            type="button"
            class="puzzle-tool-btn"
            style="font-size: 0.95rem; padding: 12px 24px;"
            (click)="state.goToPage(7)"
          >
            ← Back to Our Memories Video
          </button>
          <button
            type="button"
            class="next-page-btn device-lock-sleep-btn"
            style="background: #1e1b24; font-size: 0.95rem; padding: 12px 28px; display: inline-flex; align-items: center; gap: 8px;"
            (click)="state.lockAndSleepDevice()"
          >
            <span>🔒 Lock Phone / Put to Sleep</span>
          </button>
        </div>
      </div>
    </section>
  `
})
export class AiVideoPageComponent {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  playFullscreen(video: HTMLVideoElement): void {
    if (!video) return;

    const el = video as any;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }

    this.state.pauseMusicForVideo();
    video.play().catch(err => console.log('Video play error:', err));
  }
}
