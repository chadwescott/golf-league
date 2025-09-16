import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

import { Schedule } from '../data/schedule';
import { Scorecards } from '../data/scorecards';
import { Course } from '../models/course.model';
import { HoleScore } from '../models/hole-score.model';
import { Hole } from '../models/hole.model';
import { Match } from '../models/match.model';
import { Player } from '../models/player.model';
import { RoundHoles } from '../models/round-holes.enum';
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

    saveScores(scorecard: Scorecard): void {
        console.log(scorecard);
    }

    createScorecard(course: Course, roundHoles: RoundHoles, date: Date = new Date()): Scorecard {
        let holes: Hole[] = [];
        switch (roundHoles) {
            case RoundHoles.Front:
                holes = course.holes.slice(0, 9);
                break;
            case RoundHoles.Back:
                holes = course.holes.slice(9, 18);
                break;
            default:
                holes = course.holes;
                break;
        }

        return {
            courseId: course.id,
            date: date,
            roundHoles: roundHoles,
            holes: holes,
            id: 'sample-scorecard-id',
            scores: []
        };
    }
}