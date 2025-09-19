import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';

import { LeaguePlayer } from '../models/league-player.model';
import { SeasonPlayer } from '../models/season-player.model';

import { Player } from '../models/player.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    players = signal<Player[]>([]);
    leaguePlayers = signal<Player[]>([])
    leagueSeasonPlayers = signal<Player[]>([]);

    constructor(private readonly firestore: AngularFirestore, private readonly appStateService: AppStateService) {
    }

    getPlayers(): Observable<Player[]> {
        return this.firestore.collection<Player>(FirestorePaths.players).get()
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
        return this.firestore.collection<Player>(FirestorePaths.players).add(player)
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

    updatePlayer(player: Player): Promise<Player> {
        if (!player.id) {
            return Promise.reject(new Error('Player ID is required for update.'));
        }
        return this.firestore.doc<Player>(`${FirestorePaths.players}/${player.id}`)
            .update(player)
            .then(() => {
                this.players.update(prev => {
                    const idx = prev.findIndex(p => p.id === player.id);
                    if (idx === -1) return prev;
                    const next = [...prev];
                    next[idx] = { ...player };
                    return this.sort(next);
                });
                return player;
            });
    }

    deletePlayer(playerId: string): Promise<void> {
        return this.firestore.doc(`${FirestorePaths.players}/${playerId}`).delete();
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
            .collection<LeaguePlayer>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.players}`)
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

    addLeaguePlayer(leagueId: string, leaguePlayer: LeaguePlayer): Promise<void> {
        return this.firestore.collection<LeaguePlayer>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.players}`).add(leaguePlayer).then(() => { });;
    }

    deleteLeaguePlayer(leagueId: string, playerId: string): Promise<void> {
        return this.firestore.doc<Player>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.players}/${playerId}`).delete();
    }

    getLeagueSeasonPlayers(leagueId: string, seasonId: string): Observable<Player[]> {
        return this.firestore.collection<SeasonPlayer>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.players}`)
            .get()
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
                        this.leagueSeasonPlayers.set([]);
                        return [];
                    }

                    const playerDocs$ = playerIds.map(playerId =>
                        this.firestore.doc<Player>(`${FirestorePaths.players}/${playerId}`).get().pipe(
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
                        tap(players => this.leagueSeasonPlayers.set(players))
                    );
                })
            );
    }

    addLeagueSeasonPlayer(leagueId: string, seasonId: string, leagueSeasonPlayer: SeasonPlayer): Promise<void> {
        return this.firestore.collection<SeasonPlayer>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.players}`)
            .add(leagueSeasonPlayer)
            .then(() => { });
    }

    deleteLeagueSeasonPlayer(leagueId: string, seasonId: string, playerId: string): Promise<void> {
        return this.firestore.doc<Player>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.players}/${playerId}`)
            .delete();
    }
}
