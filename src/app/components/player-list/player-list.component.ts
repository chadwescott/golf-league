import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Player } from '../../models/player.model';
import { AppStateService } from '../../services/app-state.service';

type PlayerColumnKey = keyof Player;
type PlayerColumn = { key: PlayerColumnKey; label: string };

const ALL_COLUMNS: PlayerColumn[] = [
  // { key: 'imagePath', label: 'Image' },
  { key: 'id', label: 'Player' },
  { key: 'handicap', label: 'Handicap' },
  { key: 'rollingHandicap', label: 'Rolling Handicap' }
];

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  readonly appStateService = inject(AppStateService);

  displayedColumns = input<PlayerColumnKey[]>([]);
  defaultSortColumn = input<keyof Player>('id');
  defaultSortDirection = input<'asc' | 'desc'>('asc');

  readonly columns = computed<PlayerColumn[]>(() => {
    const keys = this.displayedColumns();

    if (keys.length === 0) {
      return ALL_COLUMNS;
    }

    const columnMap = new Map(ALL_COLUMNS.map(column => [column.key, column]));
    return keys.map(key => columnMap.get(key)).filter(column => column !== undefined);
  });

  readonly activeSortKey = computed<PlayerColumnKey>(() => {
    const visibleColumns = this.columns();
    const currentSortKey = this.sortKey();

    return visibleColumns.some(column => column.key === currentSortKey)
      ? currentSortKey
      : (visibleColumns[0]?.key ?? currentSortKey);
  });

  readonly sortKey = signal<keyof Player>(this.defaultSortColumn());
  readonly sortDirection = signal<'asc' | 'desc'>(this.defaultSortDirection());

  readonly sortedPlayer = computed<Player[]>(() => {
    const key = this.activeSortKey();
    const direction = this.sortDirection();
    const modifier = direction === 'asc' ? 1 : -1;

    return [...this.appStateService.leagueSeasonPlayers()].map(lsp => {
      const player = this.appStateService.playerMap()[lsp.playerId];
      return {
        id: lsp.playerId,
        handicap: lsp.handicap,
        rollingHandicap: lsp.rollingHandicap,
        imagePath: player?.imagePath ?? null
      } as Player;
    }).sort((a, b) => {
      let left: string | number | Date | null = a[key];
      let right: string | number | Date | null = b[key];

      if (key === 'id') {
        const playerA = this.appStateService.playerMap()[a[key]];
        const playerB = this.appStateService.playerMap()[b[key]];

        left = playerA ? `${playerA.lastName} ${playerA.firstName}` : '';
        right = playerB ? `${playerB.lastName} ${playerB.firstName}` : '';
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

  sortBy(key: keyof Player): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(current => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortKey.set(key);
    this.sortDirection.set('desc');
  }

  getSortIndicator(key: keyof Player): string {
    if (this.activeSortKey() !== key) {
      return '';
    }

    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  getColumnValue(player: Player, key: PlayerColumnKey): string | number | null {
    if (key === 'id') {
      const foundPlayer = this.appStateService.playerMap()[player.id];
      return foundPlayer ? `${foundPlayer.firstName} ${foundPlayer.lastName}` : '';
    }

    return player[key];
  }
}
