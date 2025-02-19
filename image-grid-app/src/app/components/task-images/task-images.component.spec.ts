import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TaskImagesComponent } from './task-images.component';
import { ImageService } from '../../service/image.service';

describe('TaskImagesComponent', () => {
  let component: TaskImagesComponent;
  let fixture: ComponentFixture<TaskImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, TaskImagesComponent],
      providers: [ImageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
