import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../service/task.service';
import { MatDialog } from '@angular/material/dialog';
import { FullScreenImageComponent } from '../full-screen-image/full-screen-image.component';

interface Image {
  url: string;
}

@Component({
  selector: 'app-task-images',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-images.component.html',
  styleUrls: ['./task-images.component.css'],
})
export class TaskImagesComponent implements OnInit {
  assignedImages: { url: string }[] = [];
  cols: number | undefined;
  currentPage = 0;
  totalPages = 0;
  imageLoadingStates: boolean[] = [];
  pageSize = 8;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private taskService: TaskService,
    public dialog: MatDialog
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
    this.getTasks();
  }

  getTasks() {
    this.assignedImages = this.taskService.getAssignedImages();
    this.totalPages = this.assignedImages.length;
    return this.assignedImages;
  }

  deleteAllTasks() {
    localStorage.removeItem('assignImages');
    this.getTasks();
  }

  viewImage(imageUrl: string): void {
    if (!this.dialog) {
      console.error('MatDialog service not injected');
      return;
    }

    this.dialog.open(FullScreenImageComponent, {
      height: 'auto',
      data: { imageUrl },
      restoreFocus: false,
    });
  }

  onImageLoaded(image: Image) {
    const imageIndex = this.assignedImages.indexOf(image);
    setTimeout(() => {
      this.imageLoadingStates[imageIndex] = false;
    }, 1000);
  }

  getPaginatedImages(): Image[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize,
      this.assignedImages.length
    );
    return this.assignedImages.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (
      this.currentPage <
      Math.ceil(this.assignedImages.length / this.pageSize) - 1
    ) {
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
      this.currentPage ===
      Math.ceil(this.assignedImages.length / this.pageSize) - 1
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
    return end > this.assignedImages.length ? this.assignedImages.length : end;
  }
}
