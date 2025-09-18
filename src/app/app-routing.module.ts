import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueDetailsComponent } from './components/league-details/league-details.component';
import { LeagueSeasonComponent } from './components/league-season/league-season.component';
import { LeagueSelectComponent } from './components/league-select/league-select.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { ScheduleManagerComponent } from './components/schedule-manager/schedule-manager.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScoreEntryComponent } from './components/score-entry/score-entry.component';
import { ScorecardComponent } from './components/scorecard/scorecard.component';

export const Paths = {
    leagues: 'leagues',
    leagueSeasons: 'league-seasons',
    players: 'players',
    schedules: 'schedules',
    scores: 'scores',
    scheduleManager: 'schedule-manager',
    scoreEntry: 'score-entry'
}

const routes: Routes = [
    { path: Paths.leagues, component: LeagueSelectComponent },
    { path: `${Paths.leagues}/:id`, component: LeagueDetailsComponent },
    { path: `${Paths.leagueSeasons}/:id`, component: LeagueSeasonComponent },
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
