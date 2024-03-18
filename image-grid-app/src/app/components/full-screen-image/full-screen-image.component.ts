import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-full-screen-image',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './full-screen-image.component.html',
  styleUrl: './full-screen-image.component.css',
})
export class FullScreenImageComponent {
  constructor(
    public dialogRef: MatDialogRef<FullScreenImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  @HostListener('window:resize')
  onResize() {
    this.closeDialog();
  }
}
