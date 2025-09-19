import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppStateService } from 'src/app/services/app-state.service';
import { Paths, RouteParams } from '../../app-routing.module';
import { LeaguePlayer } from '../../models/league-player.model';
import { Player } from '../../models/player.model';
import { Season } from '../../models/season.model';
import { LeagueService } from '../../services/league.service';
import { PlayerService } from '../../services/player.service';
import { PlayerFormComponent } from '../player-form/player-form.component';
import { PlayerTableComponent } from '../player-table/player-table.component';

@UntilDestroy()
@Component({
  selector: 'glm-league-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterLink,
    PlayerFormComponent,
    PlayerTableComponent
  ],
  templateUrl: './league-details.component.html',
  styleUrl: './league-details.component.scss',
})
export class LeagueDetailsComponent {
  paths = Paths;
  formGroup!: FormGroup;
  displayedColumns: string[] = ['year'];
  dataSource: Season[] = [];
  leagueId: string = '';
  players = signal<Player[]>([]);
  selectedPlayer: Player | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly leagueService: LeagueService,
    private readonly playerService: PlayerService,
    private readonly appStateService: AppStateService) {
    effect(() => {
      this.dataSource = this.leagueService.seasons();
      this.players = this.playerService.leaguePlayers;
    });
  }

  ngOnInit() {
    this.leagueId = this.route.snapshot.params[RouteParams.leagueId];

    this.leagueService.getLeague(this.leagueId).pipe(
      untilDestroyed(this)
    ).subscribe(league => {
      this.appStateService.setActiveLeague(league);
    });

    this.leagueService.getSeasons(this.leagueId)
      .pipe(untilDestroyed(this))
      .subscribe();

    this.playerService.getLeaguePlayers(this.leagueId)
      .pipe(untilDestroyed(this))
      .subscribe();

    this.initializeForm();
  }

  initializeForm() {
    const params: any = {
      year: new FormControl(new Date().getFullYear(), Validators.required)
    };

    this.formGroup = new FormGroup(params);
  }

  updateLeaguePlayer(player: Player) {
    this.players.update(prev => {
      const idx = prev.findIndex(p => p.id === player.id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = player;
      return this.playerService.sort(next);
    });
  }

  addLeaguePlayer(player: Player) {
    const leaguePlayer = { playerId: player.id } as LeaguePlayer;
    this.playerService.addLeaguePlayer(this.leagueId, leaguePlayer)
      .then(() => this.players.update(prev => this.playerService.sort([...prev, player])));
  }

  deleteLeaguePlayer(player: Player) {
    this.playerService.deleteLeaguePlayer(this.leagueId, player.id)
      .then(() => this.players.update(prev => this.playerService.sort(prev.filter(p => p.id !== player.id))));
  }

  addSeason() {
    const season = this.formGroup.value as Season;
    this.leagueService.addSeason(this.leagueId, season);
  }
}
