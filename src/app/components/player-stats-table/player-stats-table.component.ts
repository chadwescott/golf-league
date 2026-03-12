import { Component, computed, inject, input, signal } from '@angular/core';
import { PlayerStats } from '../../models/player-stats';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-stats-table',
  imports: [],
  templateUrl: './player-stats-table.component.html',
  styleUrl: './player-stats-table.component.scss',
})
export class PlayerStatsTableComponent {
  private readonly playerService = inject(PlayerService);

  playerStats = input.required<PlayerStats[]>();

  players: { [keyof: string]: Player } = {};

  readonly columns: { key: keyof PlayerStats; label: string }[] = [
    { key: 'playerId', label: 'Player' },
    { key: 'albatrosses', label: 'Albatrosses' },
    { key: 'eagles', label: 'Eagles' },
    { key: 'birdies', label: 'Birdies' },
    { key: 'pars', label: 'Pars' },
    { key: 'bogeys', label: 'Bogeys' },
    { key: 'doubleBogeys', label: 'Double Bogeys' },
    { key: 'others', label: 'Others' },
    { key: 'fairwaysHit', label: 'Fairways Hit' },
    { key: 'grossPoints', label: 'Gross Points' },
    { key: 'netPoints', label: 'Net Points' },
    { key: 'wins', label: 'Wins' },
    { key: 'losses', label: 'Losses' },
    { key: 'ties', label: 'Ties' }
  ];

  readonly sortKey = signal<keyof PlayerStats>('netPoints');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly sortedPlayerStats = computed<PlayerStats[]>(() => {
    const key = this.sortKey();
    const direction = this.sortDirection();
    const modifier = direction === 'asc' ? 1 : -1;

    return [...this.playerStats()].sort((a, b) => {
      let left: string | number | Date | null = a[key];
      let right: string | number | Date | null = b[key];

      if (key === 'playerId') {
        left = this.players[a[key]] ? `${this.players[a[key]].lastName} ${this.players[a[key]].firstName}` : '';
        right = this.players[b[key]] ? `${this.players[b[key]].lastName} ${this.players[b[key]].firstName}` : '';
      }

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * modifier;
      }

      return String(left).localeCompare(String(right)) * modifier;
    });
  });

  ngOnInit() {
    this.playerService.getPlayers().subscribe(players => {
      players.forEach(player => {
        this.players[player.id] = player;
      });
    });
  }

  sortBy(key: keyof PlayerStats): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(current => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortKey.set(key);
    this.sortDirection.set('asc');
  }

  getSortIndicator(key: keyof PlayerStats): string {
    if (this.sortKey() !== key) {
      return '';
    }

    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
