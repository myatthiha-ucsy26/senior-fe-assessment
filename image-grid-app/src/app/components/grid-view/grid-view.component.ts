import { Component, HostListener, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ImageService } from '../../service/image.service';
import { TaskService } from '../../service/task.service';

import { FullScreenImageComponent } from '../full-screen-image/full-screen-image.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Subscription } from 'rxjs';

interface Image {
  url: string;
}

@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgOptimizedImage,
    PaginationComponent,
  ],
  providers: [PaginationComponent],
  animations: [
    trigger('cardHover', [
      state('initial', style({
        transform: 'scale(1)',
      })),
      state('hovered', style({
        transform: 'scale(1.1)',
      })),
      transition('initial => hovered', animate('200ms ease-in')),
      transition('hovered => initial', animate('200ms ease-out'))
    ])
  ],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.css'
})
export class GridViewComponent implements OnInit {
  @Input() images: Image[] = [];
  @Input() isImageGrid: boolean = false;
  @Input() isTask: boolean = false;
  @Input() imageLoadingStates: boolean[] = [];
  @Input() currentPage: number = 0;

  @Input() totalLength: number = 0;
  cols!: number;
  pageSize: number = 8;
  assignedImages: Image[] = [];
  hoverState: string = 'initial';
  hoveredIndex: number | null = null;

  private currentPageSubscription !: Subscription;

  constructor(
    private imageService: ImageService,
    private taskService: TaskService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    const breakpoints = Object.values(Breakpoints);
    // Subscribe to the breakpoint changes
    this.breakpointObserver.observe(breakpoints).subscribe((result) => {
      if (result.matches) {
        switch (true) {
          case result.breakpoints[Breakpoints.XSmall]:
            this.cols = 1;
            break;
          case result.breakpoints[Breakpoints.Small]:
            this.cols = 2;
            break;
          case result.breakpoints[Breakpoints.Medium]:
            this.cols = 3;
            break;
          default:
            this.cols = 4;
        }
      }
    });
  }

  ngOnInit(): void {
    this.currentPageSubscription = this.imageService.currentPage$.subscribe(page => {
      this.currentPage = page;
    });
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.hoverState = 'hovered';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hoverState = 'initial';
  }

  setHoveredIndex(index: number) {
    this.hoveredIndex = index;
  }

  resetHoveredIndex() {
    this.hoveredIndex = null;
  }

  onImageLoaded(image: Image) {
    const imageIndex = this.images.indexOf(image);
    setTimeout(() => {
      this.imageLoadingStates[imageIndex] = false;
    }, 1000);
  }

  viewImage(imageUrl: string): void {
    if (!this.dialog) {
      return;
    }
    this.dialog.open(FullScreenImageComponent, {
      height: 'auto',
      data: { imageUrl },
      restoreFocus: false,
    });
  }

  assignToTask(image: Image): void {
    this.images = this.images.filter((img) => img !== image);
    this.assignedImages.push(image);
    localStorage.setItem('assignImages', JSON.stringify(this.assignedImages));
    this.totalLength--;
    this.snackBar.open('Task is successfully assigned to user.', 'Close', {
      horizontalPosition: 'end',
      duration: 3000,
    });
  }

  getPaginatedImages(): Image[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.images.length);
    return this.images.slice(startIndex, endIndex);
  }

  handlePrevPage() {
    this.currentPage--;
    this.imageService.setCurrentPage(this.currentPage);
  }

  handleNextPage() {
    this.currentPage++;
    this.imageService.setCurrentPage(this.currentPage);
  }

  handleCurrentPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.imageService.setCurrentPage(this.currentPage);
  }

  deleteAllTasks() {
    localStorage.removeItem('assignImages');
    this.images = this.taskService.getAssignedImages();
    this.isTask = true;
    this.snackBar.open('All tasks are successfully deleted.', 'Close', {
      horizontalPosition: 'end',
      duration: 3000,
    });
  }

  ngOnDestroy() {
    this.currentPageSubscription.unsubscribe();
  }
}