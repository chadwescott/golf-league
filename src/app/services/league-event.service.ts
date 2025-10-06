import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';
import { EventMatchup } from '../models/event-matchup.model';
import { LeagueEvent } from '../models/league-event.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueEventService {
    leagueEvents = signal<LeagueEvent[]>([]);
    matchups = signal<EventMatchup[]>([]);

    constructor(private firestore: AngularFirestore) { }

    getLeagueEvents(leagueId: string, seasonId: string): Observable<LeagueEvent[]> {
        return this.firestore.collection<LeagueEvent>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}`)
            .get()
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

    addLeagueEvent(leagueId: string, seasonId: string, event: LeagueEvent): Promise<void> {
        return this.firestore.collection<LeagueEvent>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}`)
            .add(event)
            .then(doc => {
                event.id = doc.id;
                this.leagueEvents.update(evts => [...evts, event]);
            });
    }

    updateLeagueEvent(leagueId: string, seasonId: string, eventId: string, event: Partial<LeagueEvent>): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}/${eventId}`)
            .update(event)
            .then(() => {
                this.leagueEvents.update(evts =>
                    evts.map(e => e.id === eventId ? { ...e, ...event } : e)
                );
            });
    }

    deleteLeagueEvent(id: string): Promise<void> {
        return this.firestore.doc<LeagueEvent>(`${FirestorePaths.events}/${id}`).delete()
            .then(() => {
                this.leagueEvents.update(evts => evts.filter(e => e.id !== id));
            });
    }

    getLeagueEventMatchups(leagueId: string, seasonId: string, eventId: string): Observable<EventMatchup[]> {
        return this.firestore
            .collection<EventMatchup>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}/${eventId}/${FirestorePaths.matchups}`)
            .get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const matchup = doc.data();
                    matchup.id = doc.id;
                    return matchup;
                })),
                tap(matchups => this.matchups.set(matchups))
            );
    }

    addLeagueEventMatchup(leagueId: string, seasonId: string, leagueEventId: string, matchup: EventMatchup): Promise<void> {
        return this.firestore
            .collection(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}/${leagueEventId}/${FirestorePaths.matchups}`)
            .add(matchup)
            .then(doc => {
                matchup.id = doc.id;
                this.matchups.update(prev => [...prev, matchup]);
            });
    }

    deleteLeagueEventMatchup(leagueId: string, seasonId: string, eventId: string, matchupId: string): Promise<void> {
        return this.firestore
            .doc<EventMatchup>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.events}/${eventId}/${FirestorePaths.matchups}/${matchupId}`)
            .delete()
            .then(() => {
                this.matchups.update(matchups => matchups.filter(m => m.id !== matchupId));
            });
    }
}