import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, IonModal, IonHeader, IonTitle, IonContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { filterOutline } from 'ionicons/icons';
import { FiltersService } from '../filters.service';
import { RecipiesService } from 'src/app/core/services/recipies-service';
import { SearchRecipiesFilterComponent } from '../components/search-recipies-filter/search-recipies-filter.component';

@Component({
  selector: 'app-filters-wrapper',
  templateUrl: './filters-wrapper.component.html',
  imports: [IonContent, IonTitle, IonHeader, IonModal, IonButton, IonIcon, SearchRecipiesFilterComponent],
  styleUrls: ['./filters-wrapper.component.scss'],
})
export class FiltersWrapperComponent {
  filtersService = inject(FiltersService);
  recipiesService = inject(RecipiesService)

  constructor() {
    addIcons({ filterOutline });
  }

}
