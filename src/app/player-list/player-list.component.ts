import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Player } from '../models/player.model';
import { ScoreService } from '../services/score-service';

@Component({
  selector: 'glm-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'handicap'];
  dataSource: Player[] = [];

  constructor(private scoreService: ScoreService) {
    this.scoreService.getPlayers()
      .pipe(map(players => players.sort((a, b) => a.lastName < b.lastName ? -1 : a.lastName > b.lastName ? 1 : a.firstName < b.firstName ? -1 : 0)))
      .subscribe(players => this.dataSource = players);
  }
}
