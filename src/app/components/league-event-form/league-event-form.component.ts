import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LeagueEventService } from 'src/app/services/league-event.service';
import { LeagueEvent } from '../../models/league-event.model';

@Component({
  selector: 'glm-league-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './league-event-form.component.html',
  styleUrl: './league-event-form.component.scss'
})
export class LeagueEventFormComponent implements OnChanges {
  @Input() leagueId!: string;
  @Input() seasonId!: string;
  @Input() leagueEvent: LeagueEvent | null = null;

  form: FormGroup;

  constructor(
    private leagueEventService: LeagueEventService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leagueEvent'] && this.leagueEvent) {
      this.form.patchValue({
        name: this.leagueEvent.name,
        date: this.leagueEvent.date ? new Date(this.leagueEvent.date).toISOString().substring(0, 10) : ''
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
  }
}
