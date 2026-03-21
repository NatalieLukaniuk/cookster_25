import { AuthService } from './core/services/auth-service';
import { Component, inject, signal } from '@angular/core';
import { IonApp, IonRouterOutlet, IonList, IonItem, IonImg } from '@ionic/angular/standalone';
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
import { Role } from './core/models/auth.models';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { RecipiesService } from './core/services/recipies-service';
import { ProductsService } from './core/services/products-service';
import { UserService } from './core/services/user-service';
import { FiltersWrapperComponent } from "./features/filters/filters-wrapper/filters-wrapper.component";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: './app.component.scss',
  imports: [IonImg, IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonApp, IonRouterOutlet, RouterModule, IonList, IonItem, FiltersWrapperComponent],
})
export class AppComponent {
  authService = inject(AuthService);
  recipiesService = inject(RecipiesService);
  productsService = inject(ProductsService);
  userService = inject(UserService)

  firebaseConfig = {
    apiKey: 'AIzaSyAYe2tCdCuYoEPi0grZ1PkHTHgScw19LpA',
    authDomain: 'cookster-12ac8.firebaseapp.com',
    databaseURL: 'https://cookster-12ac8-default-rtdb.firebaseio.com',
    projectId: 'cookster-12ac8',
    storageBucket: 'gs://cookster-12ac8.appspot.com/',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:69a08acd3c948e72cf023f',
  };

  isAuthCheckComplete = signal(false);
  isLoggedIn = this.userService.$isAuthorized;

  Role = Role;

  constructor() {
    initializeApp(this.firebaseConfig);
    this.subscribeIsLoggedIn();
    this.loadData()
  }

  loadData() {
    this.recipiesService.loadRecipiesFromBE();
    this.productsService.loadProductsFromBE();
  }

  subscribeIsLoggedIn() {
    getAuth().onAuthStateChanged((user: { email: any; uid: any } | null) => {
      
      // this.isLoggedIn.set(!!user);
      if (user) {
        this.authService.processIsLoggedIn(user);
      } else {
        this.authService.processIsNotLoggedIn();
      }
      this.isAuthCheckComplete.set(true);
    });
  }

  logout() {
    this.authService.logoutUser();
  }
}
