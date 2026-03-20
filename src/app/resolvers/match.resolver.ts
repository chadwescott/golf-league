import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { RouteParams } from '../app.routes';
import { Match } from '../models/match.model';
import { MatchService } from '../services/match.service';

function getRouteParam(route: Parameters<ResolveFn<Match | null>>[0], key: string): string | null {
    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
        const value = current.paramMap.get(key);
        if (value) {
            return value;
        }
        current = current.parent;
    }

    return null;
}

export const matchResolver: ResolveFn<Match | null> = (route) => {
    const matchService = inject(MatchService);

    const matchId = getRouteParam(route, RouteParams.matchId);
    const seasonId = getRouteParam(route, RouteParams.seasonId);
    const leagueId = getRouteParam(route, RouteParams.leagueId);

    if (!leagueId || !seasonId || !matchId) {
        return of(null);
    }

    return matchService.getMatchById(leagueId, seasonId, matchId);
};
