import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Schedule } from '../data/schedule';
import { Scorecards } from '../data/scorecards';
import { Match } from '../models/match.model';
import { Scorecard } from '../models/scorecard.model';


@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    constructor(private firestore: AngularFirestore) {
        firestore.collection('scores').doc('9evVqox2CW4bn2Rx24kM').get().subscribe((doc) => {
            console.log(doc.data());
        });
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