import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { RouteParams } from '../app.routes';
import { League } from '../models/league.model';
import { LeagueService } from '../services/league.service';

export const leagueResolver: ResolveFn<League | null> = (route) => {
    const leagueService = inject(LeagueService);
    const leagueId = route.paramMap.get(RouteParams.leagueId);

    if (!leagueId) {
        return of(null);
    }

    return leagueService.getLeagueById(leagueId);
};