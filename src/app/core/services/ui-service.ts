import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private $loading = signal(false);

  isLoading = this.$loading.asReadonly();

  setIsLoading(value: boolean) {
    this.$loading.set(value)
  }
}
