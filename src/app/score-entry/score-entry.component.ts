import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CdkAriaLive } from "../../../node_modules/@angular/cdk/a11y/index";
import { Courses } from '../data/courses';
import { Players } from '../data/players';
import { Course } from '../models/course.model';
import { Player } from '../models/player.model';
import { RoundHoles } from '../models/round-holes.enum';
import { Scorecard } from '../models/scorecard.model';
import { PlayerScoreEntryComponent } from '../player-score-entry/player-score-entry.component';
import { ScoreService } from '../services/score-service';

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
    PlayerScoreEntryComponent,
    CdkAriaLive
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
  roundHoles = RoundHoles;

  constructor(private readonly scoreService: ScoreService, private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.course = Courses[0];

    this.scorecard = this.scoreService.createScorecard(this.course, RoundHoles.Front);
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
        inScore: 0,
        outScore: 0,
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
        outScore: 0,
        inScore: 0,
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

  savePlayerScore(): void {
    this.scorecard.scores = this.formGroup.get('scores')?.value || [];
    this.scoreService.saveScores(this.scorecard);
  }
}
