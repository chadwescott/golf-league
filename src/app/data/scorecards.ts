import { ScoreType } from "../models/score-type.enum"
import { Scorecard } from "../models/scorecard.model"
import { Courses } from "./courses"
import { Players } from "./players"


export const Scorecards: Scorecard[] = [
    {
        course: Courses[0],
        holes: Courses[0].holes.slice(0, 9),
        id: '1',
        scores: [
            {
                player: Players[0],
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
                        fairwayHit: true,
                        scoreType: ScoreType.Eagle
                    }
                ],
                handicap: 6.5,
                totalScore: 40
            },
            {
                player: Players[1],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 4,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 4,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 5,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 4,
                        fairwayHit: null,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 4,
                        fairwayHit: null,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 6,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    }
                ],
                handicap: 8.5,
                totalScore: 44
            }
        ]
    }
]