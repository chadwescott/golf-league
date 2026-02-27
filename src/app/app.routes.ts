import { Routes } from '@angular/router';
import { LeagueDashboardComponent } from './components/league-dashboard/league-dashboard.component';
import { LeagueListComponent } from './components/league-list/league-list.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { SeasonDashboardComponent } from './components/season-dashboard/season-dashboard.component';

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
    { path: Paths.leagues, component: LeagueListComponent },
    { path: `${Paths.leagues}/:${RouteParams.leagueId}`, component: LeagueDashboardComponent },
    { path: `${Paths.leagues}/:${RouteParams.leagueId}/${Paths.seasons}/:${RouteParams.seasonId}`, component: SeasonDashboardComponent },
];
