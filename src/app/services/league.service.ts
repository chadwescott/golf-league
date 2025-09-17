import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

import { LeaguePlayer } from '../models/league-player.model';
import { LeagueYearPlayer } from '../models/league-year-player.model';
import { LeagueYear } from '../models/league-year.model';
import { League } from '../models/league.model';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class LeagueService {
    leagues$ = new BehaviorSubject<League[]>([]);
    leagueYears$ = new BehaviorSubject<LeagueYear[]>([]);
    leaguePlayers$ = new BehaviorSubject<Player[]>([]);
    leagueYearPlayers$ = new BehaviorSubject<Player[]>([]);

    constructor(private firestore: AngularFirestore) {
    }

    getLeagues(): Observable<League[]> {
        return this.firestore.collection<League>('leagues').get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const league = doc.data();
                    league.id = doc.id;
                    return league;
                }),
                ),
                map(leagues => leagues.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)),
                tap((leagues) => this.leagues$.next(leagues))
            );
    }

    addLeague(league: League): void {
        this.firestore.collection<League>('leagues').add(league)
            .then((doc) => {
                league.id = doc.id;
                this.leagues$.next([...this.leagues$.value, league]);
            });
    }

    getLeagueYears(leagueId: string): Observable<LeagueYear[]> {
        return this.firestore.collection<LeagueYear>('league-years', ref => ref.where('leagueId', '==', leagueId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const year = doc.data();
                    year.id = doc.id;
                    return year;
                }),
                ),
                map(years => years.sort((a, b) => a.year < b.year ? 1 : a.year > b.year ? -1 : 0)),
                tap((years) => this.leagueYears$.next(years))
            );
    }

    addLeagueYear(leagueYear: LeagueYear): void {
        this.firestore.collection<LeagueYear>('league-years').add(leagueYear)
            .then((doc) => {
                leagueYear.id = doc.id;
                this.leagueYears$.next([...this.leagueYears$.value, leagueYear]);
            });
    }

    getLeaguePlayers(leagueId: string): Observable<Player[]> {
        return this.firestore.collection<LeaguePlayer>('league-players', ref => ref.where('leagueId', '==', leagueId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const lp = doc.data();
                    lp.id = doc.id;
                    return lp;
                }),
                ),
                switchMap(leaguePlayers => {
                    const playerIds = leaguePlayers.map(lp => lp.playerId);
                    if (playerIds.length === 0) {
                        return [[]];
                    }
                    return this.firestore.collection<Player>('players', ref => ref.where('id', 'in', playerIds)).get()
                        .pipe(
                            map(collection => collection.docs.map(doc => {
                                const player = doc.data();
                                player.id = doc.id;
                                return player;
                            })),
                            map(players => players.sort((a, b) => a.lastName.localeCompare(b.lastName))),
                            tap(players => this.leaguePlayers$.next(players))
                        );
                })
            );
    }

    getLeagueYearPlayers(leagueYearId: string): Observable<Player[]> {
        return this.firestore.collection<LeagueYearPlayer>('league-year-players', ref => ref.where('leagueYearId', '==', leagueYearId)).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const lyp = doc.data();
                    lyp.id = doc.id;
                    return lyp;
                }),
                ),
                switchMap(lyp => {
                    const playerIds = lyp.map(lp => lp.playerId);
                    if (playerIds.length === 0) {
                        return [[]];
                    }
                    return this.firestore.collection<Player>('players', ref => ref.where('id', 'in', playerIds)).get()
                        .pipe(
                            map(collection => collection.docs.map(doc => {
                                const player = doc.data();
                                player.id = doc.id;
                                return player;
                            })),
                            map(players => players.sort((a, b) => a.lastName.localeCompare(b.lastName))),
                            tap(players => this.leagueYearPlayers$.next(players))
                        );
                })
            );
    }
}
