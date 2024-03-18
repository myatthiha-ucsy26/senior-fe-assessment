import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() logoClicked = new EventEmitter<void>();

  constructor(private router: Router, private imageService: ImageService) {}

  navigateToImages() {
    this.imageService.setCurrentPage(0);
    this.router.navigateByUrl('/images');
  }
}
