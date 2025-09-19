import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';

import { League } from '../models/league.model';
import { Season } from '../models/season.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class LeagueService {
    leagues = signal<League[]>([]);
    seasons = signal<Season[]>([]);

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
                tap((leagues) => this.leagues.set(leagues))
            );
    }

    getLeague(id: string): Observable<League | null> {
        return this.firestore.doc<League>(`${FirestorePaths.leagues}/${id}`).get()
            .pipe(
                map(doc => {
                    const league = doc.data();
                    if (!league) { return null; }
                    league.id = doc.id;
                    return league;
                })
            );
    }

    addLeague(league: League): void {
        this.firestore.collection<League>(FirestorePaths.leagues).add(league)
            .then((doc) => {
                league.id = doc.id;
                this.leagues.update(l => [...l, league]);
            });
    }

    getSeasons(leagueId: string): Observable<Season[]> {
        return this.firestore.collection<Season>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const year = doc.data();
                    year.id = doc.id;
                    return year;
                }),
                ),
                map(years => years.sort((a, b) => a.year < b.year ? 1 : a.year > b.year ? -1 : 0)),
                tap((years) => this.seasons.set(years))
            );
    }

    addSeason(leagueId: string, season: Season): void {
        this.firestore.collection<Season>(`${FirestorePaths.leagues}/${leagueId}/${FirestorePaths.seasons}`).add(season)
            .then((doc) => {
                season.id = doc.id;
                this.seasons.update(ly => [...ly, season]);
            });
    }
}
