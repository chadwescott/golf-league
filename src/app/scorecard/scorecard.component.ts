import { Component } from '@angular/core';

import { Courses } from '../data/courses';
import { Course } from '../models/course.model';
import { HoleScore } from '../models/hole-score.model';
import { RoundHoles } from '../models/round-holes.enum';
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
  course: Course | undefined;
  roundHoles = RoundHoles;

  constructor(private readonly scoreService: ScoreService) {
    this.scorecard = this.scoreService.getScorecard();
    this.course = Courses.find(c => c.id === this.scorecard.courseId);
  }

  ngOnInit() {
    this.totalPar = this.scorecard.holes.reduce((acc, hole) => acc + hole.par, 0);
  }

  getPoints(scores: HoleScore[]): number {
    return this.scoreService.getPoints(scores);
  }
}