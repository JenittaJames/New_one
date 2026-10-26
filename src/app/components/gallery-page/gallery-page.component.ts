import { Component, computed, inject, input, signal } from '@angular/core';
import { PhotoCategory } from '../../config/surprise.config';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-4"
    >
      <div class="page-content" style="max-width: 900px; width: 94%;">
        <section class="gallery-section">
          <h2 class="section-title">
            <span>{{ state.config().galleryTitle }}</span>
            <span class="highlight">{{ state.config().galleryTitleHighlight }}</span>
          </h2>

          <!-- Category Filter Tabs -->
          <div class="gallery-category-tabs">
            <button
              type="button"
              class="category-tab-btn"
              [class.active]="selectedCategory() === 'all'"
              (click)="selectCategory('all')"
            >
              ✨ View All ({{ totalPhotosCount() }})
            </button>
            @for (cat of state.config().photoCategories; track cat.id) {
              <button
                type="button"
                class="category-tab-btn"
                [class.active]="selectedCategory() === cat.id"
                (click)="selectCategory(cat.id)"
              >
                {{ cat.icon }} {{ cat.title }}
              </button>
            }
          </div>

          <!-- Category Sections -->
          <div class="category-sections-wrapper">
            @for (cat of displayedCategories(); track cat.id) {
              <div class="category-block" [id]="'cat-' + cat.id">
                <div class="category-header">
                  <h3 class="category-title">
                    <span class="cat-icon">{{ cat.icon }}</span>
                    <span>{{ cat.title }}</span>
                  </h3>

                  <!-- Emotional Love Note for This Section -->
                  <div class="category-note-card">
                    <span class="quote-mark">“</span>
                    <p class="category-note-text">{{ cat.note }}</p>
                    <span class="quote-mark right">”</span>
                  </div>
                </div>

                <!-- 3 Polaroid Photo Cards for this section -->
                <div class="polaroid-grid">
                  @for (photo of cat.photos; track $index) {
                    <div class="polaroid-wrapper">
                      <div class="polaroid">
                        <div class="polaroid-img-container">
                          <img [src]="photo.image" [alt]="photo.caption" />
                        </div>
                        <p class="polaroid-caption">{{ photo.caption }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;">
          <button
            type="button"
            class="next-page-btn"
            style="margin-top: 0; margin-bottom: 0;"
            (click)="state.goToPage(5)"
          >
            Next Page ➔
          </button>
        </div>
      </div>
    </section>
  `
})
export class GalleryPageComponent {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  readonly selectedCategory = signal<string>('all');

  readonly totalPhotosCount = computed(() => {
    return (this.state.config().photoCategories || []).reduce(
      (sum, c) => sum + (c.photos ? c.photos.length : 0),
      0
    );
  });

  readonly displayedCategories = computed<PhotoCategory[]>(() => {
    const all = this.state.config().photoCategories || [];
    if (this.selectedCategory() === 'all') {
      return all;
    }
    return all.filter(c => c.id === this.selectedCategory());
  });

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }
}
