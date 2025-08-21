import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

import { Schedule } from '../data/schedule';
import { Scorecards } from '../data/scorecards';
import { HoleScore } from '../models/hole-score.model';
import { Match } from '../models/match.model';
import { Player } from '../models/player.model';
import { ScoreType } from '../models/score-type.enum';
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

    getPoints(scores: HoleScore[]): number {
        let points = 0;
        scores.forEach(score => {
            if (score.fairwayHit) {
                points++;
            }

            switch (score.scoreType) {
                case ScoreType.Eagle:
                    points += 4;
                    break;
                case ScoreType.Birdie:
                    points += 3;
                    break;
                case ScoreType.Par:
                    points += 2;
                    break;
                case ScoreType.Bogey:
                    points += 1;
                    break;
                default:
                    break;
            }
        });

        return points;
    }

    getHandicap(scores: number[], par: number): number {
        return ((Math.floor((scores.reduce((acc, curr) => acc + curr)) / scores.length)) - par) * .95;
    }
}