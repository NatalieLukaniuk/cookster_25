import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'all-recipies',
    loadComponent: () => import('./pages/all-recipies-page/all-recipies.page').then((m) => m.AllRecipiesPage),
  },
  {
    path: '',
    redirectTo: 'all-recipies',
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.page').then( m => m.CalendarPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  }
];
