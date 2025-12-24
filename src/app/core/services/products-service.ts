import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/recipies.models';
import { ProductsApiService } from './products-api-service';
import { take } from 'rxjs';
import { UiService } from './ui-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private $products = signal<Product[]>([]);
  $allProducts = this.$products.asReadonly();

  productsApi = inject(ProductsApiService)
  uiService = inject(UiService);

  setAllProducts(products: Product[]): void {
    this.$products.set(products)
  }

  loadProductsFromBE(): void {
    this.productsApi.getProducts().pipe(take(1)).subscribe()
  }

  addProduct(productToAdd: {
    name: any;
    density: number;
    calories: number;
    defaultUnit: any;
    type: any;
    sizeChangeCoef: number;
    grInOneItem: number;
  }) {
    this.uiService.setIsLoading(true)
    this.productsApi.addProduct(productToAdd).pipe(take(1)).subscribe((res: { name: string }) => {
      const addedProduct: Product = {
        ...productToAdd,
        id: res.name,
      }
      this.$products.update(products => products.concat(addedProduct))
      this.uiService.setIsLoading(false)
    });
  }

  updateProduct(updatedProduct: Product) {
    this.uiService.setIsLoading(true)
    this.productsApi.updateProduct(updatedProduct.id, updatedProduct).pipe(take(1)).subscribe(res => {
      this.$products.update(products => {
        const updated = products.map(prod => {
          if (prod.id === updatedProduct.id) {
            return updatedProduct
          } else return prod
        })
        return updated
      })
      this.uiService.setIsLoading(false)
    })
  }

  
}
