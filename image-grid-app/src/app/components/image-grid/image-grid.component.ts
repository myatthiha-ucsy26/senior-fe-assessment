import { Component, OnInit, OnDestroy } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { ImageService } from '../../service/image.service';
import { TaskService } from '../../service/task.service';

import { FullScreenImageComponent } from '../full-screen-image/full-screen-image.component';

interface Image {
  url: string;
}

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent implements OnInit {
  assignedImages: Image[] = [];
  currentPage: number = 0;
  cols!: number;
  images: Image[] = [];
  imageLoadingStates: boolean[] = [];
  taskImages: string[] = [];
  totalLength: number = 0;
  pageSize: number = 8;

  private subscription!: Subscription;
  private currentPageSubscription !: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private imageService: ImageService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
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

    this.imageService.getImages().subscribe(async (data) => {
      const parsedUrls = data
        .split('\n')
        .filter((url) => url.trim().length > 0);
      this.assignedImages = this.taskService.getAssignedImages();

      this.images = parsedUrls.map((url) => ({ url }));
      this.totalLength = this.images.length - this.assignedImages.length;

      this.imageLoadingStates = new Array(this.images.length).fill(true);

      if (this.assignedImages.length > 0) {
        this.images = this.images.filter((image) => {
          return !this.assignedImages.some(
            (assignedImage) => assignedImage.url === image.url
          );
        });
      }
      this.images.forEach((_, index) => {
        this.imageLoadingStates[index] = true;
      });
    });
  }

  ngOnInit(): void {
    this.currentPageSubscription = this.imageService.currentPage$.subscribe(page => {
      this.currentPage = page;
    });
  }

  getPaginatedImages(): Image[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.images.length);
    return this.images.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.images.length / this.pageSize) - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  isLastPage(): boolean {
    return (
      this.currentPage === Math.ceil(this.images.length / this.pageSize) - 1
    );
  }

  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  calculateStartIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  calculateEndIndex(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return end > this.images.length ? this.images.length : end;
  }

  navigateToImages() {
    this.currentPage = 0;
  }

  onImageLoaded(image: Image) {
    const imageIndex = this.images.indexOf(image);
    setTimeout(() => {
      this.imageLoadingStates[imageIndex] = false;
    }, 1000);
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.currentPageSubscription.unsubscribe();
  }
}
