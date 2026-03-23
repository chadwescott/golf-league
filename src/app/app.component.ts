import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Paths } from './app.routes';
import { AppDataService } from './services/app-data.service';
import { AppStateService } from './services/app-state.service';

@Component({
  selector: 'app-root',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly appStateService = inject(AppStateService);
  private readonly appDataService = inject(AppDataService);

  seasonRoute = computed(() => {
    const leagueId = this.appStateService.selectedLeague()?.id;
    const seasonId = this.appStateService.selectedSeason()?.id;

    if (!leagueId || !seasonId) {
      return ['/', this.paths.leagues];
    }

    return ['/', this.paths.leagues, leagueId, this.paths.seasons, seasonId];
  })

  playersRoute = computed(() => {
    const leagueId = this.appStateService.selectedLeague()?.id;
    const seasonId = this.appStateService.selectedSeason()?.id;

    if (!leagueId || !seasonId) {
      return ['/', this.paths.leagues];
    }

    return ['/', this.paths.leagues, leagueId, this.paths.seasons, seasonId, this.paths.players];
  })

  readonly paths = Paths;

  constructor() {
    effect(() => {
      const selectedLeague = this.appStateService.selectedLeague();
      window.document.title = selectedLeague ? selectedLeague.name : 'Golf League';
    })
  }

  getMatchRoute(matchId: string): string[] {
    const leagueId = this.appStateService.selectedLeague()?.id;
    const seasonId = this.appStateService.selectedSeason()?.id;

    if (!leagueId || !seasonId) {
      return ['/', this.paths.leagues];
    }

    return ['/', this.paths.leagues, leagueId, this.paths.seasons, seasonId, this.paths.matches, matchId];
  }
}
