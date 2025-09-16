import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    players$ = new BehaviorSubject<Player[]>([]);

    constructor(private firestore: AngularFirestore) {
    }

    getPlayers(): Observable<Player[]> {
        return this.firestore.collection<Player>('players').get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const player = doc.data();
                    player.id = doc.id;
                    return player;
                })),
                tap((players) => this.players$.next(players))
            );
    }

    addPlayer(player: Player): void {
        this.firestore.collection<Player>('players').add(player);
    }
}
