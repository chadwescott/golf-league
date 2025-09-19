import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeagueEventMatchup } from 'src/app/models/league-event-matchup.model';
import { LeagueEvent } from 'src/app/models/league-event.model';
import { Player } from 'src/app/models/player.model';
import { Team } from 'src/app/models/team.model';
import { LeagueEventService } from 'src/app/services/league-event.service';
import { PlayerService } from 'src/app/services/player.service';
import { LeagueEventMatchupListComponent } from "../league-event-matchup-list/league-event-matchup-list.component";

@UntilDestroy()
@Component({
  selector: 'glm-league-event-matchups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    LeagueEventMatchupListComponent
  ],
  templateUrl: './league-event-matchups.component.html',
  styleUrl: './league-event-matchups.component.scss'
})
export class LeagueEventMatchupsComponent {
  @Input()
  leagueEvent!: LeagueEvent;

  leagueEventMatchups = this._leagueEventService.leagueEventMatchups;

  allPlayers = this._playerService.leagueSeasonPlayers()
  players = computed(() => {
    const matchups = this.leagueEventMatchups();
    const teamPlayerIds = matchups?.flat().map(m => m.teams.flat()).flat().map(t => t.playerIds).flat() ?? [];
    return this.allPlayers.filter(p => !teamPlayerIds.includes(p.id));
  });

  player1Options = computed(() => this.players().filter(p => p.id !== this.player2()?.id));
  player2Options = computed(() => this.players().filter(p => p.id !== this.player1()?.id));

  player1 = signal<Player | null>(null);
  player2 = signal<Player | null>(null);

  constructor(
    private readonly _leagueEventService: LeagueEventService,
    private readonly _playerService: PlayerService) {
  }

  ngOnInit() {
    this._leagueEventService.getLeagueEventMatchups(this.leagueEvent.id)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  addMatchup(): void {
    this._leagueEventService.addLeagueEventMatchup(this.leagueEvent.id, {
      teams: [
        { playerIds: [this.player1()?.id ?? ''] } as Team,
        { playerIds: [this.player2()?.id ?? ''] } as Team,
      ]
    } as LeagueEventMatchup);
    this.player1.set(null);
    this.player2.set(null);
  }
}
