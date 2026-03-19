import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Paths, RouteParams } from '../../app.routes';
import { AppStateService } from '../../services/app-state.service';
import { SeasonService } from '../../services/season.service';
import { MatchListComponent } from '../match-list/match-list.component';
import { PlayerStatsTableComponent } from '../player-stats-table/player-stats-table.component';

@Component({
  selector: 'app-season-dashboard',
  imports: [
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

  readonly appStateService = inject(AppStateService);

  leagueId: string | undefined;
  seasonId: string | undefined;

  selectedMatch = computed(() => {
    const matches = this.appStateService.seasonMatches();
    const matchId = this.appStateService.selectedMatch()?.id;

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
        return;
      }

      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  goBackToSeason(): void {
    // this.appStateService.selectedMatch.set(null);

    const leagueId = this.appStateService.selectedLeague()?.id ?? this.leagueId;
    const seasonId = this.appStateService.selectedSeason()?.id ?? this.seasonId;

    if (!leagueId || !seasonId) {
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }

    this.router.navigate(['/', Paths.leagues, leagueId, Paths.seasons, seasonId]);
  }
}
