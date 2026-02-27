import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Paths } from '../../app.routes';
import { League } from '../../models/league.model';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-league-list',
  imports: [],
  templateUrl: './league-list.component.html',
  styleUrl: './league-list.component.scss',
})
export class LeagueListComponent {
  leagues: League[] = [];

  private readonly leagueService = inject(LeagueService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.leagueService.getLeagues().subscribe(leagues => this.leagues = leagues);
  }

  selectLeague(league: League): void {
    this.router.navigate([`/${Paths.leagues}/${league.id}`]);
  }
}
