import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SurpriseStateService } from '../../services/surprise-state.service';

@Component({
  selector: 'app-customizer-drawer',
  standalone: true,
  imports: [FormsModule],
  styles: [
    `
      .studio-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(45, 36, 56, 0.35);
        backdrop-filter: blur(4px);
        z-index: 2500;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      .studio-backdrop.open {
        opacity: 1;
        visibility: visible;
      }
      .studio-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 420px;
        max-width: 92vw;
        height: 100vh;
        background: #fff8fa;
        border-left: 1px solid rgba(229, 169, 158, 0.4);
        box-shadow: -15px 0 40px rgba(45, 36, 56, 0.18);
        z-index: 2600;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .studio-drawer.open {
        transform: translateX(0);
      }
      .studio-header {
        padding: 18px 20px;
        background: #fff;
        border-bottom: 1px solid #f1dfe3;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .studio-header h3 {
        font-family: var(--font-serif);
        font-size: 1.2rem;
        color: var(--text-primary);
        margin: 0;
      }
      .studio-header p {
        font-size: 0.75rem;
        color: var(--accent-red);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .studio-close {
        background: #f8edf0;
        border: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        color: var(--text-primary);
      }
      .studio-body {
        flex: 1;
        overflow-y: auto;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .studio-body::-webkit-scrollbar {
        width: 6px;
        display: block;
      }
      .studio-body::-webkit-scrollbar-thumb {
        background: rgba(179, 57, 57, 0.25);
        border-radius: 4px;
      }
      .studio-card {
        background: #fff;
        border: 1px solid #f1dfe3;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 4px 14px rgba(74, 46, 43, 0.04);
      }
      .studio-card h4 {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--accent-red);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .field-group {
        margin-bottom: 12px;
      }
      .field-group:last-child {
        margin-bottom: 0;
      }
      .field-group label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .field-input,
      .field-textarea {
        width: 100%;
        padding: 9px 12px;
        border: 1.5px solid #e5d5d8;
        border-radius: 10px;
        font-family: var(--font-sans);
        font-size: 0.88rem;
        color: var(--text-primary);
        outline: none;
        transition: border-color 0.2s;
      }
      .field-input:focus,
      .field-textarea:focus {
        border-color: var(--accent-red);
      }
      .field-textarea {
        min-height: 76px;
        resize: vertical;
      }
      .quick-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .nav-chip {
        padding: 6px 11px;
        border-radius: 20px;
        border: 1px solid #e5d5d8;
        background: #fff;
        font-size: 0.76rem;
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
      }
      .nav-chip.active {
        background: var(--accent-red);
        color: #fff;
        border-color: var(--accent-red);
      }
      .photo-upload-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 6px;
      }
      .photo-thumb {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid #e5d5d8;
      }
      .upload-btn {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        padding: 7px 12px;
        background: #fff0f3;
        color: var(--accent-red);
        border: 1px dashed var(--accent-pink);
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
      }
      .upload-btn input[type='file'] {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
      .studio-footer {
        padding: 14px 18px;
        background: #fff;
        border-top: 1px solid #f1dfe3;
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      .btn-reset {
        background: #f5ebe6;
        color: var(--text-secondary);
        border: none;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-done {
        flex: 1;
        background: var(--accent-red);
        color: #fff;
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.88rem;
        font-weight: 600;
        cursor: pointer;
      }
    `
  ],
  template: `
    <div
      class="studio-backdrop"
      [class.open]="state.isStudioOpen()"
      (click)="state.toggleStudio()"
    ></div>

    <aside class="studio-drawer" [class.open]="state.isStudioOpen()">
      <div class="studio-header">
        <div>
          <p>✨ Personalization Studio</p>
          <h3>Customize Surprise</h3>
        </div>
        <button type="button" class="studio-close" (click)="state.toggleStudio()">✕</button>
      </div>

      <div class="studio-body">
        <!-- Quick Jump Navigation -->
        <div class="studio-card">
          <h4>🧭 Quick Jump to Screen</h4>
          <div class="quick-nav">
            <button
              type="button"
              class="nav-chip"
              [class.active]="!state.isUnlocked()"
              (click)="jumpToLockScreen()"
            >
              🔒 Lock Screen
            </button>
            @for (page of [1, 2, 3, 4, 5]; track page) {
              <button
                type="button"
                class="nav-chip"
                [class.active]="state.isUnlocked() && state.currentPage() === page"
                (click)="jumpToPage(page)"
              >
                Page {{ page }}
              </button>
            }
          </div>
        </div>

        <!-- 1. Couple & Lock Screen -->
        <div class="studio-card">
          <h4>👥 1. Couple & Lock Screen</h4>
          <div class="field-group">
            <label>Boyfriend's Full Name</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().receiverName"
              (ngModelChange)="updateField('receiverName', $event)"
            />
          </div>
          <div class="field-group">
            <label>Boyfriend's Short Name (for Headers)</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().receiverShortName"
              (ngModelChange)="updateField('receiverShortName', $event)"
            />
          </div>
          <div class="field-group">
            <label>Your Name</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().senderName"
              (ngModelChange)="updateField('senderName', $event)"
            />
          </div>
          <div class="field-group">
            <label>4-Digit Lock Screen PIN</label>
            <input
              type="text"
              maxlength="4"
              class="field-input"
              [ngModel]="state.config().pinCode"
              (ngModelChange)="updateField('pinCode', $event)"
            />
          </div>
          <div class="field-group">
            <label>PIN Hint</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().pinHint"
              (ngModelChange)="updateField('pinHint', $event)"
            />
          </div>
          <div class="field-group">
            <label>Lock Screen Photo</label>
            <div class="photo-upload-row">
              <img [src]="state.config().pinImage" class="photo-thumb" alt="Lock thumb" />
              <label class="upload-btn">
                📷 Upload Photo
                <input type="file" accept="image/*" (change)="onUploadPinImage($event)" />
              </label>
            </div>
          </div>
        </div>

        <!-- 2. Special Dates & Birthday Wording -->
        <div class="studio-card">
          <h4>🎂 2. Birthday & Special Dates</h4>
          <div class="field-group">
            <label>Special Date 1 (July 07, 2023)</label>
            <input
              type="date"
              class="field-input"
              [ngModel]="state.config().startDate"
              (ngModelChange)="updateField('startDate', $event)"
            />
          </div>
          <div class="field-group">
            <label>Special Date 2 (July 27, 2023)</label>
            <input
              type="date"
              class="field-input"
              [ngModel]="state.config().secondaryDate"
              (ngModelChange)="updateField('secondaryDate', $event)"
            />
          </div>
          <div class="field-group">
            <label>Page 2 Title</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().occasionTitle"
              (ngModelChange)="updateField('occasionTitle', $event)"
            />
          </div>
          <div class="field-group">
            <label>Page 2 Cursive Highlight</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().occasionHighlight"
              (ngModelChange)="updateField('occasionHighlight', $event)"
            />
          </div>
        </div>

        <!-- 3. Birthday Love Letter -->
        <div class="studio-card">
          <h4>💌 3. Birthday Love Letter</h4>
          <div class="field-group">
            <label>Salutation</label>
            <input
              type="text"
              class="field-input"
              [ngModel]="state.config().letterSalutation"
              (ngModelChange)="updateField('letterSalutation', $event)"
            />
          </div>
          <div class="field-group">
            <label>Paragraph 1</label>
            <textarea
              class="field-textarea"
              [ngModel]="state.config().letterParagraph1"
              (ngModelChange)="updateField('letterParagraph1', $event)"
            ></textarea>
          </div>
          <div class="field-group">
            <label>Paragraph 2</label>
            <textarea
              class="field-textarea"
              [ngModel]="state.config().letterParagraph2"
              (ngModelChange)="updateField('letterParagraph2', $event)"
            ></textarea>
          </div>
          <div class="field-group">
            <label>Paragraph 3</label>
            <textarea
              class="field-textarea"
              [ngModel]="state.config().letterParagraph3"
              (ngModelChange)="updateField('letterParagraph3', $event)"
            ></textarea>
          </div>
          <div class="field-group">
            <label>Paragraph 4</label>
            <textarea
              class="field-textarea"
              [ngModel]="state.config().letterParagraph4"
              (ngModelChange)="updateField('letterParagraph4', $event)"
            ></textarea>
          </div>
        </div>

        <!-- 4. Polaroid Memories -->
        <div class="studio-card">
          <h4>📸 4. Polaroid Photo Memories</h4>
          @for (p of state.config().polaroids; track $index) {
            <div class="field-group" style="border-bottom: 1px dashed #f1dfe3; padding-bottom: 10px;">
              <label>Polaroid {{ $index + 1 }} Caption</label>
              <input
                type="text"
                class="field-input"
                [ngModel]="p.caption"
                (ngModelChange)="updatePolaroidCaption($index, $event)"
              />
              <div class="photo-upload-row">
                <img [src]="p.image" class="photo-thumb" alt="Polaroid thumb" />
                <label class="upload-btn">
                  📷 Change Photo {{ $index + 1 }}
                  <input type="file" accept="image/*" (change)="onUploadPolaroid($index, $event)" />
                </label>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="studio-footer">
        <button type="button" class="btn-reset" (click)="state.resetConfig()">
          Reset Defaults
        </button>
        <button type="button" class="btn-done" (click)="state.toggleStudio()">
          Save & Close ❤️
        </button>
      </div>
    </aside>
  `
})
export class CustomizerDrawerComponent {
  readonly state = inject(SurpriseStateService);

  updateField(key: string, value: string): void {
    this.state.updateConfig({ [key]: value });
  }

  updatePolaroidCaption(index: number, caption: string): void {
    const updated = this.state.config().polaroids.map((item, idx) =>
      idx === index ? { ...item, caption } : item
    );
    this.state.updateConfig({ polaroids: updated });
  }

  onUploadPinImage(event: Event): void {
    this.readFileAsDataUrl(event, dataUrl => {
      this.state.updateConfig({ pinImage: dataUrl });
    });
  }

  onUploadPolaroid(index: number, event: Event): void {
    this.readFileAsDataUrl(event, dataUrl => {
      const updated = this.state.config().polaroids.map((item, idx) =>
        idx === index ? { ...item, image: dataUrl } : item
      );
      this.state.updateConfig({ polaroids: updated });
    });
  }

  jumpToLockScreen(): void {
    this.state.restartExperience();
  }

  jumpToPage(page: number): void {
    this.state.isUnlocked.set(true);
    this.state.goToPage(page);
  }

  private readFileAsDataUrl(event: Event, callback: (url: string) => void): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }
}
