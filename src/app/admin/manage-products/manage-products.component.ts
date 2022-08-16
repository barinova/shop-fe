import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../products/product.interface';
import { ProductsService } from '../../products/products.service';
import { ManageProductsService } from './manage-products.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from 'src/app/core/notification.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
})
export class ManageProductsComponent implements OnInit {
  readonly columns = ['from', 'description', 'price', 'count', 'action'];

  selectedFile: File | null = null;

  products$!: Observable<Product[]>;

  constructor(
    private readonly productsService: ProductsService,
    private readonly manageProductsService: ManageProductsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productsService.getProducts();
  }

  onUploadCSV(): void {
    if (!this.selectedFile) {
      return;
    }

    try {
    this.manageProductsService
      .uploadProductsCSV(this.selectedFile)
      .subscribe(() => {
        this.selectedFile = null;
        this.cdr.markForCheck();
      })
    } catch (err) {
      console.log(err);
    }
  }
}
