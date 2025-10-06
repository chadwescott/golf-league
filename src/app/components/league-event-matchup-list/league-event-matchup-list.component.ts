import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { EventMatchup } from 'src/app/models/event-matchup.model';
import { Player } from 'src/app/models/player.model';

@Component({
    selector: 'glm-league-event-matchup-list',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatListModule
    ],
    templateUrl: './league-event-matchup-list.component.html',
    styleUrl: './league-event-matchup-list.component.scss'
})
export class LeagueEventMatchupListComponent {
    @Output()
    deleteMatchup = new EventEmitter<EventMatchup>();

    matchups = input.required<EventMatchup[]>();
    players = input.required<Player[]>();

    constructor() { }

    findPlayer(id: string): Player | null {
        return this.players().find(p => p.id === id) || null;
    }
}