import { effect, inject, Injectable } from '@angular/core';


import { PlayerStats } from '../models/player-stats';
import { AppStateService } from './app-state.service';
import { MatchMatchupService } from './match-matchup.service';
import { MatchService } from './match.service';
import { PlayerScoresService } from './player-score.service';
import { PlayerService } from './player.service';
import { ScorecardService } from './scorecard.service';
import { SeasonService } from './season.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
    private readonly seasonService = inject(SeasonService);
    private readonly matchService = inject(MatchService);
    private readonly scorecardService = inject(ScorecardService);
    private readonly matchMatchupService = inject(MatchMatchupService);
    private readonly playerService = inject(PlayerService);
    private readonly playerScoresService = inject(PlayerScoresService);

    constructor() {
        this.playerService.getPlayers().subscribe(players => this.appStateService.players.set(players));

        effect(() => {
            const leagueId = this.appStateService.selectedLeague()?.id;
            const seasonId = this.appStateService.selectedSeason()?.id;

            if (!leagueId || !seasonId) {
                this.appStateService.playerStats.set([]);
                this.appStateService.seasonMatches.set([]);
                return;
            }

            this.seasonService.getPlayerStatsBySeasonId(leagueId, seasonId).subscribe(playerStats => {
                this.appStateService.playerStats.set(playerStats);
            });

            this.matchService.getMatchesByLeagueIdAndSeasonId(leagueId, seasonId).subscribe(le => this.appStateService.seasonMatches.set(le));
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
            const league = this.appStateService.selectedLeague();
            const season = this.appStateService.selectedSeason();
            const match = this.appStateService.selectedMatch();

            if (!league || !season || !match) {
                this.appStateService.matchMatchups.set([]);
                this.appStateService.playerMatchStats.set([]);
                this.appStateService.selectedScorecard.set(null);
                return;
            }

            this.matchMatchupService.getMatchupsByMatchId(league!.id, season!.id, match.id)
                .subscribe(matchMatchups => {
                    matchMatchups.forEach(m => m.teams.sort((a, b) => a.result && b.result ? b.result?.localeCompare(a.result) : 0));
                    this.appStateService.matchMatchups.set(matchMatchups);
                });

            this.matchService.getPlayerStatsByMatchId(league!.id, season!.id, match.id).subscribe(playerStats => {
                this.appStateService.playerMatchStats.set(playerStats);
            });

            this.scorecardService.getScorecardById(match.scorecardId).subscribe(scorecard => {
                this.appStateService.selectedScorecard.set(scorecard);
            });
        });

        effect(() => {
            const scorecard = this.appStateService.selectedScorecard();
            if (!scorecard) {
                this.appStateService.playerScores.set([]);
                return;
            }

            this.playerScoresService.getPlayerScoresByScorecardId(scorecard.id).subscribe(playerScores => {
                this.appStateService.playerScores.set(playerScores);
            });
        });
    }
}