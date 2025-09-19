import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { EventMatchup } from 'src/app/models/event-matchup.model';
import { Player } from 'src/app/models/player.model';

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
    players = input.required<Player[]>();

    constructor() { }

    findPlayer(id: string): Player | null {
        return this.players().find(p => p.id === id) || null;
    }
}