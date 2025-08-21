import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Courses } from '../data/courses';
import { Players } from '../data/players';
import { Course } from '../models/course.model';
import { Player } from '../models/player.model';
import { Scorecard } from '../models/scorecard.model';
import { PlayerScoreEntryComponent } from '../player-score-entry/player-score-entry.component';

@Component({
  selector: 'glm-score-entry',
  standalone: true,
  templateUrl: './score-entry.component.html',
  styleUrls: ['./score-entry.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    PlayerScoreEntryComponent
  ]
})
export class ScoreEntryComponent {
  formGroup!: FormGroup;
  course!: Course;
  scorecard!: Scorecard;
  totalPar = 0;
  players = Players;
  selectedPlayer: Player | null = null;
  scores: FormArray | null = null;

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.course = Courses[0];
    const holes = this.course.holes.splice(0, 9);

    this.scorecard = {
      course: this.course,
      date: new Date(),
      holes: holes,
      id: 'sample-scorecard-id',
      scores: []
    };
    this.initializeForm();

    this.totalPar = this.scorecard.holes.reduce((acc, hole) => acc + hole.par, 0);
  }

  initializeForm() {
    const params: any = {
      roundDate: new FormControl(new Date(), Validators.required),
      scores: this.fb.array([])
    };

    this.formGroup = new FormGroup(params);
    this.scores = this.formGroup.get('scores') as FormArray;
  }

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
  }

  addPlayer() {
    if (this.selectedPlayer && !this.scorecard.scores.some(score => score.player.id === this.selectedPlayer!.id)) {
      const score = {
        player: this.selectedPlayer,
        handicap: this.selectedPlayer.handicap,
        totalScore: 0,
        points: 0,
        holeScores: this.scorecard.holes.map(hole => ({
          hole: hole,
          score: null,
          fairwayHit: false,
          scoreType: null
        }))
      };

      this.scorecard.scores.push(score);
      this.players.splice(this.players.indexOf(this.selectedPlayer), 1);
      this.selectedPlayer = null;

      const holeScoresGroup = this.fb.group({
        player: score.player,
        handicap: score.player.handicap,
        totalScore: 0,
        points: 0,
        holeScores: this.fb.array(score.holeScores.map(holeScore => (
          this.fb.group({
            hole: holeScore.hole,
            par: holeScore.hole.par,
            score: holeScore.score,
            fairwayHit: holeScore.fairwayHit,
            scoreType: holeScore.scoreType ?? null
          })
        )
        ))
      });

      (this.formGroup.get('scores') as FormArray).push(holeScoresGroup);
    }
  }

  editPlayerScore(): void {
    console.log(this.formGroup);
    this.scorecard.scores = this.formGroup.get('scores')?.value || [];
    console.log(this.scorecard);
  }
}
