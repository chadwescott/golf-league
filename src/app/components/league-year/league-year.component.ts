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
import { AppStateService } from 'src/app/services/app-state.service';
import { Paths } from '../../app-routing.module';
import { LeagueYearPlayer } from '../../models/league-year-player.model';
import { LeagueYear } from '../../models/league-year.model';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { PlayerTableComponent } from '../player-table/player-table.component';

@UntilDestroy()
@Component({
  selector: 'glm-league-year',
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
    PlayerTableComponent],
  templateUrl: './league-year.component.html',
  styleUrl: './league-year.component.scss'
})
export class LeagueYearComponent {
  paths = Paths;
  formGroup!: FormGroup;
  displayedColumns: string[] = ['year'];
  dataSource: LeagueYear[] = [];
  leagueYearId: string = '';
  leaguePlayers = computed(() => this.playerService.leaguePlayers().filter((lp) => !this.playerService.leagueYearPlayers().find(lyp => lyp.id === lp.id)));
  leagueYearPlayers = signal<Player[]>([]);

  selectedPlayer: Player | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly playerService: PlayerService,
    private appStateService: AppStateService) {

    effect(() => {
      this.leagueYearPlayers = this.playerService.leagueYearPlayers;
    });
  }

  ngOnInit() {
    this.leagueYearId = this.route.snapshot.params['id'];

    if (this.appStateService.activeLeague()?.id) {
      this.playerService.getLeaguePlayers(this.appStateService.activeLeague()!.id)
        .pipe(untilDestroyed(this))
        .subscribe();
    }

    this.playerService.getLeagueYearPlayers(this.leagueYearId)
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

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
  }

  addLeagueYearPlayer(player: Player | null) {
    if (!player) { return; }

    const leaguePlayer = { playerId: player.id, leagueYearId: this.leagueYearId } as LeagueYearPlayer;
    this.playerService.addLeagueYearPlayer(leaguePlayer).then(() => this.leagueYearPlayers.update(prev => [...prev, player]));
    this.selectedPlayer = null;
  }

  deleteLeagueYearPlayer(player: Player) {
    this.playerService.deleteLeagueYearPlayer(player).then(() => this.leagueYearPlayers.update(prev => prev.filter(p => p.id !== player.id)));
  }
}
