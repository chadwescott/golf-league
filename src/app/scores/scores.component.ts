import { Component } from '@angular/core';
import { Scorecard } from '../models/scorecard.model';
import { ScoreService } from '../services/score-service';

@Component({
  selector: 'glm-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {
  scorecard: Scorecard;
  displayedColumns: string[] = ['hole', 'par', 'score', 'fairway'];
  totalPar = 0;

  constructor(private readonly scoreService: ScoreService) {
    this.scorecard = this.scoreService.getScorecard();
  }

  ngOnInit() {
    this.totalPar = this.scorecard.holes.reduce((acc, hole) => acc + hole.par, 0);
  }
}
