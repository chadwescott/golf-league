import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { RouteParams } from '../app.routes';
import { Season } from '../models/season.model';
import { SeasonService } from '../services/season.service';

export const seasonResolver: ResolveFn<Season | null> = (route) => {
    const seasonService = inject(SeasonService);

    const seasonId = route.paramMap.get(RouteParams.seasonId);
    const leagueId = route.parent?.paramMap.get(RouteParams.leagueId);

    if (!leagueId || !seasonId) {
        return of(null);
    }

    return seasonService.getSeasonById(leagueId, seasonId);
};