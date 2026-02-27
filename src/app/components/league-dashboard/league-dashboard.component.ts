import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paths, RouteParams } from '../../app.routes';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-league-dashboard',
  imports: [],
  templateUrl: './league-dashboard.component.html',
  styleUrl: './league-dashboard.component.scss',
})
export class LeagueDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly leagueService = inject(LeagueService);

  ngOnInit(): void {
    const leagueId = this.route.snapshot.params[RouteParams.leagueId];
    if (!leagueId) {
      this.router.navigate(['/', Paths.leagues]);
    }
    const league = this.leagueService.getLeagueById(leagueId).subscribe(league => {
      if (league) {
        this.leagueService.selectLeague(league);
        return;
      }

      this.router.navigate(['/', Paths.leagues]);
    });
  }
}
