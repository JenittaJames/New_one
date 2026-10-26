import { Component, inject, input } from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-hero-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-1"
    >
      <div class="page-content">
        <section class="hero">
          <p class="hero-subtitle">{{ state.config().heroSubtitle }}</p>
          <h1 class="hero-title">
            <span>{{ state.config().heroTitle }}</span>
            <br />
            <span class="hero-highlight">{{ state.config().heroTitleHighlight }}</span>
          </h1>
          <img
            [src]="state.config().heroGif"
            alt="Cute Bubu Dudu"
            class="hero-gif"
            style="width: 185px; margin-top: 1.25rem; display: block; margin-left: auto; margin-right: auto;"
          />
        </section>

        <button type="button" class="next-page-btn" (click)="state.goToPage(2)">
          <span>See what's next ➔</span>
        </button>
      </div>
    </section>
  `
})
export class HeroPageComponent {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);
}
