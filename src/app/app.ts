import { Component, inject } from '@angular/core';
import { HeartsCanvasComponent } from './components/hearts-canvas/hearts-canvas.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { HeroPageComponent } from './components/hero-page/hero-page.component';
import { CounterPageComponent } from './components/counter-page/counter-page.component';
import { LetterPageComponent } from './components/letter-page/letter-page.component';
import { GalleryPageComponent } from './components/gallery-page/gallery-page.component';
import { ProposalPageComponent } from './components/proposal-page/proposal-page.component';
import { CelebrationModalComponent } from './components/celebration-modal/celebration-modal.component';
import { PuzzlePageComponent } from './components/puzzle-page/puzzle-page.component';
import { VideoPageComponent } from './components/video-page/video-page.component';
import { AiVideoPageComponent } from './components/ai-video-page/ai-video-page.component';
import { SurpriseStateService } from './services/surprise-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeartsCanvasComponent,
    AudioPlayerComponent,
    LockScreenComponent,
    HeroPageComponent,
    CounterPageComponent,
    LetterPageComponent,
    GalleryPageComponent,
    ProposalPageComponent,
    CelebrationModalComponent,
    PuzzlePageComponent,
    VideoPageComponent,
    AiVideoPageComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly state = inject(SurpriseStateService);
}
