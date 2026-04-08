import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import { RouteParams } from '../../app.routes';
import { Season } from '../../models/season.model';
import { AppStateService } from '../../services/app-state.service';
import { PlayerStatsTableComponent } from '../player-stats-table/player-stats-table.component';

@Component({
  selector: 'app-season-dashboard',
  imports: [
    RouterOutlet,
    PlayerStatsTableComponent
  ],
  templateUrl: './season-dashboard.component.html',
  styleUrl: './season-dashboard.component.scss',
})
export class SeasonDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

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
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(data => (data['season'] as Season | null) ?? null)
    ).subscribe(season => {
      this.leagueId = this.route.parent?.snapshot.paramMap.get(RouteParams.leagueId) ?? undefined;
      this.seasonId = season?.id;

      if (!this.leagueId || !season) {
        this.appStateService.selectedSeason.set(null);
        this.router.navigate(['..'], { relativeTo: this.route });
        return;
      }

      this.appStateService.selectedSeason.set(season);
    });
  }
}
