import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerListComponent } from './player-list/player-list.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScoresComponent } from './scores/scores.component';

const routes: Routes = [
    { path: 'players', component: PlayerListComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'scores', component: ScoresComponent },
    //   { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor() { }
}
