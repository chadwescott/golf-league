import { ScoreType } from '../models/score-type.enum';
import { Scorecard } from '../models/scorecard.model';
import { Courses } from './courses';
import { Players } from './players';


export const Scorecards: Scorecard[] = [
    {
        course: Courses[0],
        date: new Date('5/8/2025'),
        holes: Courses[0].holes.slice(0, 9),
        id: '1',
        scores: [
            {
                player: Players[0],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 4,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 3,
                        fairwayHit: true,
                        scoreType: ScoreType.Birdie
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 7,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 4,
                        fairwayHit: null,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 4,
                        fairwayHit: null,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    }
                ],
                handicap: 0,
                totalScore: 47
            },
            {
                player: Players[2],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
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
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 6,
                        fairwayHit: null,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 6,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    }
                ],
                handicap: 0,
                totalScore: 49
            },
            {
                player: Players[1],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 5,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 8,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 3,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 4,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 3,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 8,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 51
            },
            {
                player: Players[8],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 8,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 5,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
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
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 6,
                        fairwayHit: null,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    }
                ],
                handicap: 0,
                totalScore: 52
            },
            {
                player: Players[9],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 7,
                        fairwayHit: true,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 4,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 7,
                        fairwayHit: null,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 6,
                        fairwayHit: null,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 7,
                        fairwayHit: true,
                        scoreType: ScoreType.DoubleBogey
                    }
                ],
                handicap: 0,
                totalScore: 53
            },
            {
                player: Players[11],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 5,
                        fairwayHit: false,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 7,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 6,
                        fairwayHit: null,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 6,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 6,
                        fairwayHit: true,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 4,
                        fairwayHit: null,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 7,
                        fairwayHit: true,
                        scoreType: ScoreType.DoubleBogey
                    }
                ],
                handicap: 0,
                totalScore: 53
            },
            {
                player: Players[4],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 55
            },
            {
                player: Players[10],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 61
            },
            {
                player: Players[5],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 63
            },
            {
                player: Players[12],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 67
            },
            {
                player: Players[7],
                holeScores: [
                    {
                        hole: Courses[0].holes[0],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[1],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Bogey
                    },
                    {
                        hole: Courses[0].holes[2],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[3],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.Other
                    },
                    {
                        hole: Courses[0].holes[4],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[5],
                        score: 0,
                        fairwayHit: false,
                        scoreType: ScoreType.DoubleBogey
                    },
                    {
                        hole: Courses[0].holes[6],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[7],
                        score: 0,
                        fairwayHit: null,
                        scoreType: ScoreType.Par
                    },
                    {
                        hole: Courses[0].holes[8],
                        score: 0,
                        fairwayHit: true,
                        scoreType: ScoreType.Other
                    }
                ],
                handicap: 0,
                totalScore: 70
            }
        ]
    }
]