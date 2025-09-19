import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { LeagueEventService } from '../../services/league-event.service';

@Component({
    selector: 'glm-league-event-matchup-list',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule
    ],
    templateUrl: './league-event-matchup-list.component.html',
    styleUrl: './league-event-matchup-list.component.scss'
})
export class LeagueEventMatchupListComponent implements OnInit {
    @Input() leagueEventId!: string;

    matchups = signal<any[]>([]);

    constructor(private leagueEventService: LeagueEventService) { }

    ngOnInit() {
        if (this.leagueEventId) {
            this.leagueEventService.getLeagueEventMatchups(this.leagueEventId).subscribe(matchups => {
                console.log(matchups);
                this.matchups.set(matchups);
            });
        }
    }
}