import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { RecipySorting, RecipySortingDirection } from 'src/app/core/models/filters.models';
import { FiltersService } from '../../filters.service';
import { addIcons } from 'ionicons';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sorting-filter',
  templateUrl: './sorting-filter.component.html',
  imports: [IonSelect, IonSelectOption, IonButton, IonIcon],
  styleUrls: ['./sorting-filter.component.scss'],
})
export class SortingFilterComponent {
  filtersService = inject(FiltersService)
  RecipySortingDirection = RecipySortingDirection;

  sortingOptions = Object.values(RecipySorting).filter(entry => typeof (entry) === 'number');

  sortingDirection = this.filtersService.sortingDirection
  sorting = this.filtersService.sortBy

  constructor() {
    addIcons({ arrowDownOutline, arrowUpOutline });
  }

  getOptionLabel(value: RecipySorting | string): string {
    switch (value) {
      case RecipySorting.Default: return 'датою додавання';
      case RecipySorting.ByActivePreparationTime: return 'активним часом приготування';
      case RecipySorting.ByLastPrepared: return 'останнім приготуванням';
      case RecipySorting.ByTotalPreparationTime: return 'загальним часом приготування';
      default: return ''
    }
  }

  onSortingChange(event: any) {
    this.filtersService.toggleSorting(event.detail.value)
  }

  toggleSortingDirection() {
    this.filtersService.toggleSortingDirection()
  }

}
