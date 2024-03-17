import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { ImageGridComponent } from './components/image-grid/image-grid.component';

describe('AppComponent', () => {
  const routes = [{ path: '', component: ImageGridComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, AppComponent, RouterModule.forRoot(routes)],
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
