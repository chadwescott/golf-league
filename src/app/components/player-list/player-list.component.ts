import { Component, inject } from '@angular/core';
import { Player } from '../../models/player.model';
import { LeagueService } from '../../services/league.service';
import { PlayerService } from '../../services/player.service';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  players: Player[] = [];

  private readonly playerService = inject(PlayerService);
  private readonly leagueService = inject(LeagueService);
  private readonly seasonService = inject(SeasonService);

  ngOnInit(): void {
    this.leagueService.getLeagues().subscribe(leagues => console.log(leagues));
    this.playerService.getPlayers().subscribe(players => this.players = players);
    this.playerService.getLeaguePlayers('6UKtn7PjqEC2cqWaavI1').subscribe(players => console.log(players));
    this.playerService.getLeagueSeasonPlayers('6UKtn7PjqEC2cqWaavI1', 'q4iVsYgMITiVpeKrxDsX').subscribe(players => console.log(players));
    this.seasonService.getLeagueSeasons('6UKtn7PjqEC2cqWaavI1').subscribe(seasons => console.log(seasons));
  }
}
