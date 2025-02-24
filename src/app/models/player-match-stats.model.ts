export interface PlayerMatchStats {
    playerId: string,
    matchId: string,
    totalScore: number,
    handicap: number,
    netScore: number,
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