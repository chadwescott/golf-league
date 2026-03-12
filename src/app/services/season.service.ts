import { inject, Injectable, signal } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';


import { collection, collectionData, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { PlayerStats } from '../models/player-stats';
import { Season } from '../models/season.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class SeasonService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private readonly seasonKey = 'seasons';

    private seasonCache: Season[] = [];

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
            return { ...data, id: snapshot.id };
        },
    };

    readonly playerResultsConverter: FirestoreDataConverter<PlayerStats> = {
        toFirestore(stat: PlayerStats) {
            return {
                playerId: stat.playerId,
                leagueEventId: stat.leagueEventId,
                albatrosses: stat.albatrosses,
                eagles: stat.eagles,
                birdies: stat.birdies,
                pars: stat.pars,
                bogeys: stat.bogeys,
                doubleBogeys: stat.doubleBogeys,
                others: stat.others,
                fairwaysHit: stat.fairwaysHit,
                points: stat.netPoints,
                wins: stat.wins,
                losses: stat.losses,
                ties: stat.ties
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlayerStats {
            return snapshot.data(options) as Omit<PlayerStats, 'id'>;
        },
    };

    getSeasonsByLeagueId(leagueId: string): Observable<Season[]> {
        const seasonRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`)
            .withConverter(this.seasonConverter) as CollectionReference<Season>;

        return collectionData(seasonRef)
            .pipe(
                map(seasons => this.sort(seasons)),
                tap(seasons => console.log(seasons)),
                tap(seasons => {
                    this.seasonCache = seasons;
                    this.appStateService.saveDataToStorage(this.seasonKey, this.seasonCache);
                })
            );
    }

    getSeasonById(leagueId: string, seasonId: string): Observable<Season | undefined> {
        const cachedSeason = this.seasonCache.find(season => season.id === seasonId);
        if (cachedSeason) {
            return of(cachedSeason);
        }

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

    getPlayerStatsBySeasonId(leagueId: string, seasonId: string): Observable<PlayerStats[]> {
        const playerResultsRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.playerStats}`)
            .withConverter(this.playerResultsConverter);;

        return collectionData(playerResultsRef)
    }
}
