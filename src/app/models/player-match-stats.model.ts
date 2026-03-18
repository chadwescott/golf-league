import { ResultType } from "../enums/result.enum"

export interface PlayerMatchStats {
    playerId: string,
    leagueEventId: string,
    eventDate: Date,
    grossScore: number,
    handicap: number,
    netScore: number | null,
    result: ResultType | null,
    albatrosses: number,
    eagles: number,
    birdies: number,
    pars: number,
    bogeys: number,
    doubleBogeys: number,
    others: number,
    doublePars: number,
    fairwaysHit: number,
    grossPoints: number,
    netPoints: number
}