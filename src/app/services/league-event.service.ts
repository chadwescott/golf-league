import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';
import { LeagueEvent } from '../models/league-event.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueEventService {
    leagueEvents = signal<LeagueEvent[]>([]);

    constructor(private firestore: AngularFirestore) { }

    getLeagueEvents(leagueSeasonId: string): Observable<LeagueEvent[]> {
        return this.firestore.collection<LeagueEvent>(FirestorePaths.leagueEvents, ref => ref.where('leagueSeasonId', '==', leagueSeasonId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const event = doc.data();
                    event.id = doc.id;
                    return event;
                })),
                tap(events => this.leagueEvents.set(events))
            );
    }

    addLeagueEvent(event: LeagueEvent): Promise<void> {
        return this.firestore.collection<LeagueEvent>(FirestorePaths.leagueEvents).add(event)
            .then(doc => {
                event.id = doc.id;
                this.leagueEvents.update(evts => [...evts, event]);
            });
    }

    updateLeagueEvent(id: string, event: LeagueEvent): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`league-events/${id}`).update(event);
    }

    deleteLeagueEvent(id: string): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`league-events/${id}`).delete()
            .then(() => {
                this.leagueEvents.update(evts => evts.filter(e => e.id !== id));
            });
    }
}