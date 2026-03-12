import { Routes } from '@angular/router';
import { LeagueDashboardComponent } from './components/league-dashboard/league-dashboard.component';
import { LeagueListComponent } from './components/league-list/league-list.component';
import { MatchDashboardComponent } from './components/match-dashboard/match-dashboard.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { SeasonDashboardComponent } from './components/season-dashboard/season-dashboard.component';
import { SeasonListComponent } from './components/season-list/season-list.component';

export const Paths = {
    leagues: 'leagues',
    seasons: 'seasons',
    matches: 'matches',
    players: 'players',
    schedules: 'schedules',
    scorecards: 'scorecards',
}

export const RouteParams = {
    leagueId: 'leagueId',
    scorecardId: 'scorecardId',
    seasonId: 'seasonId',
    matchId: 'matchId'
}

export const routes: Routes = [
    { path: '', redirectTo: Paths.leagues, pathMatch: 'full' },
    { path: Paths.players, component: PlayerListComponent },
    { path: Paths.leagues, component: LeagueListComponent },
    {
        path: `${Paths.leagues}/:${RouteParams.leagueId}`, component: LeagueDashboardComponent,
        children: [
            {
                path: '', redirectTo: Paths.seasons, pathMatch: 'full',
            },
            {
                path: `${Paths.seasons}`, component: SeasonListComponent,
            },
            {
                path: `${Paths.seasons}/:${RouteParams.seasonId}`, component: SeasonDashboardComponent,
                children: [
                    { path: `${Paths.matches}/:${RouteParams.matchId}`, component: MatchDashboardComponent },
                ]
            }
        ]
    },
];
