import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Hole } from '../models/hole.model';
import { PlayerScores } from '../models/player-scores.model';
import { ScoreType } from '../models/score-type.enum';

@Component({
  selector: '[glm-player-score-entry]',
  standalone: true,
  templateUrl: './player-score-entry.component.html',
  styleUrl: './player-score-entry.component.scss',
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ]
})
export class PlayerScoreEntryComponent {
  @Input()
  formGroup!: FormGroup;

  @Input()
  scores!: PlayerScores;

  @Input()
  holes!: Hole[];

  holeScoresGroup!: FormGroup;

  get holeScoresArray(): FormArray {
    return this.holeScoresGroup.get('holeScores') as FormArray;
  }

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.holeScoresGroup = this.fb.group({
      player: this.scores.player,
      handicap: this.scores.player.handicap,
      totalScore: 0,
      points: 0,
      holeScores: this.fb.array(this.holes.map(hole => (
        this.fb.group({
          par: hole.par,
          score: null,
          fairwayHit: false,
          scoreType: null
        })
      )
      ))
    });

    (this.formGroup.get('scores') as FormArray).push(this.holeScoresGroup);
  }

  calculateScore() {
    let totalScore = 0;
    let points = 0;

    this.holeScoresArray.controls.forEach((holeScore, index) => {
      const score = holeScore.get('score')?.value;
      const par = holeScore.get('par')?.value;
      if (score === null) { return; }

      totalScore += score;
      if (holeScore.get('fairwayHit')?.value) {
        points++;
      }

      switch (score - par) {
        case -3:
          holeScore.get('scoreType')?.setValue(ScoreType.Albatross);
          points += 5;
          break;
        case -2:
          holeScore.get('scoreType')?.setValue(ScoreType.Eagle);
          points += 4;
          break;
        case -1:
          holeScore.get('scoreType')?.setValue(ScoreType.Birdie);
          points += 3;
          break;
        case 0:
          holeScore.get('scoreType')?.setValue(ScoreType.Par);
          points += 2;
          break;
        case 1:
          holeScore.get('scoreType')?.setValue(ScoreType.Bogey);
          points += 1;
          break;
        case 2:
          holeScore.get('scoreType')?.setValue(ScoreType.DoubleBogey);
          break;
        default:
          holeScore.get('scoreType')?.setValue(ScoreType.Other);
      }
    });

    this.holeScoresGroup.get('totalScore')?.setValue(totalScore);
    this.holeScoresGroup.get('points')?.setValue(points);
  }
}
