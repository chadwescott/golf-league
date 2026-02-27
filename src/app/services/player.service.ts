import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';


import { collection, collectionData, CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { LeaguePlayer } from '../models/league-player.model';
import { Player } from '../models/player.model';
import { SeasonPlayer } from '../models/season-player.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private readonly playerCache: Player[] = [];
    private readonly playersKey = 'players';

    constructor() {
        this.appStateService.loadDataFromStorage<Player[]>(this.playersKey)?.map(player => this.playerCache.push(player));
    }

    readonly playerConverter: FirestoreDataConverter<Player> = {
        toFirestore(player: Player) {
            return {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                imagePath: player.imagePath,
                handicap: player.handicap
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Player {
            const data = snapshot.data(options) as Omit<Player, 'id'>;
            return { id: snapshot.id, ...data };
        },
    };

    readonly leaguePlayerConverter: FirestoreDataConverter<LeaguePlayer> = {
        toFirestore(leaguePlayer: LeaguePlayer) {
            return {
                id: leaguePlayer.id,
                playerId: leaguePlayer.playerId
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): LeaguePlayer {
            const data = snapshot.data(options) as Omit<LeaguePlayer, 'id'>;
            return { id: snapshot.id, ...data };
        }
    };

    readonly seasonPlayer: FirestoreDataConverter<SeasonPlayer> = {
        toFirestore(leagueSeasonPlayer: SeasonPlayer) {
            return {
                id: leagueSeasonPlayer.id,
                playerId: leagueSeasonPlayer.playerId,
                handicap: leagueSeasonPlayer.handicap
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SeasonPlayer {
            const data = snapshot.data(options) as Omit<SeasonPlayer, 'id'>;
            return { id: snapshot.id, ...data };
        }
    };

    getPlayers(): Observable<Player[]> {
        const cachedPlayers = this.playerCache.length ? this.playerCache : null;
        if (cachedPlayers) {
            return of(cachedPlayers);
        }

        const playerRef = collection(this.firestore, FirestorePaths.players)
            .withConverter(this.playerConverter) as CollectionReference<Player>;

        return collectionData(playerRef)
            .pipe(
                map((players) => this.sort(players)),
                tap(players => { this.appStateService.saveDataToStorage(this.playersKey, players); })
            );
    }

    getLeaguePlayers(leagueId: string): Observable<LeaguePlayer[]> {
        const playersRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.players}`)
            .withConverter(this.leaguePlayerConverter) as CollectionReference<LeaguePlayer>;

        return collectionData(playersRef);
    }

    getLeagueSeasonPlayers(leagueId: string, seasonId: string): Observable<SeasonPlayer[]> {
        const playersRef = collection(this.firestore, `${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}/${seasonId}/${FirestorePaths.players}`)
            .withConverter(this.seasonPlayer) as CollectionReference<SeasonPlayer>;

        return collectionData(playersRef);
    }

    sort(players: Player[]): Player[] {
        return players.sort((a, b) =>
            a.lastName === b.lastName
                ? a.firstName.localeCompare(b.firstName)
                : a.lastName.localeCompare(b.lastName)
        );
    }
}
