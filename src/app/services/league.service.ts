import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';


import { collection, collectionData, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { League } from '../models/league.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private leagueCache: League[] = [];
    private readonly leagueKey = 'leagues';

    readonly leagueConverter: FirestoreDataConverter<League> = {
        toFirestore(league: League) {
            return {
                id: league.id,
                name: league.name
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): League {
            const data = snapshot.data(options) as Omit<League, 'id'>;
            return { ...data, id: snapshot.id };
        },
    };

    getLeagues(): Observable<League[]> {
        const leagueRef = collection(this.firestore, FirestorePaths.leagues)
            .withConverter(this.leagueConverter) as CollectionReference<League>;

        return collectionData(leagueRef)
            .pipe(
                map((leagues) => this.sort(leagues)),
                tap(leagues => {
                    this.leagueCache = leagues;
                    this.appStateService.saveDataToStorage(this.leagueKey, this.leagueCache);
                })
            );
    }

    sort(leagues: League[]): League[] {
        return leagues.sort((a, b) => a.name.localeCompare(b.name));
    }

    getLeagueById(leagueId: string): Observable<League | undefined> {
        const cachedLeague = this.leagueCache.find(league => league.id === leagueId);
        if (cachedLeague) {
            return of(cachedLeague);
        }

        const leagueRef = doc(this.firestore, `${FirestorePaths.leagues}/${leagueId}`).withConverter(this.leagueConverter);
        return from(getDoc(leagueRef)).pipe(
            map(snap => {
                if (snap.exists()) {
                    const league = snap.data();
                    this.leagueCache.push(league);
                    this.appStateService.saveDataToStorage(this.leagueKey, this.leagueCache);
                    return league;
                } else {
                    return undefined;
                }
            }));
    }
}
