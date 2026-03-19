import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { PlayerStats } from '../../models/player-stats';
import { AppStateService } from '../../services/app-state.service';

type PlayerStatsColumnKey = keyof PlayerStats;
type PlayerStatsColumn = { key: PlayerStatsColumnKey; label: string };

const ALL_COLUMNS: PlayerStatsColumn[] = [
  { key: 'playerId', label: 'Player' },
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
  { key: 'grossSkins', label: 'Gross Skins' },
  { key: 'netSkins', label: 'Net Skins' },
  { key: 'grossSkinAmount', label: 'Gross Skin Winnings' },
  { key: 'netSkinAmount', label: 'Net Skin Winnings' },
  { key: 'wins', label: 'Wins' },
  { key: 'losses', label: 'Losses' },
  { key: 'ties', label: 'Ties' }
];

@Component({
  selector: 'app-player-stats-table',
  imports: [CurrencyPipe],
  templateUrl: './player-stats-table.component.html',
  styleUrl: './player-stats-table.component.scss',
})
export class PlayerStatsTableComponent {
  readonly appService = inject(AppStateService);

  displayedColumns = input<PlayerStatsColumnKey[]>([]);
  defaultSortColumn = input<keyof PlayerStats>('netPoints');
  defaultSortDirection = input<'asc' | 'desc'>('desc');

  players = this.appService.playerMap();

  readonly columns = computed<PlayerStatsColumn[]>(() => {
    const keys = this.displayedColumns();

    if (keys.length === 0) {
      return ALL_COLUMNS;
    }

    const columnMap = new Map(ALL_COLUMNS.map(column => [column.key, column]));
    return keys.map(key => columnMap.get(key)).filter(column => column !== undefined);
  });

  readonly activeSortKey = computed<PlayerStatsColumnKey>(() => {
    const visibleColumns = this.columns();
    const currentSortKey = this.sortKey();

    return visibleColumns.some(column => column.key === currentSortKey)
      ? currentSortKey
      : (visibleColumns[0]?.key ?? currentSortKey);
  });

  readonly sortKey = signal<keyof PlayerStats>(this.defaultSortColumn());
  readonly sortDirection = signal<'asc' | 'desc'>(this.defaultSortDirection());

  readonly sortedPlayerStats = computed<PlayerStats[]>(() => {
    const key = this.activeSortKey();
    const direction = this.sortDirection();
    const modifier = direction === 'asc' ? 1 : -1;

    return [...this.appService.playerSeasonStats()].sort((a, b) => {
      let left: string | number | Date | null = a[key];
      let right: string | number | Date | null = b[key];

      const playerA = this.players[a[key]];
      const playerB = this.players[b[key]];

      if (key === 'playerId') {
        left = playerA ? `${playerA.lastName} ${playerA.firstName}` : '';
        right = playerB ? `${playerB.lastName} ${playerB.firstName}` : '';
      }

      if (key === 'wins') {
        const winsDiff = a.wins - b.wins;
        if (winsDiff !== 0) {
          return modifier * winsDiff;
        }

        const lossesDiff = b.losses - a.losses;
        return modifier * lossesDiff;
      }

      if (key === 'losses') {
        const lossesDiff = a.losses - b.losses;
        if (lossesDiff !== 0) {
          return modifier * lossesDiff;
        }

        const winsDiff = b.wins - a.wins;
        return modifier * -winsDiff;
      }

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * modifier;
      }

      return String(left).localeCompare(String(right)) * modifier;
    });
  });

  constructor() {
    effect(() => {
      this.sortKey.set(this.defaultSortColumn());
      this.sortDirection.set(this.defaultSortDirection());
    });
  }

  sortBy(key: keyof PlayerStats): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(current => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortKey.set(key);
    this.sortDirection.set('desc');
  }

  getSortIndicator(key: keyof PlayerStats): string {
    if (this.activeSortKey() !== key) {
      return '';
    }

    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  getColumnValue(stats: PlayerStats, key: PlayerStatsColumnKey): string | number {
    if (key === 'playerId') {
      const player = this.players[stats.playerId];
      return player ? `${player.firstName} ${player.lastName}` : '';
    }

    return stats[key];
  }
}
