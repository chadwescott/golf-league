import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouteParams } from '../../app.routes';
import { LeagueService } from '../../services/league.service';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'app-season-dashboard',
  imports: [RouterOutlet],
  templateUrl: './season-dashboard.component.html',
  styleUrl: './season-dashboard.component.scss',
})
export class SeasonDashboardComponent {
  private readonly leagueService = inject(LeagueService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly seasonService = inject(SeasonService);

  ngOnInit(): void {
    const leagueId = this.leagueService.selectedLeague()?.id;
    const seasonId = this.route.snapshot.params[RouteParams.seasonId];

    if (!leagueId || !seasonId) {
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }
    this.seasonService.getSeasonById(leagueId, seasonId).subscribe(season => {
      if (season) {
        this.seasonService.selectSeason(season);
        return;
      }

      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }
}
