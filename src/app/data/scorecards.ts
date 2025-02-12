import { PlayerScores } from "../models/player-scores.model"
import { ScoreType } from "../models/score-type.enum"
import { Courses } from "./courses"


export const Scorecards: PlayerScores = {
    player: {
        id: '1',
        firstName: 'Chad',
        lastName: 'Wescott',
        email: 'test@gmail.com',
        phone: '555-555-5555',
        imagePath: ''
    },
    holeScores: [
        {
            hole: Courses[0].holes[0],
            score: 5,
            fairwayHit: true,
            scoreType: ScoreType.Par
        },
        {
            hole: Courses[0].holes[1],
            score: 5,
            fairwayHit: false,
            scoreType: ScoreType.Bogey
        },
        {
            hole: Courses[0].holes[2],
            score: 3,
            fairwayHit: true,
            scoreType: ScoreType.Birdie
        },
        {
            hole: Courses[0].holes[3],
            score: 6,
            fairwayHit: false,
            scoreType: ScoreType.DoubleBogey
        },
        {
            hole: Courses[0].holes[4],
            score: 3,
            fairwayHit: null,
            scoreType: ScoreType.Par
        },
        {
            hole: Courses[0].holes[5],
            score: 7,
            fairwayHit: false,
            scoreType: ScoreType.Other
        },
        {
            hole: Courses[0].holes[6],
            score: 5,
            fairwayHit: false,
            scoreType: ScoreType.Bogey
        },
        {
            hole: Courses[0].holes[7],
            score: 3,
            fairwayHit: null,
            scoreType: ScoreType.Par
        },
        {
            hole: Courses[0].holes[8],
            score: 3,
            fairwayHit: false,
            scoreType: ScoreType.Eagle
        }
    ],
    totalScore: 40
}