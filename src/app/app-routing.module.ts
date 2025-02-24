import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerListComponent } from './player-list/player-list.component';
import { ScheduleManagerComponent } from './schedule-manager/schedule-manager.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScoreEntryComponent } from './score-entry/score-entry.component';
import { ScorecardComponent } from './scorecard/scorecard.component';

const routes: Routes = [
    { path: 'players', component: PlayerListComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'scores', component: ScorecardComponent },
    { path: 'schedule-manager', component: ScheduleManagerComponent },
    { path: 'score-entry', component: ScoreEntryComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor() { }
}
