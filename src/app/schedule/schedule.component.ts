import { Component } from '@angular/core';
import { Match } from '../models/match.model';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'glm-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
  schedule: Match[];

  constructor(private readonly scoreService: ScoreService) {
    this.schedule = this.scoreService.getSchedule();
  }
}
