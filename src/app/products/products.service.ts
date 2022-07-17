import { Injectable } from '@angular/core';

import { EMPTY, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  private productsApi: string = environment.apiEndpoints.product;

  createNewProduct(product: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', 'products');
    return this.http.post<Product>(url, product);
  }

  editProduct(id: string, changedProduct: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', `products/${id}`);
    return this.http.put<Product>(url, changedProduct);
  }

  getProductById(id: string): Observable<Product> {
    // if (!this.endpointEnabled('bff')) {
    console.warn(
      'Endpoint "bff" is disabled. To enable change your environment.ts config'
    );
    return this.http.get<Product>(`${this.productsApi}/get-product-by-id`, { params: { id } });
    // }
    //
    // const url = this.getUrl('bff', `products/${id}`);
    // return this.http
    //   .get<{ product: Product }>(url)
    //   .pipe(map((resp) => resp.product));
  }

  getProducts(): Observable<Product[]> {
    // if (!this.endpointEnabled('bff')) {
    console.warn(
      'Endpoint "bff" is disabled. To enable change your environment.ts config'
    );
    return this.http.get<Product[]>(`${this.productsApi}/get-products-list`);
    // }
    //
    // const url = this.getUrl('bff', 'products');
    // return this.http.get<Product[]>(url);
  }

  getProductsForCheckout(ids: string[]): Observable<Product[]> {
    if (!ids.length) {
      return of([]);
    }

    return this.getProducts().pipe(
      map((products) => products.filter((product) => ids.includes(product.id)))
    );
  }
}
