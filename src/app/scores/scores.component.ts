import { Component } from '@angular/core';
import { PlayerScores } from '../models/player-scores.model';
import { ScoreService } from '../services/score-service';

@Component({
  selector: 'glm-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {
  scores: PlayerScores;
  displayedColumns: string[] = ['hole', 'par', 'score', 'fairway'];
  totalPar = 0;

  constructor(private readonly scoreService: ScoreService) {
    this.scores = this.scoreService.getScorecard();
  }

  ngOnInit() {
    this.totalPar = this.scores.holeScores.reduce((acc, holeScore) => acc + holeScore.hole.par, 0);
  }
}
