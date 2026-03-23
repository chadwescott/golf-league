import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Paths } from '../../app.routes';
import { Season } from '../../models/season.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-season-list',
  imports: [],
  templateUrl: './season-list.component.html',
  styleUrl: './season-list.component.scss',
})
export class SeasonListComponent {
  private readonly router = inject(Router);

  readonly appStateService = inject(AppStateService);

  constructor() {
    effect(() => {
      const league = this.appStateService.selectedLeague();
      if (!league) {
        this.router.navigate(['/', Paths.leagues]);
        return;
      }

      const seasons = this.appStateService.leagueSeasons();
      if (seasons.length === 1) {
        this.router.navigate([`${Paths.seasons}/${seasons[0].id}`], { relativeTo: this.router.routerState.root.firstChild });
      }
    });
  }

  selectSeason(season: Season): void {
    this.router.navigate([`${Paths.seasons}/${season.id}`], { relativeTo: this.router.routerState.root.firstChild });
  }
}
