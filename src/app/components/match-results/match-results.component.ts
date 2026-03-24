import { Component, inject } from '@angular/core';
import { ResultType } from '../../enums/result.enum';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-match-results',
  imports: [],
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.scss',
})
export class MatchResultsComponent {
  readonly appStateService = inject(AppStateService);

  resultType = ResultType;
}
