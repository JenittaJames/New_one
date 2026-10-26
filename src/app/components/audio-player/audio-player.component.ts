import { Component, inject } from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  template: `
    <header class="top-controls">
      <button
        id="music-toggle"
        type="button"
        class="music-toggle"
        [class.muted]="!state.isPlaying()"
        [class.playing]="state.isPlaying()"
        (click)="state.toggleMusic()"
        aria-label="Toggle Romantic Music"
        title="Toggle Romantic Music"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          />
        </svg>
      </button>
    </header>
  `
})
export class AudioPlayerComponent {
  readonly state = inject(SurpriseStateService);
}
