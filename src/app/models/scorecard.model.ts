import { PlayerScores } from "./player-scores.model";

export interface Scorecard {
    id: string,
    scores: PlayerScores[]
}