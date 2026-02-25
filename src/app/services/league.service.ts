import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


import { collection, collectionData, CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { League } from '../models/league.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueService {
    private readonly firestore = inject(Firestore);

    readonly leagueConverter: FirestoreDataConverter<League> = {
        toFirestore(league: League) {
            return {
                id: league.id,
                name: league.name
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): League {
            const data = snapshot.data(options) as Omit<League, 'id'>;
            return { id: snapshot.id, ...data };
        },
    };

    getLeagues(): Observable<League[]> {
        const leagueRef = collection(this.firestore, FirestorePaths.leagues)
            .withConverter(this.leagueConverter) as CollectionReference<League>;

        return collectionData(leagueRef)
            .pipe(
                map((leagues) => this.sort(leagues))
            );
    }

    sort(leagues: League[]): League[] {
        return leagues.sort((a, b) => a.name.localeCompare(b.name));
    }
}
