import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-images',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
  ],
  templateUrl: './task-images.component.html',
  styleUrls: ['./task-images.component.css'],
})
export class TaskImagesComponent implements OnInit {
  assignedImages: { url: string }[] = [];
  cols: number | undefined;
  constructor(
    private breakpointObserver: BreakpointObserver,
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
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.assignedImages = this.taskService.getAssignedImages();
    return this.assignedImages;
  }

  deleteAllTasks() {
    localStorage.removeItem('assignImg');
    this.getTasks();
  }
}
