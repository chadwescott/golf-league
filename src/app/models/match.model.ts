import { Matchup } from "./matchup.model";

export interface Match {
    id: string,
    week: number,
    date: Date,
    matchups: Matchup[]
}