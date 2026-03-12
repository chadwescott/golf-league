import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { collection, collectionData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { PlayerScores } from '../models/player-scores.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerScoresService {
    private readonly firestore = inject(Firestore);

    readonly playerScoresConverter: FirestoreDataConverter<PlayerScores> = {
        toFirestore(playerScores: PlayerScores) {
            return {
                playerId: playerScores.playerId,
                holeScores: playerScores.holeScores,
                handicap: playerScores.handicap,
                inScore: playerScores.inScore,
                outScore: playerScores.outScore,
                totalScore: playerScores.totalScore,
                grossPoints: playerScores.grossPoints,
                netPoints: playerScores.netPoints
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlayerScores {
            return snapshot.data(options) as PlayerScores;
        },
    };

    getPlayerScoresByScorecardId(scorecardId: string): Observable<PlayerScores[] | undefined> {
        console.log(`Fetching player scores for scorecard ID: ${scorecardId}`);
        const playerScoresRef = collection(this.firestore, `${FirestorePaths.scorecards}/${scorecardId}/${FirestorePaths.playerScores}`).withConverter(this.playerScoresConverter);
        return collectionData(playerScoresRef);
    }
}


