import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeagueEvent } from 'src/app/models/league-event.model';
import { SeasonPlayer } from 'src/app/models/season-player.model';
import { Season } from 'src/app/models/season.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { Paths, RouteParams } from '../../app-routing.module';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { LeagueEventFormComponent } from '../league-event-form/league-event-form.component';
import { LeagueEventListComponent } from "../league-event-list/league-event-list.component";
import { LeagueEventMatchupsComponent } from '../league-event-matchups/league-event-matchups.component';
import { PlayerTableComponent } from '../player-table/player-table.component';

@UntilDestroy()
@Component({
  selector: 'glm-season',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    ReactiveFormsModule,
    LeagueEventFormComponent,
    PlayerTableComponent,
    LeagueEventListComponent,
    LeagueEventMatchupsComponent
  ],
  templateUrl: './season.component.html',
  styleUrl: './season.component.scss'
})
export class SeasonComponent {
  paths = Paths;
  formGroup!: FormGroup;
  displayedColumns: string[] = ['season'];
  dataSource: Season[] = [];
  leagueId: string = '';
  seasonId: string = '';
  leaguePlayers = computed(() => this.playerService.leaguePlayers().filter((lp) => !this.playerService.leagueSeasonPlayers().find(lyp => lyp.id === lp.id)));
  leagueSeasonPlayers = signal<Player[]>([]);
  selectedEvent: LeagueEvent | null = null;

  selectedPlayer: Player | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly playerService: PlayerService,
    private appStateService: AppStateService) {

    effect(() => {
      this.leagueSeasonPlayers = this.playerService.leagueSeasonPlayers;
    });
  }

  ngOnInit() {
    this.leagueId = this.route.snapshot.params[RouteParams.leagueId];
    this.seasonId = this.route.snapshot.params[RouteParams.seasonId];

    if (this.appStateService.activeLeague()?.id) {
      this.playerService.getLeaguePlayers(this.appStateService.activeLeague()!.id)
        .pipe(untilDestroyed(this))
        .subscribe();
    }

    this.playerService.getLeagueSeasonPlayers(this.leagueId, this.seasonId)
      .pipe(untilDestroyed(this))
      .subscribe();

    this.initializeForm();
  }

  initializeForm() {
    const params: any = {
      season: new FormControl(new Date().getFullYear(), Validators.required)
    };

    this.formGroup = new FormGroup(params);
  }

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
  }

  addLeagueSeasonPlayer(player: Player | null) {
    if (!player) { return; }

    const seasonPlayer = { playerId: player.id, } as SeasonPlayer;
    this.playerService.addLeagueSeasonPlayer(this.leagueId, this.seasonId, seasonPlayer)
      .then(() => this.leagueSeasonPlayers.update(prev => [...prev, player]));
    this.selectedPlayer = null;
  }

  deleteLeagueSeasonPlayer(player: Player) {
    this.playerService.deleteLeagueSeasonPlayer(this.leagueId, this.seasonId, player.id)
      .then(() => this.leagueSeasonPlayers.update(prev => prev.filter(p => p.id !== player.id)));
  }

  onEventSelected(event: LeagueEvent) {
    this.selectedEvent = event;
  }
}
