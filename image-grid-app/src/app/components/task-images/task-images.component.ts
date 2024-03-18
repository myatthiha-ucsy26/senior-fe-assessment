import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../service/task.service';

import { GridViewComponent } from '../grid-view/grid-view.component';

interface Image {
  url: string;
}

@Component({
  selector: 'app-task-images',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    GridViewComponent
  ],
  providers: [GridViewComponent],
  templateUrl: './task-images.component.html',
  styleUrls: ['./task-images.component.css'],
})
export class TaskImagesComponent implements OnInit {
  assignedImages: { url: string }[] = [];
  currentPage: number = 0;
  imageLoadingStates: boolean[] = [];
  totalPages: number = 0;
  pageSize: number = 8;
  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.assignedImages = this.taskService.getAssignedImages();
    this.imageLoadingStates = new Array(this.assignedImages.length).fill(true);
    this.totalPages = this.assignedImages.length;
    return this.assignedImages;
  }

  deleteAllTasks() {
    localStorage.removeItem('assignImages');
    this.getTasks();
    this.snackBar.open('All tasks are successfully deleted.', 'Close', {
      horizontalPosition: 'end',
      duration: 3000,
    });
  }
}
