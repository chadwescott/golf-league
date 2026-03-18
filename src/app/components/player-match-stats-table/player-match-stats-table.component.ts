import { Component, computed, inject, input, signal } from '@angular/core';
import { MatchTypes } from '../../enums/match-types.enum';
import { PlayerMatchStats } from '../../models/player-match-stats.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-player-match-stats-table',
  imports: [],
  templateUrl: './player-match-stats-table.component.html',
  styleUrl: './player-match-stats-table.component.scss',
})
export class PlayerMatchStatsTableComponent {
  readonly appStateService = inject(AppStateService);

  playerMatchStats = input.required<PlayerMatchStats[]>();

  players = this.appStateService.playerMap();

  readonly columns = computed<{ key: keyof PlayerMatchStats; label: string }[]>(() => {
    const result: { key: keyof PlayerMatchStats; label: string }[] = [
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
      { key: 'netPoints', label: 'Net Points' }
    ];

    if (this.appStateService.selectedMatch()?.matchType === MatchTypes.StrokePlay) {
      result.push({ key: 'result', label: 'Result' });
    }

    return result;
  });

  readonly matchTypes = MatchTypes;
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
