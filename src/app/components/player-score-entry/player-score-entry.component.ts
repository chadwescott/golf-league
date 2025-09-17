import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PlayerScores } from '../../models/player-scores.model';
import { RoundHoles } from '../../models/round-holes.enum';
import { ScoreType } from '../../models/score-type.enum';

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
  roundHoles!: RoundHoles;

  roundHolesEnum = RoundHoles;
  holeScoresGroup!: FormGroup;

  get holeScoresArray(): FormArray {
    return this.holeScoresGroup.get('holeScores') as FormArray;
  }

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    const playerScores = this.formGroup.get('scores') as FormArray;
    this.holeScoresGroup = playerScores.controls.find(control => control.get('player')?.value.id === this.scores.player.id) as FormGroup;
  }

  calculateScore() {
    let totalScore = 0;
    let points = 0;
    let inScore = 0;
    let outScore = 0;

    this.holeScoresArray.controls.forEach((holeScore, index) => {
      const score = holeScore.get('score')?.value;
      const par = holeScore.get('par')?.value;
      if (score === null) { return; }

      if (index < 9) {
        if (this.roundHoles === RoundHoles.Back) {
          inScore += score;
        } else {
          outScore += score;
        }
      } else {
        inScore += score;
      }

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

    this.scores.outScore = outScore;
    this.scores.inScore = inScore;
    this.scores.totalScore = totalScore;
    this.scores.points = points;
    this.holeScoresGroup.get('outScore')?.setValue(outScore);
    this.holeScoresGroup.get('inScore')?.setValue(inScore);
    this.holeScoresGroup.get('totalScore')?.setValue(totalScore);
    this.holeScoresGroup.get('points')?.setValue(points);
  }
}
