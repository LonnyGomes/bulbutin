import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Map } from './map/map';
import { ImageCardFeed } from './image-card-feed/image-card-feed';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: ImageCardFeed },
      { path: 'map', component: Map },
    ],
  },
  { path: '**', redirectTo: '' },
];
