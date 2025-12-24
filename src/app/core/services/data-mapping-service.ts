import { inject, Injectable } from '@angular/core';
import { ProductsService } from './products-service';
import { Ingredient, MeasuringUnit } from '../models/recipies.models';
import { getCalorificValue, getDefaultMeasuringUnit, getIngredientText, getProductById, getProductIdByName, getProductText, isIngrIncludedInAmountCalculation, transformToGr } from '../utils/recipy.utils';

@Injectable({
  providedIn: 'root',
})
export class DataMappingService {

  productsService = inject(ProductsService)

  $allProducts = this.productsService.$allProducts;
  
  getIngredientText(ingr: Ingredient): string {
    return getIngredientText(ingr, this.$allProducts());
  }

  getProductNameById(id: string): string {
    return getProductText(id, this.$allProducts());
  }

  getProductIdByName(name: string){
    return getProductIdByName(name, this.$allProducts());
  }

  getProductById(id: string){
    return getProductById(id, this.$allProducts())
  }

  getDefaultMU(id: string): MeasuringUnit {
    return getDefaultMeasuringUnit(id, this.$allProducts());
  }

  getIsIngredientInDB(id: string) {
    return this.$allProducts().find((ingr) => ingr.id == id);
  }

  getIsIngredientIncludedInAmountCalculation(ingr: Ingredient, isDrinkOrSoup: boolean): boolean {
    return isIngrIncludedInAmountCalculation(ingr, this.$allProducts(), isDrinkOrSoup);
  }

  getCoeficient(
    ingredients: Ingredient[],
    portionsToServe: number,
    portionSize: number,
    isDrinkOrSoup: boolean
  ) {
    let amount = 0;
    for (let ingr of ingredients) {
      if (
        this.getIsIngredientInDB(ingr.product) &&
        this.getIsIngredientIncludedInAmountCalculation(ingr, isDrinkOrSoup)
      ) {
        amount = ingr.amount * this.getAmountChangeCoef(ingr.product) + amount; // amount of ingreds with calories
      }
    }

    return (portionsToServe * portionSize) / amount;
  }

  getAmountChangeCoef(ingrId: string): number {
    return this.$allProducts().find((item) => ingrId === item.id)!
      .sizeChangeCoef;
  }

  transformToGr(ingrId: string, amount: number, unit: MeasuringUnit) {
    return transformToGr(ingrId, amount, unit, this.$allProducts());
  }

  countRecipyCalorificValue(ingreds: Ingredient[]) {
    let calories = 0;
    let totalAmount = 0;
    ingreds.forEach((ingr) => {
      totalAmount += ingr.amount;
      calories += ingr.amount * getCalorificValue(ingr, this.$allProducts());
    });
    return calories / totalAmount;
  }

  countRecipyTotalCalories(ingreds: Ingredient[]){
    let calories = 0;
    ingreds.forEach((ingr) => {
      calories += ingr.amount / 100 * getCalorificValue(ingr, this.$allProducts());
    });
    return calories;
  }

  getIngredientType(ingrId: string){
    return this.$allProducts().find((item) => ingrId === item.id)!
    .type;
  }
}
