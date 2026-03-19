import { computed, effect, Injectable, signal } from '@angular/core';
import { League } from '../models/league.model';
import { MatchMatchup } from '../models/match-matchup.model';
import { Match } from '../models/match.model';
import { PlayerMatchStats } from '../models/player-match-stats.model';
import { PlayerStats } from '../models/player-stats';
import { Player } from '../models/player.model';
import { Season } from '../models/season.model';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    players = signal<Player[]>([]);
    playerMap = computed<Record<string, Player>>(() => {
        const map: Record<string, Player> = {};

        this.players().forEach(player => {
            map[player.id] = player;
        });
        return map;
    });

    selectedLeague = signal<League | null>(null);
    selectedSeason = signal<Season | null>(null);
    selectedMatch = signal<Match | null>(null);
    seasonMatches = signal<Match[]>([]);
    playerStats = signal<PlayerStats[]>([]);
    playerMatchStats = signal<PlayerMatchStats[]>([]);
    playerSeasonStats = signal<PlayerStats[]>([]);
    cumulativeMatchPlayerStats = signal<PlayerStats[]>([]);
    matchMatchups = signal<MatchMatchup[]>([]);

    private readonly selectedLeagueKey = 'selectedLeague';
    private readonly selectedSeasonKey = 'selectedSeason';

    constructor() {
        effect(() => {
            const selectedLeague = this.selectedLeague();
            this.saveOrDeleteDataInStorage(this.selectedLeagueKey, selectedLeague);
        });

        effect(() => {
            const selectedSeason = this.selectedSeason();
            this.saveOrDeleteDataInStorage(this.selectedSeasonKey, selectedSeason);
        });

        effect(() => {
            const selectedMatch = this.selectedMatch();
        });

        const storedLeague = this.loadDataFromStorage<League>(this.selectedLeagueKey);
        if (storedLeague) {
            this.selectedLeague.set(storedLeague);
        }

        const storedSeason = this.loadDataFromStorage<Season>(this.selectedSeasonKey);
        if (storedSeason) {
            this.selectedSeason.set(storedSeason);
        }
    }

    loadDataFromStorage<T>(key: string): T | null {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) as T : null;
    }

    saveDataToStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private saveOrDeleteDataInStorage<T>(key: string, data: T | null): void {
        if (data) {
            this.saveDataToStorage(key, data);
        } else {
            localStorage.removeItem(key);
        }
    }
}