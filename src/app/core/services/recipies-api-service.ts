import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewRecipy, Recipy } from '../models/recipies.models';
import { map, Observable, tap } from 'rxjs';
import { RecipiesService } from './recipies-service';

@Injectable({
  providedIn: 'root',
})
export class RecipiesApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/recipies`;

  http = inject(HttpClient);
  recipiesService = inject(RecipiesService)

  addRecipy(recipy: NewRecipy): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.url}.json`, recipy);
  }

  updateRecipy(id: string, data: any) {
    return this.http.patch<Recipy>(`${this.url}/${id}.json`, data);
  }

  getRecipies(): Observable<Recipy[]> {
    return this.http.get<Recipy[]>(`${this.url}.json`).pipe(
      map((res: Object) => {
        let array = Object.entries(res);
        let recipies: Recipy[] = [];
        for (let entry of array) {
          let recipy: any = {
            id: entry[0],
            ...entry[1],
          };
          recipies.push(recipy);
        }
        recipies.reverse();
        this.recipiesService.setAllRecipies(recipies);
        return recipies
      })
    );
  }

  getRecipyById(id: string): Observable<Recipy> {
    return this.http.get<Recipy>(`${this.url}/${id}.json`);
  }

  deleteRecipy(id: string) {
    return this.http.delete<Recipy>(`${this.url}/${id}.json`);
  }


}
