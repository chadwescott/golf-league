import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Paths } from '../../app.routes';
import { Season } from '../../models/season.model';
import { AppStateService } from '../../services/app-state.service';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'app-season-list',
  imports: [],
  templateUrl: './season-list.component.html',
  styleUrl: './season-list.component.scss',
})
export class SeasonListComponent {
  seasons: Season[] = [];

  private readonly appStateService = inject(AppStateService);
  private readonly seasonService = inject(SeasonService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const league = this.appStateService.selectedLeague();
      if (!league) {
        this.router.navigate(['/', Paths.leagues]);
        return;
      }

      this.seasonService.getSeasonsByLeagueId(league.id).subscribe(seasons => {
        this.seasons = seasons;
        if (seasons.length === 1) {
          this.router.navigate([`${Paths.seasons}/${seasons[0].id}`], { relativeTo: this.router.routerState.root.firstChild });
        }
      });
    });
  }

  selectSeason(season: Season): void {
    this.router.navigate([`${Paths.seasons}/${season.id}`], { relativeTo: this.router.routerState.root.firstChild });
  }
}
