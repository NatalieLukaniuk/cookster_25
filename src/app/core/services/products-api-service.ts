import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Product } from '../models/recipies.models';
import { ProductsService } from './products-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  url = `https://cookster-12ac8-default-rtdb.firebaseio.com/products`;
  ingredsToAddUrl = `https://cookster-12ac8-default-rtdb.firebaseio.com/ingredientsToAdd`;

  http = inject(HttpClient);
  productsService = inject(ProductsService);

  addProduct(product: any): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.url}.json`, product);
  }

  deleteProduct(product: Product) {
    return this.http.delete(`${this.url}/${product.id}.json`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get(`${this.url}.json`).pipe(
      map((res: Object) => {
        let array = Object.entries(res);
        let products: any = [];
        for (let entry of array) {
          let product: any = {
            id: entry[0],
            ...entry[1],
          };
          products.push(product);
        }
        products.reverse();
        this.productsService.setAllProducts(products);
        return products
      })
    );
  }

  updateProduct(id: string, data: Product) {
    return this.http.patch<Product>(`${this.url}/${id}.json`, data);
  }

  saveToIngredientsToAddArray(name: string) {
    return this.http.post<any>(`${this.ingredsToAddUrl}.json`, JSON.stringify(name));
  }

  getIngredientsToAdd(): Observable<any> {
    return this.http.get<any>(`${this.ingredsToAddUrl}.json`);
  }
}
