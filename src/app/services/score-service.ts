import { Injectable } from "@angular/core";
import { Schedule } from "../data/schedule";
import { Scorecards } from "../data/scorecards";
import { Match } from "../models/match.model";
import { PlayerScores } from "../models/player-scores.model";

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    getSchedule(): Match[] {
        return Schedule;
    }

    getScorecard(): PlayerScores {
        return Scorecards;
    }

    getHandicap(score1: number, score2: number, score3: number, par: number): number {
        return ((Math.floor((score1 + score2 + score3) / 3)) - par) * .95;
    }
}