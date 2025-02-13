import { Component } from '@angular/core';
import { Players } from '../data/players';
import { Player } from '../models/player.model';

@Component({
  selector: 'glm-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'handicap'];
  dataSource: Player[] = Players;
}
