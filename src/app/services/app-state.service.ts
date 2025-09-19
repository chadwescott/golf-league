import { Injectable, signal } from '@angular/core';
import { LeagueEvent } from '../models/league-event.model';
import { League } from '../models/league.model';
import { Player } from '../models/player.model';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  activeLeague = signal<League | null>(null);
  activeLeagueEvent = signal<LeagueEvent | null>(null);
  activeLeagueYear = signal<Season | null>(null);
  activePlayers = signal<Player[] | null>(null);

  private readonly _leagueKey = 'league';
  private readonly _leagueEventKey = 'league-event';
  private readonly _leagueYearKey = 'league-year';
  private readonly _playersKey = 'players';

  constructor() {
    this.activeLeague.set(this.loadDataFromStorage<League>(this._leagueKey));
    this.activeLeagueEvent.set(this.loadDataFromStorage<LeagueEvent>(this._leagueEventKey));
    this.activeLeagueYear.set(this.loadDataFromStorage<Season>(this._leagueYearKey));
    this.activePlayers.set(this.loadDataFromStorage<Player[]>(this._playersKey));
  }

  loadDataFromStorage<T>(key: string): T | null {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) as T : null;
  }

  setActiveLeague(league: League | null): void {
    this.activeLeague.set(league);
    if (league) {
      localStorage.setItem(this._leagueKey, JSON.stringify(league));
    } else {
      localStorage.removeItem(this._leagueKey);
    }
  }

  setActiveLeagueEvent(leagueEvent: LeagueEvent | null): void {
    this.activeLeagueEvent.set(leagueEvent);
    localStorage.setItem(this._leagueEventKey, JSON.stringify(leagueEvent));
  }

  setActiveLeagueYear(leagueYear: Season | null): void {
    this.activeLeagueYear.set(leagueYear);
    localStorage.setItem(this._leagueYearKey, JSON.stringify(leagueYear));
  }

  setActivePlayers(players: Player[] | null): void {
    this.activePlayers.set(players);
    localStorage.setItem(this._leagueKey, JSON.stringify(players));
  }
}
