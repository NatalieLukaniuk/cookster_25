import { clearedFilters, Filters } from './../../core/models/filters.models';
import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private filter = signal<Filters>(clearedFilters);
  currentFilters = this.filter.asReadonly()

  searchFiltersValue = computed(() => this.filter().search)

  clearFilters() {
    this.filter.set(clearedFilters)
  }

  toggleSearch(word: string) {
    this.filter.update(value => ({ ...value, search: word }))
  }

}
