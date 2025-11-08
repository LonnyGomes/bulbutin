import { Injectable } from '@angular/core';
import { ImageModel } from '../models/image.model';
import imageData from '../../assets/data/images.json';

@Injectable({
  providedIn: 'root',
})
export class ImageFeed {
  getImages(): ImageModel[] {
    console.log('Fetching image data...');

    return imageData as ImageModel[];
  }
}
