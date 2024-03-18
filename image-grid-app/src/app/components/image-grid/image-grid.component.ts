import { Component, OnInit } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ImageService } from '../../service/image.service';
import { TaskService } from '../../service/task.service';

import { GridViewComponent } from '../grid-view/grid-view.component';

interface Image {
  url: string;
}

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GridViewComponent],
  providers: [GridViewComponent],
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css'],
})
export class ImageGridComponent implements OnInit {
  assignedImages: Image[] = [];
  currentPage: number = 0;
  images: Image[] = [];
  imageLoadingStates: boolean[] = [];
  totalLength: number = 0;
  pageSize: number = 8;

  constructor(
    private imageService: ImageService,
    private taskService: TaskService
  ) {
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

  ngOnInit(): void {}

  navigateToImages() {
    this.currentPage = 0;
  }
}
