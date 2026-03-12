import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { RouteParams } from '../../app.routes';
import { Match } from '../../models/match.model';
import { PlayerStats } from '../../models/player-stats';
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
  readonly seasonService = inject(SeasonService);
  readonly matchService = inject(MatchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  leagueId: string | undefined;
  seasonId: string | undefined;

  matches = signal<Match[]>([]);
  playerStats = signal<PlayerStats[]>([]);

  matchStats = computed<{ [key: string]: PlayerStats[] }>(() => {
    const results: { [key: string]: PlayerStats[] } = {};

    this.matches().forEach(match => {
      const matchPlayerStats = this.playerStats().find(ps => ps.leagueEventId === match.id);
      results[match.id] = matchPlayerStats ? [matchPlayerStats] : [];
    });

    return results;
  });

  readonly activeMatchId = toSignal(
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
    const matches = this.matches();
    const matchId = this.activeMatchId();

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
    this.leagueId = this.route.parent?.snapshot.params[RouteParams.leagueId];
    this.seasonId = this.route.snapshot.params[RouteParams.seasonId];

    if (!this.leagueId || !this.seasonId) {
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    this.seasonService.getSeasonById(this.leagueId, this.seasonId).subscribe(season => {
      if (season) {
        this.seasonService.selectSeason(season);
        this.matchService.getMatchesByLeagueIdAndSeasonId(this.leagueId!, this.seasonId!).subscribe(le => this.matches.set(le));
        return;
      }

      this.router.navigate(['..'], { relativeTo: this.route });
    });

    this.seasonService.getPlayerStatsBySeasonId(this.leagueId, this.seasonId).subscribe(playerStats => {
      this.playerStats.set(playerStats);
    });
  }
}
