import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { LeagueYear } from '../models/league-year.model';
import { League } from '../models/league.model';

@Injectable({
    providedIn: 'root'
})
export class LeagueService {
    leagues$ = new BehaviorSubject<League[]>([]);
    leagueYears$ = new BehaviorSubject<LeagueYear[]>([]);

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
                tap((years) => console.log(years)),
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
}
