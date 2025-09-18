import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, forkJoin, map, Observable, switchMap, tap } from 'rxjs';

import { LeaguePlayer } from '../models/league-player.model';
import { LeagueYearPlayer } from '../models/league-year-player.model';

import { Player } from '../models/player.model';
import { AppStateService } from './app-state.service';
import { FirestorPaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    players = signal<Player[]>([]);
    leaguePlayers = signal<Player[]>([]);
    leagueYearPlayers = signal<Player[]>([]);

    constructor(private readonly firestore: AngularFirestore, private readonly appStateService: AppStateService) {
    }

    getPlayers(): Observable<Player[]> {
        return this.firestore.collection<Player>(FirestorPaths.players).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const player = doc.data();
                    player.id = doc.id;
                    return player;
                })),
                map((players) => this.sort(players)),
                tap((players) => this.players.set(players))
            );
    }

    addPlayer(player: Player): Promise<Player> {
        return this.firestore.collection<Player>(FirestorPaths.players).add(player)
            .then((doc) => {
                return doc.get().then(snap => {
                    const created = (snap.data() as Player) ?? { ...player };
                    created.id = snap.id; this.players.update(prev => {
                        const next = [...prev, created];
                        return this.sort(next);
                    });
                    return created;
                });
            });
    }

    deletePlayer(player: Player): Promise<void> {
        return this.deleteLeaguePlayer(player).then(() =>
            this.firestore.doc(`${FirestorPaths.players}/${player.id}`).delete()
        );
    }

    sort(players: Player[]): Player[] {
        return players.sort((a, b) =>
            a.lastName === b.lastName
                ? a.firstName.localeCompare(b.firstName)
                : a.lastName.localeCompare(b.lastName)
        );
    }

    getLeaguePlayers(leagueId: string): Observable<Player[]> {
        return this.firestore
            .collection<LeaguePlayer>(FirestorPaths.leaguePlayers, ref => ref.where('leagueId', '==', leagueId))
            .get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const lp = doc.data();
                    lp.id = doc.id;
                    return lp;
                })),
                switchMap(leaguePlayers => {
                    const playerIds = leaguePlayers.map(lp => lp.playerId).filter(id => !!id);

                    if (playerIds.length === 0) {
                        return [];
                    }

                    const playerDocs$ = playerIds.map(playerId =>
                        this.firestore.doc<Player>(`players/${playerId}`).get().pipe(
                            map(snap => {
                                if (!snap.exists) return null;
                                const player = snap.data() as Player;
                                player.id = snap.id;
                                return player;
                            })
                        )
                    );

                    return forkJoin(playerDocs$).pipe(
                        map(players => players.filter((p): p is Player => p !== null)),
                        map(players => this.sort(players)),
                        tap(players => this.leaguePlayers.set(players))
                    );
                })
            );
    }

    addLeaguePlayer(leaguePlayer: LeaguePlayer): Promise<void> {
        return this.firestore.collection<LeaguePlayer>(FirestorPaths.leaguePlayers).add(leaguePlayer).then(() => { });;
    }

    deleteLeaguePlayer(player: Player): Promise<void> {
        return this.deleteLeagueYearPlayer(player).then(() =>
            firstValueFrom(this.firestore.collection<LeaguePlayer>(FirestorPaths.leaguePlayers, ref => ref.where('playerId', '==', player.id)).get()
                .pipe(
                    tap(collection => collection.docs.forEach(x => this.firestore.doc(`${FirestorPaths.leaguePlayers}/${x.id}`).delete())
                    ),
                    map(() => void 0)
                ))
        );
    }

    getLeagueYearPlayers(leagueYearId: string): Observable<Player[]> {
        return this.firestore.collection<LeagueYearPlayer>(FirestorPaths.leagueYearPlayers, ref => ref.where('leagueYearId', '==', leagueYearId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const lyp = doc.data();
                    lyp.id = doc.id;
                    return lyp;
                }),
                ),
                switchMap(lyp => {
                    const playerIds = lyp.map(lp => lp.playerId);
                    if (playerIds.length === 0) {
                        this.leagueYearPlayers.set([]);
                        return [];
                    }

                    const playerDocs$ = playerIds.map(playerId =>
                        this.firestore.doc<Player>(`${FirestorPaths.players}/${playerId}`).get().pipe(
                            map(snap => {
                                if (!snap.exists) return null;
                                const player = snap.data() as Player;
                                player.id = snap.id;
                                return player;
                            })
                        )
                    );

                    return forkJoin(playerDocs$).pipe(
                        map(players => players.filter((p): p is Player => p !== null)),
                        map(players => this.sort(players)),
                        tap(players => this.leagueYearPlayers.set(players))
                    );
                })
            );
    }

    addLeagueYearPlayer(leagueYearPlayer: LeagueYearPlayer): Promise<void> {
        return this.firestore.collection<LeagueYearPlayer>(FirestorPaths.leagueYearPlayers).add(leagueYearPlayer)
            .then((doc) => { });
    }

    deleteLeagueYearPlayer(player: Player): Promise<void> {
        return firstValueFrom(this.firestore.collection<LeagueYearPlayer>(FirestorPaths.leagueYearPlayers, ref => ref.where('playerId', '==', player.id)).get()
            .pipe(
                tap(collection => collection.docs.forEach(x => this.firestore.doc(`${FirestorPaths.leagueYearPlayers}/${x.id}`).delete())
                ),
                map(() => void 0)
            ));
    }
}
