import { Routes } from '@angular/router';

import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { TaskImagesComponent } from './components/task-images/task-images.component';

export const routes: Routes = [
  { path: '', redirectTo: '/images', pathMatch: 'full' },
  { path: 'images', component: ImageGridComponent },
  { path: 'tasks', component: TaskImagesComponent },
];
