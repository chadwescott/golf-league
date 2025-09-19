import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { EventMatchup } from 'src/app/models/event-matchup.model';

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
export class LeagueEventMatchupListComponent {
    matchups = input.required<EventMatchup[]>();

    constructor() { }
}