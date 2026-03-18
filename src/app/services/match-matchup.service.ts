import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';


import { collection, collectionData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { MatchMatchup } from '../models/match-matchup.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class MatchMatchupService {
    private readonly appStateService = inject(AppStateService);
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);

    readonly matchMatchupConverter: FirestoreDataConverter<MatchMatchup> = {
        toFirestore(matchup: MatchMatchup) {
            return {
                id: matchup.id,
                teams: matchup.teams
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): MatchMatchup {
            return snapshot.data(options) as MatchMatchup;
        },
    };

    getMatchupsByMatchId(leagueId: string, seasonId: string, matchId: string): Observable<MatchMatchup[]> {
        return runInInjectionContext(this.environmentInjector, () => {
            const playerMatchStatsCollection = collection(this.firestore,
                `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.matches}/${matchId}/${FirestorePaths.matchups}`)
                .withConverter(this.matchMatchupConverter);

            return collectionData(playerMatchStatsCollection);
        });
    }
}


