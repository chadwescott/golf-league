import { Component } from '@angular/core';
import { Scorecard } from '../models/scorecard.model';
import { ScoreService } from '../services/score-service';

@Component({
  selector: 'glm-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {
  scorecard: Scorecard;
  totalPar = 0;

  constructor(private readonly scoreService: ScoreService) {
    this.scorecard = this.scoreService.getScorecard();
  }

  ngOnInit() {
    this.totalPar = this.scorecard.holes.reduce((acc, hole) => acc + hole.par, 0);
  }
}