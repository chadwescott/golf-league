import { Match } from "../models/match.model";
import { Players } from "./players";

export const Schedule: Match[] = [
    {
        id: '1',
        week: 1,
        date: new Date('2025-04-09 16:00:00'),
        matchups: [
            {
                team1: [
                    Players[0]
                ],
                team2: [
                    Players[1]
                ],
                scorecardId: '1'
            },
            {
                team1: [
                    Players[2]
                ],
                team2: [
                    Players[3]
                ],
                scorecardId: '2'
            }
        ]
    }
]