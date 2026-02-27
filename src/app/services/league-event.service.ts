import { inject, Injectable, signal } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';


import { collection, collectionData, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { LeagueEvent } from '../models/league-event.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueEventService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private readonly leagueEventCache: LeagueEvent[] = [];
    private readonly leagueEventKey = 'leagueEvents';

    selectedLeagueEvent = signal<LeagueEvent | null>(null);

    readonly leagueEventConverter: FirestoreDataConverter<LeagueEvent> = {
        toFirestore(leagueEvent: LeagueEvent) {
            return {
                id: leagueEvent.id,
                name: leagueEvent.name,
                date: leagueEvent.date,
                courseId: leagueEvent.courseId,
                roundHoles: leagueEvent.roundHoles,
                eventType: leagueEvent.eventType,
                skinAmount: leagueEvent.skinAmount,
                scorecardId: leagueEvent.scorecardId
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): LeagueEvent {
            const data = snapshot.data(options) as Omit<LeagueEvent, 'id'>;
            return { id: snapshot.id, ...data };
        },
    };

    getLeagueEventsByLeagueIdAndSeasonId(leagueId: string, seasonId: string): Observable<LeagueEvent[]> {
        const leagueEventRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`)
            .withConverter(this.leagueEventConverter) as CollectionReference<LeagueEvent>;

        return collectionData(leagueEventRef)
            .pipe(
                map((leagueEvents) => this.sort(leagueEvents))
            );
    }

    getLeagueEventById(leagueId: string, seasonId: string, leagueEventId: string): Observable<LeagueEvent | undefined> {
        const cachedEvents = this.leagueEventCache.find(leagueEvent => leagueEvent.id === leagueEventId);
        if (cachedEvents) {
            return of(cachedEvents);
        }

        const leagueEventRef = doc(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}/${leagueEventId}`)
            .withConverter(this.leagueEventConverter);
        return from(getDoc(leagueEventRef)).pipe(
            map(snap => {
                if (snap.exists()) {
                    const leagueEvent = snap.data();
                    this.leagueEventCache.push(leagueEvent);
                    this.appStateService.saveDataToStorage(this.leagueEventKey, this.leagueEventCache);
                    return leagueEvent;
                } else {
                    return undefined;
                }
            }));
    }

    sort(leagueEvents: LeagueEvent[]): LeagueEvent[] {
        return leagueEvents.sort((a, b) => b.name.localeCompare(a.name));
    }

    selectLeagueEvent(leagueEvent: LeagueEvent | null): void {
        this.selectedLeagueEvent.set(leagueEvent);
    }
}

