import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  // private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    // this.productService.productsWithCategory$,
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
      // Use this with Subject without declaring BehaviorSubject
    // this.categorySelectedAction$
    //   .pipe(
    //     startWith(0)
    //   )
  ])
  .pipe(
    map(([products, selectedCategoryId]) =>
    products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
    catchError(err => {
      this.errorMessage = err;
      // return of([]);
      return EMPTY;
    })
  );

  // products$ = this.productService.productsWithCategory$
  // .pipe(
  //   catchError(err => {
  //     this.errorMessage = err;
  //     // return of([]);
  //     return EMPTY;
  //   })
  // );

  categories$ = this.productCategoryService.productCategories$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      // return of([]);
      return EMPTY;
    })
  );

  // productsSimpleFilter$ = this.productService.productsWithCategory$
  // .pipe(
  //   map(products =>
  //       products.filter(product =>
  //         this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
  //     ))
  // );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
