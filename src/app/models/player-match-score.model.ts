export interface PlayerMatchScore {
    playerId: string,
    handicap: number | null,
    inScore: number | null,
    outScore: number | null,
    grossScore: number | null,
    netScore: number | null,
    fairwaysHit: number | null,
    albatrosses: number | null,
    eagles: number | null,
    birdies: number | null,
    pars: number | null,
    bogeys: number | null,
    doubleBogeysOrWorse: number | null,
    points: number | null
}
