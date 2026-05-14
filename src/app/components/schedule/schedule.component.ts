import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Paths } from '../../app.routes';
import { AppStateService } from '../../services/app-state.service';
import { MatchResultsComponent } from '../match-results/match-results.component';

@Component({
  selector: 'app-schedule',
  imports: [
    DatePipe,
    MatchResultsComponent,
    RouterLink
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  readonly appStateService = inject(AppStateService);
  readonly paths = Paths;
}
