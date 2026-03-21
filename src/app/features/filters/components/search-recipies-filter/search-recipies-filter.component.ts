import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from "@ionic/angular/standalone";
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { FiltersService } from '../../filters.service';

@Component({
  selector: 'app-search-recipies-filter',
  templateUrl: './search-recipies-filter.component.html',
  imports: [IonSearchbar],
  styleUrls: ['./search-recipies-filter.component.scss'],
})
export class SearchRecipiesFilterComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  filtersService = inject(FiltersService)

  @ViewChild('searchbar') searchbar: IonSearchbar | undefined;

  searchInput$ = new BehaviorSubject<string>('')

  value = '';

  sub = new Subscription();

  constructor() {
    this.destroyRef.onDestroy(() => this.sub.unsubscribe())
  }

  ngOnInit() {
    this.value = this.filtersService.searchFiltersValue();
    this.sub.add(this.searchInput$.pipe(
      debounceTime(100)
    ).subscribe(searchKey => {
      this.filtersService.toggleSearch(searchKey);
    }))

  }

  onSearch(event: any) {
    this.searchInput$.next(event.detail.value)
  }

  clear() {
    this.searchInput$.next('')
  }

}
