import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player-list/player-list.component';

export const Paths = {
    leagues: 'leagues',
    seasons: 'seasons',
    players: 'players',
    schedules: 'schedules',
    scorecards: 'scorecards',
}

export const RouteParams = {
    leagueId: 'leagueId',
    scorecardId: 'scorecardId',
    seasonId: 'seasonId',
    eventId: 'eventId'
}

export const routes: Routes = [
    { path: '', redirectTo: Paths.players, pathMatch: 'full' },
    { path: Paths.players, component: PlayerListComponent },
];
