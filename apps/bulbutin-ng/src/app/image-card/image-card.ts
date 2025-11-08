import { Component, input } from '@angular/core';
import { ImageModel } from '../models/image.model';

@Component({
  selector: 'app-image-card',
  imports: [],
  templateUrl: './image-card.html',
  styleUrl: './image-card.scss',
})
export class ImageCard {
  image = input.required<ImageModel>();
}
