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

interface DigitColumn {
  id: number;
  targetChar: string;
  durationSec: number;
  translateYEm: number;
  cycleNumbers: number[];
}

interface TotalTimeSinceStart {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-counter-page',
  standalone: true,
  template: `
    <section
      class="page-section"
      [class.active]="active()"
      [class.animate-in]="active()"
      id="page-2"
    >
      <div class="page-content">
        <section class="hero">
          <h1 class="hero-title">
            <span>{{ state.config().occasionTitle }}</span>
            <br />
            <span class="hero-highlight">{{ state.config().occasionHighlight }}</span>
          </h1>
        </section>

        <!-- Single Special Date Badge (July 27, 2023) -->
        <div class="special-dates-pills">
          <span class="date-pill active" style="cursor: default;">
            ❤️ Since July 27, 2023
          </span>
        </div>

        <!-- Interactive Slot-Machine Total Days & Total Counts From July 27, 2023 -->
        <section class="counter-box">
          <div class="counter-item live-timer">
            <div class="time-blocks">
              <div class="time-block">
                <div class="slot-days-container" aria-label="Days Together">
                  @for (col of digitColumns(); track col.id) {
                    <div
                      style="height: 1.2em; overflow: hidden; display: inline-block; vertical-align: top;"
                    >
                      <div
                        [style.transition]="'transform ' + col.durationSec + 's cubic-bezier(0.2, 0.8, 0.2, 1)'"
                        [style.transform]="'translateY(-' + col.translateYEm + 'em)'"
                        style="text-align: center; line-height: 1.5em;"
                      >
                        @for (num of col.cycleNumbers; track $index) {
                          <div>{{ num }}</div>
                        }
                        <div>{{ col.targetChar }}</div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <span class="counter-label">{{ state.config().counterLabel }}</span>

            <!-- Total Years, Months, Weeks, Days, Hours, Minutes, Seconds counted from July 27, 2023 -->
            <div class="live-breakdown-grid">
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().years }}</span>
                <span class="breakdown-unit">Years</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().months }}</span>
                <span class="breakdown-unit">Months</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().weeks }}</span>
                <span class="breakdown-unit">Weeks</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().days }}</span>
                <span class="breakdown-unit">Days</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().hours }}</span>
                <span class="breakdown-unit">Hours</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().minutes }}</span>
                <span class="breakdown-unit">Minutes</span>
              </div>
              <div class="breakdown-card">
                <span class="breakdown-value">{{ totalCounts().seconds }}</span>
                <span class="breakdown-unit">Seconds</span>
              </div>
            </div>
          </div>
        </section>

        <div style="margin-top: 1rem; text-align: center;">
          <button type="button" class="next-page-btn" (click)="state.goToPage(3)">
            <span>Read My Letter ➔</span>
          </button>
        </div>
      </div>
    </section>
  `
})
export class CounterPageComponent implements OnInit, OnChanges, OnDestroy {
  readonly state = inject(SurpriseStateService);
  readonly active = input<boolean>(false);

  private intervalId?: ReturnType<typeof setInterval>;

  readonly digitColumns = signal<DigitColumn[]>([]);
  readonly totalCounts = signal<TotalTimeSinceStart>({
    years: '0',
    months: '0',
    weeks: '0',
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0'
  });

  ngOnInit(): void {
    this.updateTotalCounts();
    this.intervalId = setInterval(() => {
      this.updateTotalCounts();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.active()) {
      this.updateTotalCounts();
      this.spinToCurrentDate();
    }
  }

  private parseStartDate(): Date {
    return new Date(2023, 6, 27, 0, 0, 0); // July 27, 2023 00:00:00 local time
  }

  private updateTotalCounts(): void {
    const start = this.parseStartDate();
    const now = new Date();

    const diffMs = Math.max(0, now.getTime() - start.getTime());

    // Total counts directly from July 27, 2023
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Total full months from July 27, 2023
    let totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) {
      totalMonths--;
    }
    totalMonths = Math.max(0, totalMonths);

    // Total full years from July 27, 2023
    const totalYears = Math.floor(totalMonths / 12);

    this.totalCounts.set({
      years: totalYears.toLocaleString(),
      months: totalMonths.toLocaleString(),
      weeks: totalWeeks.toLocaleString(),
      days: totalDays.toLocaleString(),
      hours: totalHours.toLocaleString(),
      minutes: totalMinutes.toLocaleString(),
      seconds: totalSeconds.toLocaleString()
    });
  }

  private spinToCurrentDate(): void {
    const parsed = this.parseStartDate();
    const now = new Date().getTime();
    const targetDays = Math.max(0, Math.floor((now - parsed.getTime()) / (1000 * 60 * 60 * 24)));
    const targetStr = String(targetDays);

    const spinCount = 2;
    const cycleNumbers: number[] = [];
    for (let i = 0; i < spinCount; i++) {
      for (let j = 0; j <= 9; j++) {
        cycleNumbers.push(j);
      }
    }

    const initialCols: DigitColumn[] = targetStr.split('').map((char, index) => ({
      id: index,
      targetChar: char,
      durationSec: 0,
      translateYEm: 0,
      cycleNumbers
    }));
    this.digitColumns.set(initialCols);

    setTimeout(() => {
      const targetTop = spinCount * 10 * 1.5 + 0.15;
      this.digitColumns.set(
        targetStr.split('').map((char, index) => ({
          id: index,
          targetChar: char,
          durationSec: 1.2 + index * 0.22,
          translateYEm: targetTop,
          cycleNumbers
        }))
      );
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
