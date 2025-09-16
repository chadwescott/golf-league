import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueDetailsComponent } from './league-details/league-details.component';
import { LeagueSelectComponent } from './league-select/league-select.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { ScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScoreEntryComponent } from './score-entry/score-entry.component';
import { ScorecardComponent } from './scorecard/scorecard.component';

export const Paths = {
    leagues: 'leagues',
    leagueDetails: 'leagues/:id',
    players: 'players',
    schedules: 'schedules',
    scores: 'scores',
    scheduleManager: 'schedule-manager',
    scoreEntry: 'score-entry'
}

const routes: Routes = [
    { path: Paths.leagues, component: LeagueSelectComponent },
    { path: `${Paths.leagues}/:id`, component: LeagueDetailsComponent },
    { path: Paths.players, component: PlayerListComponent },
    { path: Paths.schedules, component: ScheduleComponent },
    { path: Paths.scores, component: ScorecardComponent },
    { path: Paths.scheduleManager, component: ScheduleManagerComponent },
    { path: Paths.scoreEntry, component: ScoreEntryComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor() { }
}
