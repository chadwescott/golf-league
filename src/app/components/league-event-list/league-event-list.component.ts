import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { LeagueEvent } from '../../models/league-event.model';
import { LeagueEventService } from '../../services/league-event.service';

@Component({
  selector: 'glm-league-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './league-event-list.component.html',
  styleUrl: './league-event-list.component.scss'
})
export class LeagueEventListComponent implements OnInit {
  @Input() leagueSeasonId!: string;
  @Output() eventSelected = new EventEmitter<LeagueEvent>();

  events = signal<LeagueEvent[]>([]);
  displayedColumns: string[] = ['name', 'date'];

  constructor(private leagueEventService: LeagueEventService) { }

  ngOnInit() {
    if (this.leagueSeasonId) {
      this.leagueEventService.getLeagueEvents(this.leagueSeasonId).subscribe(events => {
        this.events = this.leagueEventService.leagueEvents;
      });
    }
  }

  selectEvent(event: LeagueEvent) {
    this.eventSelected.emit(event);
  }
}
