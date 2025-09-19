import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeagueSeasonPlayer } from 'src/app/models/league-season-player.model';
import { LeagueSeason } from 'src/app/models/league-season.model';
import { AppStateService } from 'src/app/services/app-state.service';
import { Paths } from '../../app-routing.module';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { LeagueEventFormComponent } from '../league-event-form/league-event-form.component';
import { LeagueEventListComponent } from "../league-event-list/league-event-list.component";
import { PlayerTableComponent } from '../player-table/player-table.component';

@UntilDestroy()
@Component({
  selector: 'glm-league-season',
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
    ReactiveFormsModule,
    LeagueEventFormComponent,
    PlayerTableComponent,
    LeagueEventListComponent
  ],
  templateUrl: './league-season.component.html',
  styleUrl: './league-season.component.scss'
})
export class LeagueSeasonComponent {
  paths = Paths;
  formGroup!: FormGroup;
  displayedColumns: string[] = ['season'];
  dataSource: LeagueSeason[] = [];
  leagueSeasonId: string = '';
  leaguePlayers = computed(() => this.playerService.leaguePlayers().filter((lp) => !this.playerService.leagueSeasonPlayers().find(lyp => lyp.id === lp.id)));
  leagueSeasonPlayers = signal<Player[]>([]);

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
    this.leagueSeasonId = this.route.snapshot.params['id'];

    if (this.appStateService.activeLeague()?.id) {
      this.playerService.getLeaguePlayers(this.appStateService.activeLeague()!.id)
        .pipe(untilDestroyed(this))
        .subscribe();
    }

    this.playerService.getLeagueSeasonPlayers(this.leagueSeasonId)
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

    const leaguePlayer = { playerId: player.id, leagueSeasonId: this.leagueSeasonId } as LeagueSeasonPlayer;
    this.playerService.addLeagueSeasonPlayer(leaguePlayer).then(() => this.leagueSeasonPlayers.update(prev => [...prev, player]));
    this.selectedPlayer = null;
  }

  deleteLeagueSeasonPlayer(player: Player) {
    this.playerService.deleteLeagueSeasonPlayer(player).then(() => this.leagueSeasonPlayers.update(prev => prev.filter(p => p.id !== player.id)));
  }
}
