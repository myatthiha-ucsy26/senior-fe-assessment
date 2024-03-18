import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { ImageService } from './service/image.service';

describe('AppComponent', () => {
  const routes = [{ path: '', component: ImageGridComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule,
        HttpClientModule,
        AppComponent,
        RouterModule.forRoot(routes),
      ],
      providers: [ImageService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'image-grid-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('image-grid-app');
  });
});
