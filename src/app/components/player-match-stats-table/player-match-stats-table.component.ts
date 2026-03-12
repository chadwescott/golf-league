import { Component, computed, inject, input, signal } from '@angular/core';
import { PlayerMatchStats } from '../../models/player-match-stats.model';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-match-stats-table',
  imports: [],
  templateUrl: './player-match-stats-table.component.html',
  styleUrl: './player-match-stats-table.component.scss',
})
export class PlayerMatchStatsTableComponent {
  private readonly playerService = inject(PlayerService);

  playerMatchStats = input.required<PlayerMatchStats[]>();

  players: { [keyof: string]: Player } = {};

  readonly columns: { key: keyof PlayerMatchStats; label: string }[] = [
    { key: 'playerId', label: 'Player' },
    { key: 'grossScore', label: 'Gross Score' },
    { key: 'netScore', label: 'Net Score' },
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
    { key: 'result', label: 'Result' }
  ];

  readonly sortKey = signal<keyof PlayerMatchStats>('netPoints');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly sortedPlayerMatchStats = computed<PlayerMatchStats[]>(() => {
    const key = this.sortKey();
    const direction = this.sortDirection();
    const modifier = direction === 'asc' ? 1 : -1;

    return [...this.playerMatchStats()].sort((a, b) => {
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

  sortBy(key: keyof PlayerMatchStats): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(current => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortKey.set(key);
    this.sortDirection.set('asc');
  }

  getSortIndicator(key: keyof PlayerMatchStats): string {
    if (this.sortKey() !== key) {
      return '';
    }

    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
