import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDataService } from './services/app-data.service';
import { AppStateService } from './services/app-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly appStateService = inject(AppStateService);
  private readonly appDataService = inject(AppDataService);

  constructor() {
    effect(() => {
      const selectedLeague = this.appStateService.selectedLeague();
      window.document.title = selectedLeague ? selectedLeague.name : 'Golf League';
    })
  }
}
