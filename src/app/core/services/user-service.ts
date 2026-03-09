import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { defaultPrefs, User, UserMappingItem } from '../models/auth.models';
import { AuthApiService } from './auth-api-service';
import { take } from 'rxjs';
import { CalendarRecipyInDatabase_Reworked } from '../models/calendar.models';
import { Recipy } from '../models/recipies.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  authApiService = inject(AuthApiService)

  private currentUser = signal<User | null>(null);
  private allUsers = signal<User[] | undefined>(undefined);
  userAtFirebaseAuth = signal<User | undefined>(undefined);

  $currentUser = this.currentUser.asReadonly();
  $isAuthorized = computed(() => !!this.currentUser());


  logOut() {
    this.currentUser.set(null)
  }

  private currentUserId: Signal<string | null> = computed(() => {
    const currentUser = this.currentUser()
    if (!!currentUser && currentUser.id) {
      return currentUser.id
    } else {
      return null
    }
  });

  plannedRecipies: Signal<CalendarRecipyInDatabase_Reworked[]> = computed(() => {
    const currentUser = this.currentUser();
    if (currentUser && currentUser.plannedRecipies) {
      return currentUser.plannedRecipies
    } else {
      return []
    }
  })

  private allUsersMapping = signal<UserMappingItem[]>([]);

  getUserData(user: User) {
    this.authApiService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((userMappingData: UserMappingItem[]) => {
        this.allUsersMapping.set(userMappingData);
        const found = userMappingData.find(fbUser => fbUser.firebaseId === user.uid);
        if (found) {
          this.getCurrentUserData(found.cooksterId);
          // this.expApi.userCooksterId = found.cooksterId;
          // this.expApi.getExpenses().pipe(take(1)).subscribe(res => {
          //   this.store.dispatch(new ExpensesLoadedAction(res?.expenses || []))
          // })
        } else {
          // TODO this.store.dispatch(new UIActions.ErrorAction('no such user found'));
        }
      })
  }

  getCurrentUserData(cooksterId: string) {
    this.authApiService.getUser(cooksterId).pipe(take(1)).subscribe(user => {
      this.currentUser.set(user);
      if (!this.currentUser()?.id) {
        this.currentUser.update((user: User | null) => {
          if (user) {
            const updated: User = { ...user, id: cooksterId }
            return updated
          } else {
            return user
          }

        });
      }
    })
  }

  addUser(auth: any) {
    let user = {
      email: auth.currentUser?.email,
      recipies: [],
      uid: auth.currentUser?.uid,
    };
    this.authApiService
      .addUser(user)
      .pipe(take(1))
      .subscribe((res) => {
        const userToAdd = {
          email: user.email,
          firebaseId: user.uid,
          cooksterId: res.name
        }
        this.allUsersMapping.update(currentValue => currentValue.concat(userToAdd))
        let updatedUsers: UserMappingItem[] = this.allUsersMapping()
        this.authApiService.addNewUser(updatedUsers).pipe(take(1)).subscribe(() => {
          // this.store.dispatch(
          //   new UIActions.ShowSuccessMessageAction(
          //     'Your registration was successful'
          //   )
          // );
          this.getCurrentUserData(res.name);
        })
      });
  }

  // updateUserDetailsFromMyDatabase(newData: any) {
  //   const currentUser = this.currentUser();
  //   if (currentUser.id) {
  //     return this.authApiService.updateUser(this.currentUser.id, newData);
  //   } else {
  //     return of(null);
  //   }
  // }

  addRecipyToNoShow(recipy: Recipy) {
    const currentUser = this.currentUser()
    if (currentUser) {
      if (!currentUser.preferences) {
        currentUser.preferences = {
          ...defaultPrefs,
          noShowRecipies: [recipy.id]
        }
      } else if (!currentUser.preferences!.noShowRecipies) {
        currentUser.preferences = {
          ...currentUser.preferences!,
          noShowRecipies: [recipy.id]
        }
      } else {
        currentUser.preferences!.noShowRecipies.push(recipy.id)
      }
      this.authApiService.updateUser(currentUser!.id!, currentUser).pipe(take(1)).subscribe(res => {
        this.currentUser.set(res)
      })
    }

  }
}
