import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
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

  events = signal<LeagueEvent[]>([]);
  displayedColumns: string[] = ['name', 'date'];

  constructor(private leagueEventService: LeagueEventService) { }

  ngOnInit() {
    if (this.leagueSeasonId) {
      this.leagueEventService.getLeagueEvents(this.leagueSeasonId).subscribe(events => {
        this.events.set(events);
      });
    }
  }
}
