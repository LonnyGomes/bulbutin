import { Component, inject } from '@angular/core';
import { ImageCard } from '../image-card/image-card';
import { ImageFeed } from '../services/image-feed';

@Component({
  selector: 'app-image-card-feed',
  imports: [ImageCard],
  templateUrl: './image-card-feed.html',
  styleUrl: './image-card-feed.scss',
})
export class ImageCardFeed {
  private imgFeed = inject(ImageFeed);
  images = this.imgFeed.images;
}
