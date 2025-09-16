import { Component } from '@angular/core';
import { Match } from '../models/match.model';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'glm-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  styleUrls: ['./schedule-manager.component.scss']
})
export class ScheduleManagerComponent {
  schedule: Match[];

  scores = [
    {
      player: 'Craig (Ace)',
      scores: [68, 60, 62, 58, 65, 58, 59, 61],
      handicap: 0
    },
    {
      player: 'Chad',
      scores: [47, 47, 50, 44, 43, 43, 43, 41, 43],
      handicap: 0
    },
    {
      player: 'Kim',
      scores: [53, 49, 49, 53, 51, 51, 47, 44, 47],
      handicap: 0
    },
    {
      player: 'Bill',
      scores: [48, 52, 46, 47, 51, 51],
      handicap: 0
    },
    {
      player: 'Willie',
      scores: [57, 56, 57, 62, 54, 55, 57, 55],
      handicap: 0
    },
    {
      player: 'Mark',
      scores: [51, 48, 53, 49, 49, 47, 50],
      handicap: 0
    },
    {
      player: 'Tim',
      scores: [54, 53, 54, 57, 60, 54, 56, 57, 54],
      handicap: 0
    },
    {
      player: 'James',
      scores: [49, 48, 45, 47, 48, 45, 47, 49, 46],
      handicap: 0
    },
    {
      player: 'Makia',
      scores: [50, 60, 56, 57, 56, 55, 57, 59, 58],
      handicap: 0
    },
    {
      player: 'Steph',
      scores: [52, 54, 52, 56, 56, 50, 50, 52, 49, 51],
      handicap: 0
    }
  ]

  constructor(private readonly scoreService: ScoreService) {
    this.schedule = this.scoreService.getSchedule();

    this.scores.forEach(score => {
      score.handicap = this.scoreService.getHandicap(score.scores, 36);
    });
  }
}
