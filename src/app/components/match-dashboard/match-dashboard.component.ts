import { Component, computed, DestroyRef, inject, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { MatchTypes } from '../../enums/match-types.enum';
import { Match } from '../../models/match.model';
import { AppStateService } from '../../services/app-state.service';
import { MatchResultsComponent } from '../match-results/match-results.component';
import { PlayerMatchStatsTableComponent } from '../player-match-stats-table/player-match-stats-table.component';
import { PlayerStatsTableComponent } from '../player-stats-table/player-stats-table.component';
import { ScorecardComponent } from '../scorecard/scorecard.component';

@Component({
  selector: 'app-match-dashboard',
  imports: [
    DatePipe,
    MatchResultsComponent,
    PlayerMatchStatsTableComponent,
    PlayerStatsTableComponent,
    ScorecardComponent
  ],
  templateUrl: './match-dashboard.component.html',
  styleUrl: './match-dashboard.component.scss',
})
export class MatchDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  readonly appStateService = inject(AppStateService);

  hasHandicap = computed(() => {
    const playerMatchStats = this.appStateService.playerMatchStats();
    return playerMatchStats.some(stats => stats.handicap !== undefined && stats.handicap !== null);
  });

  matchTypes = MatchTypes;

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(data => data['match'] as Match | null | undefined),
      filter((match): match is Match | null => match !== undefined),
      take(1)
    ).subscribe(match => {
      if (!match) {
        this.router.navigate(['../..'], { relativeTo: this.route });
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.appStateService.selectedMatch.set(null);
  }
}
