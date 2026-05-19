import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ResultType } from '../../enums/result.enum';
import { MatchMatchup } from '../../models/match-matchup.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-match-results',
  imports: [
    NgClass,
    DecimalPipe
  ],
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.scss',
})
export class MatchResultsComponent {
  readonly appStateService = inject(AppStateService);

  matchups = input.required<MatchMatchup[]>();

  resultType = ResultType;
}
