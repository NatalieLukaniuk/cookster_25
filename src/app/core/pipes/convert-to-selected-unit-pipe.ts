import { inject, Pipe, PipeTransform } from '@angular/core';
import { DataMappingService } from '../services/data-mapping-service';
import { MeasuringUnit } from '../models/recipies.models';
import { convertAmountToSelectedUnit } from '../utils/recipy.utils';

@Pipe({
  name: 'convertToSelectedUnit'
})
export class ConvertToSelectedUnitPipe implements PipeTransform {
  datamapping = inject(DataMappingService)

  transform(
    amountInGr: number,
    ingredientId: string,
    selectedUnit: MeasuringUnit
  ): any {
    return convertAmountToSelectedUnit(
      amountInGr,
      selectedUnit,
      ingredientId,
      this.datamapping.$allProducts()
    );
  }

}
