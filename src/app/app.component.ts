import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeagueService } from './services/league.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly leagueService = inject(LeagueService);

  constructor() {
    effect(() => {
      const selectedLeague = this.leagueService.selectedLeague();
      window.document.title = selectedLeague ? selectedLeague.name : 'Golf League';
    })
  }
}
