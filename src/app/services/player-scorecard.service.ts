import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { first, Observable } from 'rxjs';


import { collection, collectionData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { PlayerScorecard } from '../models/player-scorecard.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerScorecardService {
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);

    readonly playerScorecardConverter: FirestoreDataConverter<PlayerScorecard> = {
        toFirestore(playerScorecard: PlayerScorecard) {
            return {
                scorecardId: playerScorecard.scorecardId,
                playerScoresId: playerScorecard.playerScoresId,
                roundDate: playerScorecard.roundDate,
                grossScore: playerScorecard.grossScore,
                netScore: playerScorecard.netScore
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlayerScorecard {
            return { ...snapshot.data(options) } as PlayerScorecard;
        },
    };

    getPlayerScorecardsByScorecardId(playerId: string): Observable<PlayerScorecard[]> {
        return runInInjectionContext(this.environmentInjector, () => {
            const playerScoresRef = collection(this.firestore, `${FirestorePaths.players}/${playerId}/${FirestorePaths.scorecards}`)
                .withConverter(this.playerScorecardConverter);

            return collectionData(playerScoresRef).pipe(first());
        });
    }
}



