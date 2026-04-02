import { computed, effect, Injectable, signal } from '@angular/core';
import { Course } from '../models/course.model';
import { League } from '../models/league.model';
import { MatchMatchup } from '../models/match-matchup.model';
import { Match } from '../models/match.model';
import { PlayerMatchStats } from '../models/player-match-stats.model';
import { PlayerScores } from '../models/player-scores.model';
import { PlayerStats } from '../models/player-stats';
import { Player } from '../models/player.model';
import { Scorecard } from '../models/scorecard.model';
import { SeasonPlayer } from '../models/season-player.model';
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
    selectedScorecard = signal<Scorecard | null>(null);
    selectedCourse = signal<Course | null>(null);
    leagueSeasons = signal<Season[]>([]);
    leagueSeasonPlayers = signal<SeasonPlayer[]>([]);
    playerScores = signal<PlayerScores[]>([]);
    seasonMatches = signal<Match[]>([]);
    playerStats = signal<PlayerStats[]>([]);
    playerMatchStats = signal<PlayerMatchStats[]>([]);
    playerSeasonStats = signal<PlayerStats[]>([]);
    cumulativeMatchPlayerStats = signal<PlayerStats[]>([]);
    matchMatchups = signal<MatchMatchup[]>([]);

    private readonly selectedLeagueKey = 'gl:selectedLeague';
    private readonly selectedSeasonKey = 'gl:selectedSeason';
    private readonly selectedMatchKey = 'gl:selectedMatch';
    private readonly leagueSeasonPlayersKey = 'gl:leagueSeasonPlayers';

    constructor() {
        console.log('AppStateService initialized');
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
            this.saveOrDeleteDataInStorage(this.selectedMatchKey, selectedMatch);
        });

        effect(() => {
            const leagueSeasonPlayers = this.leagueSeasonPlayers();
            this.saveOrDeleteDataInStorage(this.leagueSeasonPlayersKey, leagueSeasonPlayers);
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