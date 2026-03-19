import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
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
  sortedPlayerScores = computed<PlayerScores[]>(() => {
    return this.sortPlayerScoresByPlayerName();
  });

  totalPar = 0;
  course: Course | undefined;
  roundHoles = RoundHoles;
  players = signal<{ [keyof: string]: Player }>({});

  private readonly courseService = inject(CourseService);
  private readonly playerService = inject(PlayerService);

  ngOnInit() {
    this.courseService.getCourseById(this.scorecard().courseId).subscribe(course => {
      this.course = course;
    });

    this.playerService.getPlayers().subscribe(players => {
      const playersMap: { [keyof: string]: Player } = {};
      players.forEach(player => {
        playersMap[player.id] = player;
      });
      this.players.set(playersMap);
    });

    this.totalPar = this.scorecard().holes.reduce((acc, hole) => acc + hole.par, 0);
  }

  strokeRange(strokes: number | null | undefined): number[] {
    return Array.from({ length: Math.max(0, strokes ?? 0) }, (_, i) => i);
  }

  sortPlayerScoresByPlayerName() {
    return this.playerScores().slice().sort((a, b) => {
      const playerA = this.players()[a.playerId];
      const playerB = this.players()[b.playerId];
      if (!playerA || !playerB) return 0;
      const nameA = `${playerA.lastName} ${playerA.firstName}`.toLowerCase();
      const nameB = `${playerB.lastName} ${playerB.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  sortPlayerScoresByTotalScore() {
    return this.playerScores().slice().sort((a, b) => {
      const aTotalScore = a.totalScore ?? 0;
      const bTotalScore = b.totalScore ?? 0;
      return aTotalScore < bTotalScore ? -1 : aTotalScore > bTotalScore ? 1 : 0;
    });
  }
}