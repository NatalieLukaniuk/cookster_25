import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonList, IonItem } from '@ionic/angular/standalone';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonApp, IonRouterOutlet, RouterModule, IonList, IonItem],
})
export class AppComponent {
  constructor() {}
}
