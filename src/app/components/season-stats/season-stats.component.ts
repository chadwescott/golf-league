import { Component, inject } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { PlayerStatsTableComponent } from '../player-stats-table/player-stats-table.component';

@Component({
  selector: 'app-season-stats',
  imports: [
    PlayerStatsTableComponent
  ],
  templateUrl: './season-stats.component.html',
  styleUrl: './season-stats.component.scss',
})
export class SeasonStatsComponent {
  readonly appStateService = inject(AppStateService);
}
