import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Paths, RouteParams } from '../../app.routes';
import { AppStateService } from '../../services/app-state.service';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-league-dashboard',
  imports: [RouterOutlet],
  templateUrl: './league-dashboard.component.html',
  styleUrl: './league-dashboard.component.scss',
})
export class LeagueDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly leagueService = inject(LeagueService);

  readonly appStateService = inject(AppStateService);

  ngOnInit(): void {
    const leagueId = this.route.snapshot.params[RouteParams.leagueId];

    if (!leagueId) {
      this.appStateService.selectedLeague.set(null);
      this.router.navigate(['/', Paths.leagues]);
    }

    this.leagueService.getLeagueById(leagueId).subscribe(league => {
      if (league) {
        this.appStateService.selectedLeague.set(league);
        return;
      }

      this.appStateService.selectedLeague.set(null);
      this.router.navigate(['/', Paths.leagues]);
    });
  }
}
