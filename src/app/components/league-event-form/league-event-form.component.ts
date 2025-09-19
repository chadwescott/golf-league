import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
export class LeagueEventFormComponent {
  @Input() leagueSeasonId!: string;
  @Input() event: LeagueEvent | null = null;

  form: FormGroup;

  constructor(
    private leagueEventService: LeagueEventService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.event) {
      this.form.patchValue({
        name: this.event.name,
        date: this.event.date ? new Date(this.event.date).toISOString().substring(0, 10) : ''
      });
    }
  }

  saveEvent() {
    if (this.form.invalid) return;
    const leagueEvent = this.form.value as LeagueEvent;
    leagueEvent.leagueSeasonId = this.leagueSeasonId;

    if (this.event?.id) {
      this.leagueEventService.updateLeagueEvent(this.event.id, leagueEvent);
    } else {
      this.leagueEventService.addLeagueEvent(leagueEvent);
    }
    this.form.reset();
  }
}
