import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { IonButton, IonActionSheet, IonIcon } from "@ionic/angular/standalone";
import { Recipy } from 'src/app/core/models/recipies.models';
import { UserService } from 'src/app/core/services/user-service';
import { ActionSheetButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmarksOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-collections-action-sheet',
  templateUrl: './collections-action-sheet.component.html',
  styleUrls: ['./collections-action-sheet.component.scss'],
  imports: [IonIcon, IonActionSheet, IonButton],
})
export class CollectionsActionSheetComponent {
  recipy = input.required<Recipy>();
  buttonTitle = input('');
  buttonColor = input('primary');
  isIconPresentation = input(true);

  userService = inject(UserService);
  currentUser = this.userService.$currentUser;

  dismissed = output<void>()

  collectionList = computed<ActionSheetButton[]>(() => {
    if (this.currentUser()?.collections) {
      return this.currentUser()!.collections!.map((collection) => ({
        text: collection.name,
        role: 'selected',
        data: {
          collection: collection.name
        },
        icon: this.getIsInCollection(collection.name) ? "checkmark-outline" : ""
      }));
    } else return [];
  })

  constructor(){
    addIcons({ bookmarksOutline, checkmarkOutline });
  }

  getIsInCollection(collection: string) {
    if (this.currentUser()?.collections) {
      return this.currentUser()!.collections!
        .find((coll) => coll.name == collection)
        ?.recipies?.find((recipy) => recipy == this.recipy().id);
    } else return false;
  }

  onDismissed(event: any) {    
    const selected = event.detail.data?.collection;
    if(selected){
      this.onCollectionSelected(selected)
    }
    this.dismissed.emit()    
  }

  onCollectionSelected(collection: string){
    this.userService.toggleRecipyInCollection(this.recipy().id, collection)
  }

}
