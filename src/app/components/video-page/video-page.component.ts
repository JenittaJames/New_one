import { Component, inject, input } from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-video-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-7"
    >
      <div class="page-content" style="max-width: 860px; width: 94%;">
        <!-- Cinema Header -->
        <section class="hero" style="padding-bottom: 0.5rem;">
          <h1 class="hero-title" style="opacity: 1;">
            <span>Our Memories in Motion 🎬</span>
            <br />
            <span class="hero-highlight">A Walk Down Memory Lane 📸</span>
          </h1>
          <p class="hero-subtitle" style="font-size: 1.15rem; max-width: 620px;">
            Every special moment, laugh and journey with you since July 27, 2023 ❤️
          </p>
        </section>

        <!-- Cinema Theater Card for Real Memories -->
        <div class="cinema-theater-card">
          <div class="cinema-header-info">
            <span class="cinema-badge">
              📸 Special Birthday Memories
            </span>
            <h2 class="cinema-film-title">{{ state.config().video1Title }}</h2>
            <p class="cinema-film-desc">{{ state.config().video1Description }}</p>
          </div>

          <!-- Video Player Screen -->
          <div class="cinema-screen-wrapper">
            <video
              #videoPlayer
              class="cinema-video"
              controls
              playsinline
              preload="metadata"
              [src]="state.config().video1Src"
              (play)="state.pauseMusicForVideo()"
              (pause)="state.resumeMusicAfterVideo()"
              (ended)="state.resumeMusicAfterVideo()"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Video File Drop Hint -->
            <div class="video-file-hint">
              <span>💡 Video file path:</span>
              <code>{{ state.config().video1Src }}</code>
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

        <!-- Secret Final Surprise Teaser Card -->
        <div class="surprise-reveal-teaser-card">
          <div class="teaser-sparkle-icon">✨</div>
          <h3 class="teaser-heading">Wait, Chacha... You thought this was all? 😉</h3>
          <p class="teaser-text">
            I have one more secret birthday gift waiting for you...
            Something you have never seen before, made with all my love and dreams for us.
          </p>
          <button
            type="button"
            class="next-page-btn pulse-glow-btn"
            style="font-size: 1.15rem; padding: 15px 38px;"
            (click)="state.goToPage(8)"
          >
            <span>Unlock The Final Surprise ✨ ➔</span>
          </button>
        </div>
      </div>
    </section>
  `
})
export class VideoPageComponent {
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
