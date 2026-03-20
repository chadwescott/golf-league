import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { RouteParams } from '../../app.routes';
import { MatchService } from '../../services/match.service';

import { DatePipe } from '@angular/common';
import { MatchTypes } from '../../enums/match-types.enum';
import { AppStateService } from '../../services/app-state.service';
import { PlayerScoresService } from '../../services/player-score.service';
import { ScorecardService } from '../../services/scorecard.service';
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
  private readonly matchService = inject(MatchService);
  private readonly scorecardService = inject(ScorecardService);
  private readonly playerScoresService = inject(PlayerScoresService);
  private readonly destroyRef = inject(DestroyRef);

  private leagueId: string | undefined;
  private seasonId: string | undefined;
  private matchId: string | undefined;

  readonly appStateService = inject(AppStateService);

  hasHandicap = computed(() => {
    const playerMatchStats = this.appStateService.playerMatchStats();
    return playerMatchStats.some(stats => stats.handicap !== undefined && stats.handicap !== null);
  });

  matchTypes = MatchTypes;

  scorecard = toSignal(
    toObservable(this.appStateService.selectedMatch).pipe(
      switchMap(match => {
        if (!match?.scorecardId) {
          return of(undefined);
        }

        return this.scorecardService.getScorecardById(match.scorecardId);
      })
    ),
    { initialValue: undefined }
  );

  playerScores = toSignal(
    toObservable(this.scorecard).pipe(
      switchMap(scorecard => {
        if (!scorecard?.id) {
          return of(undefined);
        }

        return this.playerScoresService.getPlayerScoresByScorecardId(scorecard.id);
      })
    ),
    { initialValue: undefined }
  );

  ngOnInit(): void {
    this.leagueId = this.appStateService.selectedLeague()?.id;
    this.seasonId = this.appStateService.selectedSeason()?.id;

    if (!this.leagueId || !this.seasonId) {
      return;
    }

    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let r: ActivatedRoute | null = this.route;
        while (r?.firstChild) {
          r = r.firstChild;
        }
        return r?.snapshot.paramMap.get(RouteParams.matchId) ?? null;
      }),
      filter(matchId => !!matchId)
    )
      .subscribe(matchId => {
        this.matchId = matchId!;
        this.updateMatch();
      });
  }

  ngOnDestroy(): void {
    this.appStateService.selectedMatch.set(null);
  }

  private updateMatch(): void {
    this.matchService.getMatchById(this.leagueId!, this.seasonId!, this.matchId!).subscribe(match => {
      this.appStateService.selectedMatch.set(match);
    });
  }
}

