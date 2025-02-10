import { Component } from '@angular/core';
import { Scorecards } from '../data/scorecards';

@Component({
  selector: 'glm-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {
  scores = Scorecards;
  displayedColumns: string[] = ['hole', 'par', 'score', 'fairway'];
  totalPar = 0;

  ngOnInit() {
    this.totalPar = this.scores.holeScores.reduce((acc, holeScore) => acc + holeScore.hole.par, 0);
  }
}
