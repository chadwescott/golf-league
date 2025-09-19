import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';
import { LeagueEventMatchup } from '../models/league-event-matchup.model';
import { LeagueEvent } from '../models/league-event.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueEventService {
    leagueEvents = signal<LeagueEvent[]>([]);
    leagueEventMatchups = signal<LeagueEventMatchup[]>([]);

    constructor(private firestore: AngularFirestore) { }

    getLeagueEvents(leagueSeasonId: string): Observable<LeagueEvent[]> {
        return this.firestore.collection<LeagueEvent>(FirestorePaths.leagueEvents, ref => ref.where('leagueSeasonId', '==', leagueSeasonId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const event = doc.data();
                    event.id = doc.id;
                    return event;
                })),
                map(collection => collection.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
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

    updateLeagueEvent(eventId: string, event: Partial<LeagueEvent>): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`${FirestorePaths.leagueEvents}/${eventId}`).update(event)
            .then(() => {
                this.leagueEvents.update(evts =>
                    evts.map(e => e.id === eventId ? { ...e, ...event } : e)
                );
            });
    }

    deleteLeagueEvent(id: string): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`${FirestorePaths.leagueEvents}/${id}`).delete()
            .then(() => {
                this.leagueEvents.update(evts => evts.filter(e => e.id !== id));
            });
    }

    getLeagueEventMatchups(leagueEventId: string): Observable<LeagueEventMatchup[]> {
        return this.firestore.collection<LeagueEventMatchup>(`${FirestorePaths.leagueEvents}/${leagueEventId}/${FirestorePaths.matchups}`)
            .get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const matchup = doc.data();
                    matchup.id = doc.id;
                    return matchup;
                })),
                tap(matchups => this.leagueEventMatchups.set(matchups))
            );
    }

    addLeagueEventMatchup(leagueEventId: string, matchup: LeagueEventMatchup): Promise<void> {
        return this.firestore
            .collection(`${FirestorePaths.leagueEvents}/${leagueEventId}/${FirestorePaths.matchups}`)
            .add(matchup)
            .then(doc => {
                matchup.id = doc.id;
                this.leagueEventMatchups.update(prev => [...prev, matchup]);
            });
    }
}