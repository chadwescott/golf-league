import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';


import { doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { Course } from '../models/course.model';
import { AppStateService } from './app-state.service';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private readonly appStateService = inject(AppStateService);
    private readonly firestore = inject(Firestore);
    private readonly courseCache: Course[] = [];
    private readonly courseKey = 'courses';


    constructor() {
        this.appStateService.loadDataFromStorage<Course[]>(this.courseKey)?.map(course => this.courseCache.push(course));
    }

    readonly courseConverter: FirestoreDataConverter<Course> = {
        toFirestore(course: Course) {
            return {
                id: course.id,
                name: course.name,
                holes: course.holes.map(hole => {
                    return {
                        holeNumber: hole.holeNumber,
                        par: hole.par,
                        handicap: hole.handicap
                    };
                })
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Course {
            const data = snapshot.data(options) as Omit<Course, 'id'>;
            return { id: snapshot.id, ...data };
        },
    };

    getCourseById(courseId: string): Observable<Course | undefined> {
        const cachedCourse = this.courseCache.find(course => course.id === courseId);
        if (cachedCourse) {
            return of(cachedCourse);
        }

        const courseRef = doc(this.firestore, `courses/${courseId}`).withConverter(this.courseConverter);
        return from(getDoc(courseRef)).pipe(
            map(snap => {
                if (snap.exists()) {
                    const course = snap.data();
                    this.courseCache.push(course);
                    this.appStateService.saveDataToStorage(this.courseKey, this.courseCache);
                    return course;
                } else {
                    return undefined;
                }
            }));
    }
}

