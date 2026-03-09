import { Component, computed, inject, input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { Recipy } from 'src/app/core/models/recipies.models';
import { UserService } from 'src/app/core/services/user-service';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-recipy-to-no-show',
  templateUrl: './add-recipy-to-no-show.component.html',
  styleUrls: ['./add-recipy-to-no-show.component.scss'],
  imports: [IonButton, IonIcon],
})
export class AddRecipyToNoShowComponent {
  recipy = input.required<Recipy>();
  buttonColor = input('primary');
  isSmall = input(true);

  userService = inject(UserService);
  currentUser = this.userService.$currentUser;

  isHidden = computed(() => {
    if (this.recipy() && this.currentUser()) {
      return this.currentUser()!.preferences?.noShowRecipies?.includes(this.recipy().id)
    }
    return false
  })

  constructor() {
    addIcons({ eyeOffOutline, eyeOutline });
  }

  addToNoShow() {
    this.userService.addRecipyToNoShow(this.recipy())
  }

}
