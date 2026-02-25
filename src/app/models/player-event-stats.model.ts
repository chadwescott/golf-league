import { ResultType } from "../enums/result.enum"

export interface PlayerEventStats {
    playerId: string,
    leagueEventId: string,
    eventDate: Date,
    grossScore: number,
    handicap: number,
    netScore: number,
    result: ResultType | null,
    albatrosses: number,
    eagles: number,
    birdies: number,
    pars: number,
    bogeys: number,
    doubleBogeys: number,
    others: number,
    fairwaysHit: number,
    points: number
}