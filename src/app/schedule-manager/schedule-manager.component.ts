import { Component } from '@angular/core';
import { Match } from '../models/match.model';
import { ScoreService } from '../services/score-service';

@Component({
  selector: 'glm-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent {
  schedule: Match[];

  scores = [
    {
      score1: 52,
      score2: 45,
      score3: 46,
      handicap: 0
    },
    {
      score1: 50,
      score2: 51,
      score3: 48,
      handicap: 0
    },
    {
      score1: 67,
      score2: 62,
      score3: 63,
      handicap: 0
    },
    {
      score1: 57,
      score2: 59,
      score3: 56,
      handicap: 0
    },
    {
      score1: 50,
      score2: 57,
      score3: 54,
      handicap: 0
    },
    {
      score1: 63,
      score2: 63,
      score3: 51,
      handicap: 0
    }
  ]

  constructor(private readonly scoreService: ScoreService) {
    this.schedule = this.scoreService.getSchedule();

    this.scores.forEach(score => {
      score.handicap = this.scoreService.getHandicap(score.score1, score.score2, score.score3, 36);
    });
  }
}
