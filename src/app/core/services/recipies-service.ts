import { inject, Injectable, signal } from '@angular/core';
import { NewRecipy, Recipy } from '../models/recipies.models';
import { RecipiesApiService } from './recipies-api-service';
import { DataMappingService } from './data-mapping-service';
import { UiService } from './ui-service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  recipiesApi = inject(RecipiesApiService);
  dataMapping = inject(DataMappingService);
  uiService = inject(UiService);

  private $recipies = signal<Recipy[]>([]);
  $allRecipies = this.$recipies.asReadonly();

  private setAllRecipies(recipies: Recipy[]) {
    this.$recipies.set(recipies)
  }

  private updateAllRecipies(recipyToUpdate: Recipy) { // should be used when new recipy is added or existing is updated
    this.$recipies.update(recipies => {
      if (recipies.find(recipy => recipy.id === recipyToUpdate.id)) {
        const updated = recipies.map(recipy => {
          if (recipy.id === recipyToUpdate.id) {
            return recipyToUpdate
          } else return recipy
        }

        );
        return updated
      } else {
        return recipies.concat(recipyToUpdate)
      }
    })
  }

  private updateAllRecipiesOnRecipyDeleted(recipyToRemove: Recipy) {
    this.$recipies.update(recipies => recipies.filter(recipy => recipy.id !== recipyToRemove.id))
  }

  loadRecipiesFromBE(): void {
    this.recipiesApi.getRecipies().pipe(
      take(1),
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
        return recipies;
      })
    ).subscribe(
      res => {
        this.setAllRecipies(res);

      }
    )

  }

  updateRecipy(recipy: Recipy): void {
    this.uiService.setIsLoading(true)
    let updated = {
      ...recipy,
      calorificValue: this.dataMapping.countRecipyCalorificValue(
        recipy.ingrediends
      ),
    };
    this.recipiesApi.updateRecipy(recipy.id, updated).pipe(
      take(1)
    ).subscribe(res => {
      this.updateAllRecipies(updated)
      this.uiService.setIsLoading(false)
    })
  }

  addNewRecipy(recipy: NewRecipy): void {
    this.uiService.setIsLoading(true)
    const updated = {
      ...recipy,
      calorificValue: this.dataMapping.countRecipyCalorificValue(
        recipy.ingrediends
      ),
    }
    this.recipiesApi.addRecipy(updated).pipe(take(1)).subscribe(res => {
      let recipyWithId: Recipy = {
        ...updated,
        id: res.name,
      };
      this.updateAllRecipies(recipyWithId)
      this.uiService.setIsLoading(false)
    })
  }

  getRecipyById(id: string): Observable<Recipy> {
    return this.recipiesApi.getRecipyById(id).pipe(take(1))
  }

  deleteRecipy(id: string) {
    this.uiService.setIsLoading(true)
    this.recipiesApi.deleteRecipy(id).pipe(take(1)).subscribe((recipy) => {
      //TODO hasn't been used, need to check what is returned
      this.updateAllRecipiesOnRecipyDeleted(recipy)
      this.uiService.setIsLoading(false)
    })
  }
}
