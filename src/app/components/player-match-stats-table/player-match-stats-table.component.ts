import { Component, computed, inject, input, signal } from '@angular/core';
import { PlayerMatchStats } from '../../models/player-match-stats.model';
import { AppStateService } from '../../services/app-state.service';

type PlayerMatchStatsColumnKey = keyof PlayerMatchStats;
type PlayerMatchStatsColumn = { key: PlayerMatchStatsColumnKey; label: string };

const ALL_COLUMNS: PlayerMatchStatsColumn[] = [
  { key: 'playerId', label: 'Player' },
  { key: 'handicap', label: 'Handicap' },
  { key: 'grossScore', label: 'Gross Score' },
  { key: 'netScore', label: 'Net Score' },
  { key: 'albatrosses', label: 'Albatrosses' },
  { key: 'eagles', label: 'Eagles' },
  { key: 'birdies', label: 'Birdies' },
  { key: 'pars', label: 'Pars' },
  { key: 'bogeys', label: 'Bogeys' },
  { key: 'doubleBogeys', label: 'Double Bogeys' },
  { key: 'others', label: 'Others' },
  { key: 'doublePars', label: 'Double Pars' },
  { key: 'fairwaysHit', label: 'Fairways Hit' },
  { key: 'grossPoints', label: 'Gross Points' },
  { key: 'netPoints', label: 'Net Points' },
  { key: 'result', label: 'Result' }
];

@Component({
  selector: 'app-player-match-stats-table',
  imports: [],
  templateUrl: './player-match-stats-table.component.html',
  styleUrl: './player-match-stats-table.component.scss',
})
export class PlayerMatchStatsTableComponent {
  readonly appStateService = inject(AppStateService);

  // TODO: remove this and get it from the appStatService
  playerMatchStats = input.required<PlayerMatchStats[]>();

  displayedColumns = input<PlayerMatchStatsColumnKey[]>([]);
  defaultSortColumn = input<keyof PlayerMatchStats>('netPoints');
  defaultSortDirection = input<'asc' | 'desc'>('desc');

  players = this.appStateService.playerMap();


  readonly columns = computed<PlayerMatchStatsColumn[]>(() => {
    const keys = this.displayedColumns();

    if (keys.length === 0) {
      return ALL_COLUMNS;
    }

    const columnMap = new Map(ALL_COLUMNS.map(column => [column.key, column]));
    return keys.map(key => columnMap.get(key)).filter(column => column !== undefined);
  });

  readonly activeSortKey = computed<PlayerMatchStatsColumnKey>(() => {
    const visibleColumns = this.columns();
    const currentSortKey = this.sortKey();

    return visibleColumns.some(column => column.key === currentSortKey)
      ? currentSortKey
      : (visibleColumns[0]?.key ?? currentSortKey);
  });

  readonly sortKey = signal<keyof PlayerMatchStats>(this.defaultSortColumn());
  readonly sortDirection = signal<'asc' | 'desc'>(this.defaultSortDirection());

  readonly sortedPlayerMatchStats = computed<PlayerMatchStats[]>(() => {
    const key = this.activeSortKey();
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

  getColumnValue(stats: PlayerMatchStats, key: PlayerMatchStatsColumnKey): string | number | Date | null {
    if (key === 'playerId') {
      const player = this.players[stats.playerId];
      return player ? `${player.firstName} ${player.lastName}` : '';
    }

    return stats[key];
  }
}
