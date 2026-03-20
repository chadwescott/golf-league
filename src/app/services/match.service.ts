import { EnvironmentInjector, inject, Injectable, NgZone, runInInjectionContext } from '@angular/core';
import { from, map, Observable, of, tap } from 'rxjs';


import { collection, collectionData, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, query, QueryDocumentSnapshot, SnapshotOptions, where } from '@angular/fire/firestore';
import { Match } from '../models/match.model';
import { PlayerMatchStats } from '../models/player-match-stats.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private readonly appStateService = inject(AppStateService);
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private matchCache: Match[] = [];
    private readonly matchKey = 'matches';

    private setSelectedMatch(match: Match): void {
        this.ngZone.run(() => {
            this.appStateService.selectedMatch.set(match);
        });
    }

    readonly matchConverter: FirestoreDataConverter<Match> = {
        toFirestore(match: Match) {
            return {
                id: match.id,
                name: match.name,
                date: match.date,
                courseId: match.courseId,
                roundHoles: match.roundHoles,
                matchType: match.matchType,
                skinAmount: match.skinFee,
                scorecardId: match.scorecardId
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Match {
            const data = snapshot.data(options) as Omit<Match, 'id'>;
            return { ...data, id: snapshot.id };
        },
    };

    // TODO: Move to PlayerMatchStatsService
    readonly playerMatchStatsConverter: FirestoreDataConverter<PlayerMatchStats> = {
        toFirestore(stats: PlayerMatchStats) {
            return {
                playerId: stats.playerId,
                leagueEventId: stats.leagueEventId,
                albatrosses: stats.albatrosses,
                eagles: stats.eagles,
                birdies: stats.birdies,
                pars: stats.pars,
                bogeys: stats.bogeys,
                doubleBogeys: stats.doubleBogeys,
                others: stats.others,
                doublePars: stats.doublePars,
                fairwaysHit: stats.fairwaysHit,
                grossPoints: stats.grossPoints,
                netPoints: stats.netPoints,
                grossSkins: stats.grossSkins,
                netSkins: stats.netSkins,
                grossSkinAmount: stats.grossSkinAmount,
                netSkinAmount: stats.netSkinAmount,
                result: stats.result
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlayerMatchStats {
            return snapshot.data(options) as PlayerMatchStats;
        },
    };

    getMatchesByLeagueIdAndSeasonId(leagueId: string, seasonId: string): Observable<Match[]> {
        return runInInjectionContext(this.environmentInjector, () => {
            const matchRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.matches}`)
                .withConverter(this.matchConverter) as CollectionReference<Match>;

            return collectionData(matchRef);
        })
            .pipe(
                map(matches => this.sort(matches)),
                tap(matches => {
                    this.matchCache = matches;
                    this.appStateService.saveDataToStorage(this.matchKey, this.matchCache);
                })
            );
    }

    getMatchById(leagueId: string, seasonId: string, matchId: string): Observable<Match | null> {
        console.log('get match by id');
        const cachedMatch = this.matchCache.find(event => event.id === matchId);
        if (cachedMatch) {
            console.log(`Match found in cache: ${cachedMatch.id}`);
            this.setSelectedMatch(cachedMatch);
            return of(cachedMatch);
        }

        if (this.appStateService.selectedMatch()?.id === matchId) {
            console.log(`Match found in app state: ${this.appStateService.selectedMatch()?.id}`);
            return of(this.appStateService.selectedMatch()!);
        }

        return runInInjectionContext(this.environmentInjector, () => {
            const eventRef = doc(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.matches}/${matchId}`)
                .withConverter(this.matchConverter);

            return from(getDoc(eventRef)).pipe(
                map(snap => {
                    if (snap.exists()) {
                        const match = snap.data();
                        this.matchCache.push(match);
                        this.appStateService.saveDataToStorage(this.matchKey, this.matchCache);
                        this.setSelectedMatch(match);
                        return match;
                    } else {
                        return null;
                    }
                })
            );
        });
    }

    sort(matches: Match[]): Match[] {
        return matches.sort((a, b) => a.date < b.date ? -1 : 1);
    }

    getPlayerStatsByMatchId(leagueId: string, seasonId: string, matchId: string): Observable<PlayerMatchStats[]> {
        return runInInjectionContext(this.environmentInjector, () => {
            const playerMatchStatsCollection = collection(this.firestore,
                `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.eventStats}`)
                .withConverter(this.playerMatchStatsConverter);

            const playerMatchStatsQuery = query(playerMatchStatsCollection, where('leagueEventId', '==', matchId));

            return collectionData(playerMatchStatsQuery);
        });
    }
}
