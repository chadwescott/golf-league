import { effect, inject, Injectable } from '@angular/core';


import { AppStateService } from './app-state.service';
import { MatchMatchupService } from './match-matchup.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
    private readonly matchMatchupService = inject(MatchMatchupService);
    private readonly playerService = inject(PlayerService);

    constructor() {
        this.playerService.getPlayers().subscribe(players => this.appStateService.players.set(players));

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
        });
    }
}