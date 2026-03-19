import { effect, inject, Injectable } from '@angular/core';


import { PlayerStats } from '../models/player-stats';
import { AppStateService } from './app-state.service';
import { MatchMatchupService } from './match-matchup.service';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';
import { SeasonService } from './season.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
    private readonly seasonService = inject(SeasonService);
    private readonly matchService = inject(MatchService);
    private readonly matchMatchupService = inject(MatchMatchupService);
    private readonly playerService = inject(PlayerService);

    constructor() {
        this.playerService.getPlayers().subscribe(players => this.appStateService.players.set(players));

        effect(() => {
            const leagueId = this.appStateService.selectedLeague()?.id;
            const seasonId = this.appStateService.selectedSeason()?.id;

            if (!leagueId || !seasonId) {
                this.appStateService.playerStats.set([]);
                return;
            }

            this.seasonService.getPlayerStatsBySeasonId(leagueId, seasonId).subscribe(playerStats => {
                this.appStateService.playerStats.set(playerStats);
            });

            this.matchService.getMatchesByLeagueIdAndSeasonId(leagueId!, seasonId!).subscribe(le => this.appStateService.seasonMatches.set(le));
        });

        effect(() => {
            const playerStats = this.appStateService.playerStats();
            const selectedMatch = this.appStateService.selectedMatch() ?? this.appStateService.seasonMatches().reduce((latest, match) =>
                new Date(match.date) > new Date(latest.date) ? match : latest, this.appStateService.seasonMatches()[0]);

            if (playerStats.length === 0 || !selectedMatch) {
                this.appStateService.playerSeasonStats.set([]);
                return;
            }

            const results: PlayerStats[] = [];
            const playerIds = [...new Set(playerStats.map(ps => ps.playerId))];

            playerIds.forEach(playerId => {
                const playerStatsForPlayer = playerStats.filter(ps => ps.playerId === playerId && ps.leagueEventId === selectedMatch.id);
                if (playerStatsForPlayer.length > 0) {
                    results.push(playerStatsForPlayer[0]);
                }
            });

            this.appStateService.playerSeasonStats.set(results);
        });

        effect(() => {
            const match = this.appStateService.selectedMatch();

            if (!match) {
                this.appStateService.matchMatchups.set([]);
                return;
            }

            this.matchMatchupService.getMatchupsByMatchId(this.appStateService.selectedLeague()!.id, this.appStateService.selectedSeason()!.id, match.id)
                .subscribe(matchMatchups => {
                    matchMatchups.forEach(m => m.teams.sort((a, b) => a.result && b.result ? b.result?.localeCompare(a.result) : 0));
                    this.appStateService.matchMatchups.set(matchMatchups);
                });

            this.matchService.getPlayerStatsByMatchId(this.appStateService.selectedLeague()!.id, this.appStateService.selectedSeason()!.id, match.id).subscribe(playerStats => {
                this.appStateService.playerMatchStats.set(playerStats);
            });
        });
    }
}