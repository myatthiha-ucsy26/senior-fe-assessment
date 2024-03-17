import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
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
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css'],
})
export class ImageGridComponent implements OnInit {
  assignedImages: Image[] = [];
  currentPage = 0;
  cols: number | undefined;
  images: Image[] = [];
  imageLoadingStates: boolean[] = [];

  taskImages: string[] = [];
  pageSize = 8;

  private subscription: Subscription | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private imageService: ImageService,
    private taskService: TaskService
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
      const parsedUrls = data.split('\n');
      this.assignedImages = this.taskService.getAssignedImages();

      this.images = parsedUrls.map((url) => ({ url }));
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

  ngOnInit(): void {}

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

  onImageLoaded(image: Image) {
    const imageIndex = this.images.indexOf(image);
    setTimeout(() => {
      this.imageLoadingStates[imageIndex] = false;
    }, 1000); // Replace with a suitable delay or remove for instant class application
  }

  assignToTask(image: Image): void {
    this.images = this.images.filter((img) => img !== image);
    this.assignedImages.push(image);
    localStorage.setItem('assignImg', JSON.stringify(this.assignedImages));
    window.open('/tasks', '_blank');
  }

  viewImage(imageUrl: string): void {
    if (!this.dialog) {
      console.error('MatDialog service not injected');
      return;
    }
    const screen = this.breakpointObserver.isMatched(Breakpoints.Large)
      ? 'large'
      : this.breakpointObserver.isMatched(Breakpoints.Small)
      ? 'small'
      : 'medium';

    this.dialog.open(FullScreenImageComponent, {
      width: screen === 'large' ? '30%' : screen === 'medium' ? '50%' : '60%',
      height: 'auto',
      data: { imageUrl },
      restoreFocus: false,
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
