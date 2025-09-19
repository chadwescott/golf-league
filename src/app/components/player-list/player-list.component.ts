import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { PlayerTableComponent } from "../player-table/player-table.component";

@UntilDestroy()
@Component({
  selector: 'glm-player-list',
  standalone: true,
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  imports: [
    CommonModule,
    PlayerTableComponent
  ]
})
export class PlayerListComponent {
  players = signal<Player[]>([]);

  constructor(private playerService: PlayerService) {
    this.players = this.playerService.players;
  }

  ngOnInit() {
    this.playerService.getPlayers()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  deletePlayer(player: Player) {
    this.playerService.deletePlayer(player.id)
      .then(() => this.players.update(prev => prev.filter(p => p.id !== player.id)));
  }
}
