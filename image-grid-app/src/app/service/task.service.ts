import { Injectable } from '@angular/core';

interface Image {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  assignedImages: Image[] = [];

  constructor() {}

  assignImageToTask(image: Image): void {
    this.assignedImages.push(image);
  }

  getAssignedImages(): Image[] {
    const storedImages = localStorage.getItem('assignImages');
    if (storedImages) {
      return JSON.parse(storedImages);
    } else {
      return [];
    }
  }
}
