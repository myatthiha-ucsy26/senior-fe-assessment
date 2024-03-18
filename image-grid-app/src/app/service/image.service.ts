import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imagesUrl: string = 'sfe-images/image_paths.txt';
  currentPage: number = 0;


  constructor(private http: HttpClient) {}

  getImages(): Observable<string> {
    return this.http.get(this.imagesUrl, { responseType: 'text' });
  }
}
