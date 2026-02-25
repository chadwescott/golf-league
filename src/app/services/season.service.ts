import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


import { collection, collectionData, CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Season } from '../models/season.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class SeasonService {
    private readonly firestore = inject(Firestore);

    readonly seasonConverter: FirestoreDataConverter<Season> = {
        toFirestore(season: Season) {
            return {
                id: season.id,
                name: season.name,
                year: season.year
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Season {
            const data = snapshot.data(options) as Omit<Season, 'id'>;
            return { id: snapshot.id, ...data };
        },
    };

    getLeagueSeasons(leagueId: string): Observable<Season[]> {
        const seasonRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`)
            .withConverter(this.seasonConverter) as CollectionReference<Season>;

        return collectionData(seasonRef)
            .pipe(
                map((seasons) => this.sort(seasons))
            );
    }

    sort(seasons: Season[]): Season[] {
        return seasons.sort((a, b) => b.name.localeCompare(a.name));
    }
}
