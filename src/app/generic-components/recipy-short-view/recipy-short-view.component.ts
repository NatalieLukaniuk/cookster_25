import { Component, computed, inject, input, signal } from '@angular/core';
import { DishType, Ingredient, MeasuringUnit, MeasuringUnitText, productPreferencesChip, Recipy } from 'src/app/core/models/recipies.models';
import { UserService } from 'src/app/core/services/user-service';
import { IonItemSliding, IonItem, IonItemOptions, IonLabel, IonItemOption, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonCard, IonCardContent, IonImg, IonButton } from "@ionic/angular/standalone";
import { NgTemplateOutlet } from '@angular/common';
import { NormalizeTimePipe } from "../../core/pipes/normalize-time-pipe";

import { addIcons } from 'ionicons';
import { americanFootballOutline, beerOutline, alarm, checkmarkDone, handRight, todayOutline, calendarOutline } from 'ionicons/icons';
import { ImageComponent } from "../image/image.component";
import { DataMappingService } from 'src/app/core/services/data-mapping-service';
import { isDrinkOrSoup } from 'src/app/core/utils/recipy.utils';
import { ConvertToSelectedUnitPipe } from "../../core/pipes/convert-to-selected-unit-pipe";
import { NormalizeDisplayedAmountPipe } from "../../core/pipes/normalize-displayed-amount-pipe";
import { LastPreparedDatePipe } from "../../core/pipes/last-prepared-date-pipe";
import { AddRecipyToNoShowComponent } from "../add-recipy-to-no-show/add-recipy-to-no-show.component";
import { CollectionsActionSheetComponent } from "../collections-action-sheet/collections-action-sheet.component";

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
  imports: [IonButton, IonImg, IonCardContent, IonCard, IonIcon, IonChip, IonCardTitle, IonCardSubtitle, IonCardHeader, IonItemSliding, IonItem, IonItemOptions, NgTemplateOutlet, NormalizeTimePipe, ImageComponent, ConvertToSelectedUnitPipe, NormalizeDisplayedAmountPipe, LastPreparedDatePipe, AddRecipyToNoShowComponent, CollectionsActionSheetComponent],
})
export class RecipyShortViewComponent {
  DishType = DishType;
  MeasuringUnit = MeasuringUnit;
  recipy = input.required<Recipy>();
  productPreferencesChips = input<productPreferencesChip[]>([]) //todo

  datamapping = inject(DataMappingService)

  isRecipyClicked = signal(false);
  isShowCollections = signal(false);

  includedInCollections = computed(() => {
    if (this.currentUser()?.collections) {
      return this.currentUser()!.collections!
        .filter((collection) => collection.recipies?.includes(this.recipy().id))
        .map((coll) => coll.name);
    } else return [];
  })

  isShowProductsWarning = computed(() => this.productPreferencesChips()?.find(product => this.recipy().ingrediends.some(ingred => ingred.product === product.productId))
  )

  activePreparationTime = computed(() => {
    let time = 0;
    for (let step of this.recipy().steps) {
      time = time + +step.timeActive;
    }
    return time;
  })

  passivePreparationTime = computed(() => {
    let time = 0;
    for (let step of this.recipy().steps) {
      time = time + +step.timePassive;
    }
    return time;
  })

  isNeedsAdvancePreparation = computed(() => this.recipy().type?.includes(
    DishType['потребує попередньої підготовки']
  ))

  isApprovedRecipy = computed(() => !this.recipy().notApproved)

  userService = inject(UserService);
  currentUser = this.userService.$currentUser;

  Math = Math;

  coefficient = computed(() => this.datamapping.getCoeficient(
    this.recipy().ingrediends,
    1,
    this.recipy().portionSize || 1,
    isDrinkOrSoup(this.recipy())
  ))

  constructor() {
    addIcons({ americanFootballOutline, beerOutline, alarm, checkmarkDone, handRight, todayOutline, calendarOutline });
  }

  onRecipyClicked() {
    if (this.isShowCollections() && this.isRecipyClicked()) {
      this.isShowCollections.set(true);
      this.isRecipyClicked.set(false);
    } else if (this.isShowCollections() && !this.isRecipyClicked()) {
      this.isShowCollections.set(false);
    } else {
      this.isRecipyClicked.update(value => !value);
    }
  }

  getProductText(id: string) {
    return this.datamapping.getProductNameById(id)
  }

  getIsInRecipy(productId: string) {
    return !!this.recipy().ingrediends.find(ingred => ingred.product === productId);
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  onAddRecipyToCalendar() {

  }

  goFullRecipy() { }
  
  cancelClickNoTimeout() {
    this.isRecipyClicked.set(false);
  }

}
