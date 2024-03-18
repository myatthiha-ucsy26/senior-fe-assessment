import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() totalLength: number = 0;
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 8;

  @Output() currentPageChange: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() nextPage: EventEmitter<void> = new EventEmitter<void>();
  @Output() prevPage: EventEmitter<void> = new EventEmitter<void>();

  calculateTotalPages(): number {
    return Math.ceil(this.totalLength / this.pageSize);
  }

  calculateStartIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  calculateEndIndex(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return end > this.totalLength ? this.totalLength : end;
  }

  isLastPage(): boolean {
    return this.currentPage === this.calculateTotalPages() - 1;
  }

  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  handlePrevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.prevPage.emit();
      this.currentPageChange.emit(this.currentPage);
    }
  }

  handleNextPage() {
    if (this.currentPage < this.calculateTotalPages() - 1) {
      this.currentPage++;
      this.nextPage.emit();
      this.currentPageChange.emit(this.currentPage);
    }
  }
}
