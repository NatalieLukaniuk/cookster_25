import { clearedFilters, Filters, RecipySorting, RecipySortingDirection } from './../../core/models/filters.models';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private filter = signal<Filters>(clearedFilters);
  currentFilters = this.filter.asReadonly()

  searchFiltersValue = computed(() => this.filter().search)
  sortingDirection = computed(() => this.filter().sortingDirection);
  sortBy = computed(() => this.filter().sorting)

  clearFilters() {
    this.filter.set(clearedFilters)
  }

  toggleSearch(word: string) {
    this.filter.update(value => ({ ...value, search: word }))
  }

  toggleSorting(sortingValue: RecipySorting) {
    this.filter.update(value => ({ ...value, sorting: sortingValue }))
  }

  toggleSortingDirection() {
    const currentDirection = this.filter().sortingDirection;
    if (currentDirection === RecipySortingDirection.SmallToBig) {
      this.filter.update(value => ({ ...value, sortingDirection: RecipySortingDirection.BigToSmall }))
    } else {
      this.filter.update(value => ({ ...value, sortingDirection: RecipySortingDirection.SmallToBig }))
    }
  }

}
