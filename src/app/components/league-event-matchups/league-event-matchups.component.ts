import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventMatchup } from 'src/app/models/event-matchup.model';
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
export class LeagueEventMatchupsComponent implements OnChanges {
  @Input()
  leagueEvent!: LeagueEvent;

  leagueId: string = '';
  seasonId: string = '';
  matchups = this._leagueEventService.matchups;

  allPlayers = this._playerService.leagueSeasonPlayers;
  players = computed(() => {
    const matchups = this.matchups();
    const teamPlayerIds = matchups?.flat().map(m => m.teams.flat()).flat().map(t => t.playerIds).flat() ?? [];
    return this.allPlayers().filter(p => !teamPlayerIds.includes(p.id));
  });

  player1Options = computed(() => this.players().filter(p => p.id !== this.player2()?.id));
  player2Options = computed(() => this.players().filter(p => p.id !== this.player1()?.id));

  player1 = signal<Player | null>(null);
  player2 = signal<Player | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _leagueEventService: LeagueEventService,
    private readonly _playerService: PlayerService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leagueEvent'] && this.leagueEvent) {
      this.leagueId = this.route.snapshot.params['leagueId'];
      this.seasonId = this.route.snapshot.params['seasonId'];

      this._leagueEventService.getLeagueEventMatchups(
        this.leagueId,
        this.seasonId,
        this.leagueEvent.id
      )
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }

  addMatchup(): void {
    const teams = [
      { playerIds: [this.player1()?.id ?? ''], handicap: this.player1()?.handicap ?? 0 } as Team
    ] as Team[];
    if (this.player2()) {
      teams.push({ playerIds: [this.player2()?.id ?? ''], handicap: this.player2()?.handicap ?? 0 } as Team);
    }

    this._leagueEventService.addLeagueEventMatchup(this.leagueId, this.seasonId, this.leagueEvent.id, {
      teams: teams
    } as EventMatchup);
    this.player1.set(null);
    this.player2.set(null);
  }

  editScorecard(matchup: EventMatchup): void {
  }

  deleteMatchup(matchup: EventMatchup): void {
    this._leagueEventService.deleteLeagueEventMatchup(this.leagueId, this.seasonId, this.leagueEvent.id, matchup.id!);
  }
}
