import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CourseService } from 'src/app/services/course.service';
import { Course } from '../../models/course.model';
import { Player } from '../../models/player.model';
import { RoundHoles } from '../../models/round-holes.enum';
import { Scorecard } from '../../models/scorecard.model';
import { ScoreService } from '../../services/score.service';
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
  @Input()
  course!: Course;

  @Input()
  roundeHole: RoundHoles = RoundHoles.Front;

  @Input()
  scorecard: Scorecard | null = null;

  formGroup!: FormGroup;
  totalPar = 0;
  selectedPlayer: Player | null = null;
  scores: FormArray | null = null;
  roundHoles = RoundHoles;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly courseService: CourseService,
    private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => {
      if (courses.length > 0) {
        this.course = courses[0];
        this.scorecard = this.scoreService.createScorecard(this.course, this.roundeHole);
        this.totalPar = this.scorecard.holes.reduce((acc, hole) => acc + hole.par, 0);
      }
    });

    this.initializeForm();
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

  savePlayerScore(): void {
    if (!this.scorecard) {
      return;
    }
    this.scorecard.scores = this.formGroup.get('scores')?.value || [];
    this.scoreService.saveScores(this.scorecard);
  }
}
