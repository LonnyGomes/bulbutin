import { Component, inject } from '@angular/core';
import { Toolbar } from '../toolbar/toolbar';
import { Navbar } from '../navbar/navbar';
import { ImageCard } from '../image-card/image-card';
import { ImageCardFeed } from '../image-card-feed/image-card-feed';
import { ImageFeed } from '../services/image-feed';

@Component({
  selector: 'app-home',
  imports: [Toolbar, Navbar, ImageCard, ImageCardFeed],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private imgFeed = inject(ImageFeed);
  images = this.imgFeed.images;
}
