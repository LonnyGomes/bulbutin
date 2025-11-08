import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCardFeed } from './image-card-feed';

describe('ImageCardFeed', () => {
  let component: ImageCardFeed;
  let fixture: ComponentFixture<ImageCardFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCardFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCardFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
