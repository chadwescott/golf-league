export interface PlayerScorecard {
    scorecardId: string,
    playerScoresId: string,
    roundDate: Date,
    grossScore: number | null,
    netScore: number | null
}