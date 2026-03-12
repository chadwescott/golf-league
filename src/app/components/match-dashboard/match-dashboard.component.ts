import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { RouteParams } from '../../app.routes';
import { MatchService } from '../../services/match.service';

import { DatePipe } from '@angular/common';
import { Match } from '../../models/match.model';
import { PlayerMatchStats } from '../../models/player-match-stats.model';
import { PlayerScoresService } from '../../services/player-score.service';
import { ScorecardService } from '../../services/scorecard.service';
import { PlayerMatchStatsTableComponent } from '../player-match-stats-table/player-match-stats-table.component';
import { ScorecardComponent } from '../scorecard/scorecard.component';

@Component({
  selector: 'app-match-dashboard',
  imports: [DatePipe, PlayerMatchStatsTableComponent, ScorecardComponent],
  templateUrl: './match-dashboard.component.html',
  styleUrl: './match-dashboard.component.scss',
})
export class MatchDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly matchService = inject(MatchService);
  private readonly scorecardService = inject(ScorecardService);
  private readonly playerScoresService = inject(PlayerScoresService);

  private leagueId: string | undefined;
  private seasonId: string | undefined;
  private matchId: string | undefined;

  match = signal<Match | undefined>(undefined);
  scorecard = toSignal(
    toObservable(this.match).pipe(
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

  playerMatchStats: PlayerMatchStats[] = [];

  private readonly activeMatchId = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let r: ActivatedRoute | null = this.route;
        while (r?.firstChild) {
          r = r.firstChild;
        }
        return r?.snapshot.paramMap.get(RouteParams.matchId) ?? null;
      })
    ),
    { initialValue: null }
  );

  ngOnInit(): void {
    this.leagueId = this.route.snapshot.parent?.parent?.params[RouteParams.leagueId];
    this.seasonId = this.route.snapshot.parent?.params[RouteParams.seasonId];

    if (!this.leagueId || !this.seasonId) {
      return;
    }

    this.router.events.pipe(
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
        this.updatePlayerStatsForMatch();
      });
  }

  private updateMatch(): void {
    this.matchService.getMatchById(this.leagueId!, this.seasonId!, this.matchId!).subscribe(match => {
      this.match.set(match);
    });
  }

  private updatePlayerStatsForMatch(): void {
    this.matchService.getPlayerStatsByMatchId(this.leagueId!, this.seasonId!, this.matchId!).subscribe(playerStats => {
      this.playerMatchStats = playerStats;
    });

  }
}

