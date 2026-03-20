import { EnvironmentInjector, inject, Injectable, runInInjectionContext, signal } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';


import { doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Scorecard } from '../models/scorecard.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class ScorecardService {
    private readonly appStateService = inject(AppStateService);
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);
    private readonly scorecardKey = 'scorecards';

    private scorecardCache: Scorecard[] = [];

    selectedScorecard = signal<Scorecard | null>(null);

    readonly scorecardConverter: FirestoreDataConverter<Scorecard> = {
        toFirestore(scorecard: Scorecard) {
            return {
                id: scorecard.id,
                courseId: scorecard.courseId,
                date: scorecard.date,
                roundHoles: scorecard.roundHoles,
                holes: scorecard.holes,
                skinAmount: scorecard.skinAmount
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Scorecard {
            const data = snapshot.data(options) as Omit<Scorecard, 'id'>;
            return { ...data, id: snapshot.id };
        },
    };

    getScorecardById(scorecardId: string): Observable<Scorecard | null> {
        const cachedScorecard = this.scorecardCache.find(scorecard => scorecard.id === scorecardId);
        if (cachedScorecard) {
            console.log(`Scorecard found in cache: ${cachedScorecard.id}`);
            return of(cachedScorecard);
        }

        return runInInjectionContext(this.environmentInjector, () => {
            const scorecardRef = doc(this.firestore, `${FirestorePaths.scorecards}/${scorecardId}`).withConverter(this.scorecardConverter);
            return from(getDoc(scorecardRef)).pipe(
                map(snap => {
                    if (snap.exists()) {
                        const scorecard = snap.data();
                        this.scorecardCache.push(scorecard);
                        this.appStateService.saveDataToStorage(this.scorecardKey, this.scorecardCache);
                        return scorecard;
                    } else {
                        return null;
                    }
                }))
        });
    }
}

