import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
  input,
  signal
} from '@angular/core';
import { SurpriseStateService } from '../../services/surprise-state.service';

interface PuzzlePiece {
  id: number; // 0..8 (target position)
  currentPos: number; // 0..8 (current grid position)
  bgX: number; // percentage
  bgY: number; // percentage
}

@Component({
  selector: 'app-puzzle-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-6"
    >
      <div class="page-content" style="max-width: 820px; width: 94%;">
        <section class="hero" style="padding-bottom: 0.5rem;">
          <h1 class="hero-title" style="opacity: 1;">
            <span>{{ state.config().puzzleTitle }}</span>
            <br />
            <span class="hero-highlight">Put Us Together ❤️</span>
          </h1>
          <p class="hero-subtitle" style="font-size: 1.15rem; max-width: 620px;">
            {{ state.config().puzzleSubtitle }}
          </p>
        </section>

        <!-- Stats & Action Bar -->
        <div class="puzzle-controls-bar">
          <div class="puzzle-stat-pill">
            <span>Moves:</span>
            <strong>{{ moveCount() }}</strong>
          </div>
          <div class="puzzle-stat-pill">
            <span>Time:</span>
            <strong>{{ formattedTime() }}</strong>
          </div>
          <button
            type="button"
            class="puzzle-tool-btn"
            (click)="togglePeek()"
          >
            {{ isPeeking() ? 'Hide Photo ✕' : '👀 Peek Photo' }}
          </button>
        </div>

        <!-- Optional Peek Card -->
        @if (isPeeking()) {
          <div class="puzzle-peek-card">
            <img [src]="state.config().puzzleImage" alt="Peek Solution" />
            <p>Here is our photo! Place the pieces to match this ❤️</p>
          </div>
        }

        <!-- 5x5 Jigsaw Puzzle Grid (25 Tiles) -->
        <div class="puzzle-board" [class.solved]="isSolved()">
          @for (piece of pieces(); track piece.id) {
            <button
              type="button"
              class="puzzle-tile"
              [class.selected]="selectedPieceId() === piece.id"
              [class.correct]="piece.currentPos === piece.id"
              [style.background-image]="'url(' + state.config().puzzleImage + ')'"
              [style.background-position]="piece.bgX + '% ' + piece.bgY + '%'"
              [style.order]="piece.currentPos"
              (click)="onTileClick(piece)"
              [disabled]="isSolved()"
            >
              @if (piece.currentPos === piece.id) {
                <span class="correct-badge">💚</span>
              }
            </button>
          }
        </div>

        <!-- Solved Victory Banner & Reveal Button -->
        @if (isSolved()) {
          <div class="puzzle-solved-banner">
            <h3 class="solved-heading">🎉 You Did It, Chacha! ❤️</h3>
            <p class="solved-message">
              You put all our pieces together! Just like you complete every piece of my heart.
              Now, our special memory video is waiting for you...
            </p>
            <button
              type="button"
              class="next-page-btn"
              style="margin-top: 1rem; font-size: 1.15rem; padding: 14px 36px;"
              (click)="state.goToPage(7)"
            >
              Watch Our Memory Video 🎬 ➔
            </button>
          </div>
        }
      </div>
    </section>
  `
})
export class PuzzlePageComponent implements OnInit, OnChanges, OnDestroy {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  readonly pieces = signal<PuzzlePiece[]>([]);
  readonly selectedPieceId = signal<number | null>(null);
  readonly moveCount = signal<number>(0);
  readonly secondsElapsed = signal<number>(0);
  readonly isSolved = signal<boolean>(false);
  readonly isPeeking = signal<boolean>(false);

  private timerId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.initPuzzle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.active()) {
      if (!this.isSolved()) {
        this.startTimer();
      }
    } else if (changes['active'] && !this.active()) {
      this.stopTimer();
    }
  }

  formattedTime(): string {
    const s = this.secondsElapsed();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  private initPuzzle(): void {
    const basePieces: PuzzlePiece[] = [];
    const rows = 5;
    const cols = 5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const bgX = (c / (cols - 1)) * 100;
        const bgY = (r / (rows - 1)) * 100;
        basePieces.push({ id, currentPos: id, bgX, bgY });
      }
    }

    // Shuffle currentPos ensuring it is not already solved
    this.shufflePositions(basePieces);
    this.pieces.set(basePieces);
    this.moveCount.set(0);
    this.isSolved.set(false);
  }

  private shufflePositions(arr: PuzzlePiece[]): void {
    const positions = arr.map(p => p.id);
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Apply shuffled positions
    arr.forEach((p, idx) => {
      p.currentPos = positions[idx];
    });

    // Check if accidentally solved on shuffle
    if (this.checkIfSolved(arr)) {
      // Swap first two positions
      const temp = arr[0].currentPos;
      arr[0].currentPos = arr[1].currentPos;
      arr[1].currentPos = temp;
    }
  }

  onTileClick(clicked: PuzzlePiece): void {
    if (this.isSolved()) return;

    const selectedId = this.selectedPieceId();
    if (selectedId === null) {
      this.selectedPieceId.set(clicked.id);
    } else if (selectedId === clicked.id) {
      this.selectedPieceId.set(null);
    } else {
      // Swap clicked piece with selected piece
      const currentPieces = this.pieces();
      const first = currentPieces.find(p => p.id === selectedId);
      const second = currentPieces.find(p => p.id === clicked.id);

      if (first && second) {
        const tempPos = first.currentPos;
        first.currentPos = second.currentPos;
        second.currentPos = tempPos;

        this.moveCount.update(c => c + 1);
        this.selectedPieceId.set(null);
        this.pieces.set([...currentPieces]);

        if (this.checkIfSolved(currentPieces)) {
          this.isSolved.set(true);
          this.stopTimer();
          this.state.tryAutoPlayMusic();
        }
      }
    }
  }

  private checkIfSolved(arr: PuzzlePiece[]): boolean {
    return arr.every(p => p.currentPos === p.id);
  }

  togglePeek(): void {
    this.isPeeking.update(v => !v);
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerId = setInterval(() => {
      this.secondsElapsed.update(s => s + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
