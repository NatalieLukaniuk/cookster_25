import { Recipy } from './../../core/models/recipies.models';
import { Component, computed, effect, inject } from '@angular/core';
import { RecipiesService } from 'src/app/core/services/recipies-service';
import { IonList, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonContent } from "@ionic/angular/standalone";
import { RecipyShortViewComponent } from "src/app/generic-components/recipy-short-view/recipy-short-view.component";
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-all-recipies',
  templateUrl: 'all-recipies.page.html',
  styleUrls: ['all-recipies.page.scss'],
  imports: [IonContent, IonInfiniteScrollContent, IonList, IonInfiniteScroll, RecipyShortViewComponent],
})
export class AllRecipiesPage {
  recipiesService = inject(RecipiesService);
  userService = inject(UserService);
  currentUser = this.userService.$currentUser;

  allRecipies = computed(() => this.recipiesService.$allRecipies().filter(recipy => !this.currentUser()?.preferences?.noShowRecipies?.includes(recipy.id)));

  recipiesToDisplay: Recipy[] = [];

  recipiesToDisplayAtOnce = 10;

  constructor() {
    effect(() => {
      if (this.allRecipies().length) {
        this.recipiesToDisplay = []; // [REWORK] todo this logic can be improved not to reset scroll to top
        this.generateItems();
      }
    })
  }

  private generateItems() {
    const count = this.recipiesToDisplay.length + 1;
    for (let i = 0; i < this.recipiesToDisplayAtOnce; i++) {
      this.recipiesToDisplay.push(this.allRecipies()[count + i]);
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
