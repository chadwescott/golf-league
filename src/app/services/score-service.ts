import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable } from 'rxjs';
import { Schedule } from '../data/schedule';
import { Scorecards } from '../data/scorecards';
import { Match } from '../models/match.model';
import { Player } from '../models/player.model';
import { Scorecard } from '../models/scorecard.model';


@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    constructor(private firestore: AngularFirestore) {
        // firestore.collection('scores').doc('9evVqox2CW4bn2Rx24kM').get().subscribe((doc) => {
        //     console.log(doc.data());
        // });
    }

    getPlayers(): Observable<Player[]> {
        return this.firestore.collection<Player>('players').get()
            .pipe(map(collection => collection.docs.map(doc => {
                const player = doc.data();
                player.id = doc.id;
                return player;
            })));
    }

    savePlayers() {
        // console.log(this.firestore.createId());
        // this.firestore.firestore.
    }

    getSchedule(): Match[] {
        return Schedule;
    }

    getScorecard(): Scorecard {
        return Scorecards[0];
    }

    getHandicap(score1: number, score2: number, score3: number, par: number): number {
        return ((Math.floor((score1 + score2 + score3) / 3)) - par) * .95;
    }
}