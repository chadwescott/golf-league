import { inject, Injectable, signal } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';


import { collection, collectionData, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Season } from '../models/season.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class SeasonService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private readonly seasonCache: Season[] = [];
    private readonly seasonKey = 'seasons';

    selectedSeason = signal<Season | null>(null);

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

    getSeasonsByLeagueId(leagueId: string): Observable<Season[]> {
        const seasonRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`)
            .withConverter(this.seasonConverter) as CollectionReference<Season>;

        return collectionData(seasonRef)
            .pipe(
                map((seasons) => this.sort(seasons))
            );
    }

    getSeasonById(leagueId: string, seasonId: string): Observable<Season | undefined> {
        const cachedSeason = this.seasonCache.find(season => season.id === seasonId);
        if (cachedSeason) {
            return of(cachedSeason);
        }

        console.log(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}`);
        const seasonRef = doc(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}`).withConverter(this.seasonConverter);
        return from(getDoc(seasonRef)).pipe(
            map(snap => {
                if (snap.exists()) {
                    const season = snap.data();
                    this.seasonCache.push(season);
                    this.appStateService.saveDataToStorage(this.seasonKey, this.seasonCache);
                    return season;
                } else {
                    return undefined;
                }
            }));
    }

    sort(seasons: Season[]): Season[] {
        return seasons.sort((a, b) => b.name.localeCompare(a.name));
    }

    selectSeason(season: Season | null): void {
        this.selectedSeason.set(season);
    }
}
