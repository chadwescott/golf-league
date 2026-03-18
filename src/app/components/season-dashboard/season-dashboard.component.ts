import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { RouteParams } from '../../app.routes';
import { PlayerStats } from '../../models/player-stats';
import { AppStateService } from '../../services/app-state.service';
import { MatchService } from '../../services/match.service';
import { SeasonService } from '../../services/season.service';
import { MatchListComponent } from '../match-list/match-list.component';
import { PlayerStatsTableComponent } from '../player-stats-table/player-stats-table.component';

@Component({
  selector: 'app-season-dashboard',
  imports: [
    DatePipe,
    RouterOutlet,
    MatchListComponent,
    PlayerStatsTableComponent
  ],
  templateUrl: './season-dashboard.component.html',
  styleUrl: './season-dashboard.component.scss',
})
export class SeasonDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seasonService = inject(SeasonService);
  private readonly matchService = inject(MatchService);

  readonly appStateService = inject(AppStateService);

  leagueId: string | undefined;
  seasonId: string | undefined;

  playerStats = signal<PlayerStats[]>([]);

  matchStats = computed<{ [key: string]: PlayerStats[] }>(() => {
    const results: { [key: string]: PlayerStats[] } = {};

    this.appStateService.seasonMatches().forEach(match => {
      const matchPlayerStats = this.playerStats().find(ps => ps.leagueEventId === match.id);
      results[match.id] = matchPlayerStats ? [matchPlayerStats] : [];
    });

    return results;
  });

  readonly selectedMatchId = toSignal(
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

  selectedMatch = computed(() => {
    const matches = this.appStateService.seasonMatches();
    const matchId = this.selectedMatchId();

    if (!matches.length) {
      return null;
    }

    if (matchId) {
      return matches.find(m => m.id === matchId) ?? null;
    }

    return matches.reduce((latest, match) =>
      new Date(match.date) > new Date(latest.date) ? match : latest
      , matches[0]);
  });

  playerSeasonStats = computed<PlayerStats[]>(() => {
    const playerStats = this.playerStats();
    const selectedMatch = this.selectedMatch();

    if (playerStats.length === 0 || !selectedMatch) {
      return [];
    }

    const results: PlayerStats[] = [];
    const playerIds = [...new Set(playerStats.map(ps => ps.playerId))];

    playerIds.forEach(playerId => {
      const playerStatsForPlayer = playerStats.filter(ps => ps.playerId === playerId && ps.leagueEventId === selectedMatch.id);
      if (playerStatsForPlayer.length > 0) {
        results.push(playerStatsForPlayer[0]);
      }
    });

    return results;
  });

  ngOnInit(): void {
    this.leagueId = this.appStateService.selectedLeague()?.id;
    this.seasonId = this.route.snapshot.params[RouteParams.seasonId];

    if (!this.leagueId || !this.seasonId) {
      this.appStateService.selectedSeason.set(null);
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    this.seasonService.getSeasonById(this.leagueId, this.seasonId).subscribe(season => {
      if (season) {
        this.appStateService.selectedSeason.set(season);
        this.matchService.getMatchesByLeagueIdAndSeasonId(this.leagueId!, this.seasonId!).subscribe(le => this.appStateService.seasonMatches.set(le));
        return;
      }

      this.router.navigate(['..'], { relativeTo: this.route });
    });

    this.seasonService.getPlayerStatsBySeasonId(this.leagueId, this.seasonId).subscribe(playerStats => {
      this.playerStats.set(playerStats);
    });
  }
}
