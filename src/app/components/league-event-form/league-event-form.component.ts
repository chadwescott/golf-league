import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RoundHoles } from 'src/app/models/round-holes.enum';
import { CourseService } from 'src/app/services/course.service';
import { LeagueEventService } from 'src/app/services/league-event.service';
import { LeagueEvent } from '../../models/league-event.model';

@UntilDestroy()
@Component({
  selector: 'glm-league-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './league-event-form.component.html',
  styleUrl: './league-event-form.component.scss'
})

export class LeagueEventFormComponent implements OnChanges {
  @Input() leagueId!: string;
  @Input() seasonId!: string;
  @Input() leagueEvent: LeagueEvent | null = null;

  courses = this.courseService.courses;
  roundHoleOptions = Object.values(RoundHoles);

  form: FormGroup;

  constructor(
    private courseService: CourseService,
    private leagueEventService: LeagueEventService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      courseId: ['', Validators.required],
      roundHoles: [RoundHoles.Front, Validators.required],
    });
  }

  ngOnInit() {
    this.courseService.getCourses()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leagueEvent'] && this.leagueEvent) {
      this.form.patchValue({
        name: this.leagueEvent.name,
        date: this.leagueEvent.date ? new Date(this.leagueEvent.date).toISOString().substring(0, 10) : '',
        courseId: this.leagueEvent.courseId,
        roundHoles: this.leagueEvent.roundHoles,
      });
    }
  }

  saveEvent() {
    if (this.form.invalid) return;
    const leagueEvent = this.form.value as LeagueEvent;
    leagueEvent.leagueSeasonId = this.seasonId;

    if (this.leagueEvent?.id) {
      this.leagueEventService.updateLeagueEvent(this.leagueId, this.seasonId, this.leagueEvent.id, leagueEvent);
    } else {
      this.leagueEventService.addLeagueEvent(this.leagueId, this.seasonId, leagueEvent);
    }
    this.form.reset();
    this.leagueEvent = null;
  }
}
