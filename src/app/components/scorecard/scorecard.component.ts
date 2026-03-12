import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RoundHoles } from '../../enums/round-holes.enum';
import { Course } from '../../models/course.model';
import { PlayerScores } from '../../models/player-scores.model';
import { Player } from '../../models/player.model';
import { Scorecard } from '../../models/scorecard.model';
import { CourseService } from '../../services/course.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-scorecard',
  imports: [DatePipe, NgClass],
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss'],
})
export class ScorecardComponent {
  scorecard = input.required<Scorecard>();
  playerScores = input.required<PlayerScores[]>();

  totalPar = 0;
  course: Course | undefined;
  roundHoles = RoundHoles;
  players: { [keyof: string]: Player } = {};

  private readonly courseService = inject(CourseService);
  private readonly playerService = inject(PlayerService);

  ngOnInit() {
    this.courseService.getCourseById(this.scorecard().courseId).subscribe(course => {
      this.course = course;
    });

    this.playerService.getPlayers().subscribe(players => {
      players.forEach(player => {
        this.players[player.id] = player;
      });
    });

    this.totalPar = this.scorecard().holes.reduce((acc, hole) => acc + hole.par, 0);
  }

  strokeRange(strokes: number | null | undefined): number[] {
    return Array.from({ length: Math.max(0, strokes ?? 0) }, (_, i) => i);
  }
}