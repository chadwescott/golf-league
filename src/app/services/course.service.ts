import { Injectable, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';

import { Course } from '../models/course.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    courses = signal<Course[]>([]);
    leagueCourses = signal<Course[]>([])
    leagueSeasonCourses = signal<Course[]>([]);

    constructor(private readonly firestore: AngularFirestore, private readonly appStateService: AppStateService) {
    }

    getCourses(): Observable<Course[]> {
        return this.firestore.collection<Course>(FirestorePaths.courses).get()
            .pipe(
                map(collection => collection.docs.map(doc => {
                    const course = doc.data();
                    course.id = doc.id;
                    return course;
                })),
                tap((courses) => this.courses.set(courses))
            );
    }

    addCourse(course: Course): Promise<Course> {
        return this.firestore.collection<Course>(FirestorePaths.courses).add(course)
            .then((doc) => {
                return doc.get().then(snap => {
                    const created = (snap.data() as Course) ?? { ...course };
                    created.id = snap.id; this.courses.update(prev => {
                        return [...prev, created];
                    });
                    return created;
                });
            });

    }

    updateCourse(course: Course): Promise<Course> {
        if (!course.id) {
            return Promise.reject(new Error('Course ID is required for update.'));
        }
        return this.firestore.doc<Course>(`${FirestorePaths.courses}/${course.id}`)
            .update(course)
            .then(() => {
                this.courses.update(prev => {
                    const idx = prev.findIndex(p => p.id === course.id);
                    if (idx === -1) return prev;
                    const next = [...prev];
                    next[idx] = { ...course };
                    return next;
                });
                return course;
            });
    }

    deleteCourse(courseId: string): Promise<void> {
        return this.firestore.doc(`${FirestorePaths.courses}/${courseId}`).delete();
    }
}

