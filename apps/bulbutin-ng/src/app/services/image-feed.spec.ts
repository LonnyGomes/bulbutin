import { TestBed } from '@angular/core/testing';

import { ImageFeed } from './image-feed';

describe('ImageFeed', () => {
  let service: ImageFeed;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFeed);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
