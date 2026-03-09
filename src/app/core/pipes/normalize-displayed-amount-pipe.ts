import { Pipe, PipeTransform } from '@angular/core';
import { MeasuringUnit } from '../models/recipies.models';
import { NormalizeDisplayedAmount } from '../utils/recipy.utils';

@Pipe({
  name: 'normalizeDisplayedAmount'
})
export class NormalizeDisplayedAmountPipe implements PipeTransform {

  transform(realAmount: number, unit: MeasuringUnit): any {
    return NormalizeDisplayedAmount(realAmount, unit);
  }

}
