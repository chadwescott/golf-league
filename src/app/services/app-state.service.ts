import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    loadDataFromStorage<T>(key: string): T | null {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) as T : null;
    }

    saveDataToStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }
}