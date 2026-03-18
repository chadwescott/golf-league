import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
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
    private matchCache: Match[] = [];
    private readonly matchKey = 'match';

    readonly matchConverter: FirestoreDataConverter<Match> = {
        toFirestore(match: Match) {
            return {
                id: match.id,
                name: match.name,
                date: match.date,
                courseId: match.courseId,
                roundHoles: match.roundHoles,
                matchType: match.matchType,
                skinAmount: match.skinAmount,
                scorecardId: match.scorecardId
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Match {
            const data = snapshot.data(options) as Omit<Match, 'id'>;
            return { ...data, id: snapshot.id };
        },
    };

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
        const cachedMatch = this.matchCache.find(event => event.id === matchId);
        if (cachedMatch) {
            return of(cachedMatch);
        }

        return runInInjectionContext(this.environmentInjector, () => {
            const eventRef = doc(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.matches}/${matchId}`)
                .withConverter(this.matchConverter);

            return from(getDoc(eventRef)).pipe(
                map(snap => {
                    if (snap.exists()) {
                        const event = snap.data();
                        this.matchCache.push(event);
                        this.appStateService.saveDataToStorage(this.matchKey, this.matchCache);
                        return event;
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
