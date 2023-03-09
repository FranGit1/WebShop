import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.css'],
})
export class ProductsHeaderComponent {
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<boolean>();
  sort = true;
  sortDirection = 'desc';

  itemsShowCount = 12;
  constructor() {}

  onSortUpdated(newSort: boolean, direction: string): void {
    this.sort = newSort;
    this.sortChange.emit(this.sort);
    this.sortDirection = direction;
  }

  onItemsUpdated(count: number): void {
    this.itemsShowCount = count;
  }

  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  }
}
