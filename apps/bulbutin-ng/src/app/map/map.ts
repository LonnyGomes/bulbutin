import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  viewChild,
  inject,
  computed,
  effect,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { ImageFeed } from '../services/image-feed';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnInit, OnDestroy {
  private imgFeed = inject(ImageFeed);
  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: mapboxgl.Map;
  private darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  currentImageIndex = computed(
    () => `${this.imgFeed.mapIndex() + 1} / ${this.imgFeed.images().length}`
  );

  // Computed property to get the appropriate map style based on dark mode
  private getMapStyle() {
    return this.darkModeQuery.matches ? this.imgFeed.mbStyleDark : this.imgFeed.mbStyleLight;
  }

  constructor() {
    effect(() => {
      const index = this.imgFeed.mapIndex();
      const images = this.imgFeed.images();
      if (this.map && images[index]) {
        const { longitude, latitude } = images[index];
        this.map.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          essential: true,
        });
      }
    });

    // Listen for dark mode changes and update map style
    this.darkModeQuery.addEventListener('change', (e) => {
      if (this.map) {
        const newStyle = e.matches ? this.imgFeed.mbStyleDark : this.imgFeed.mbStyleLight;
        this.map.setStyle(newStyle);

        // Re-add the image layer after style change
        this.map.once('styledata', () => {
          this.addImageLayer();
        });
      }
    });
  }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapboxAccessToken;

    this.map = new mapboxgl.Map({
      container: this.mapContainer().nativeElement,
      style: this.getMapStyle(), // Use style based on dark mode
      center: [-77.0369, 38.9072], // Default center (Washington DC)
      zoom: 9,
    });

    // Add navigation controls
    this.map.addControl(new mapboxgl.NavigationControl());

    // Load images and add markers
    this.map.on('load', () => {
      this.addImageLayer();
    });
  }

  private addImageLayer() {
    const imageGeoJSON = this.imgFeed.imagePoints();

    // Check if source already exists and remove it
    if (this.map!.getSource('imagesSource')) {
      this.map!.removeLayer('imagesLayer');
      this.map!.removeSource('imagesSource');
    }

    this.map!.addSource('imagesSource', {
      type: 'geojson',
      data: imageGeoJSON,
    });

    // Add a layer to render the points
    this.map!.addLayer({
      id: 'imagesLayer',
      type: 'circle',
      source: 'imagesSource',
      paint: {
        'circle-radius': 6,
        'circle-color': '#FF5722',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
      },
    });

    // Add popup on click
    this.map!.on('click', 'imagesLayer', (e) => {
      const coordinates = (e.features![0].geometry as any).coordinates.slice();
      const title = e.features?.[0].properties?.['title'] || '';
      if (coordinates && title) {
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${title}</strong>`)
          .addTo(this.map!);
      }
    });

    // Change cursor on hover
    this.map!.on('mouseenter', 'imagesLayer', () => {
      this.map!.getCanvas().style.cursor = 'pointer';
    });
    this.map!.on('mouseleave', 'imagesLayer', () => {
      this.map!.getCanvas().style.cursor = '';
    });
  }

  next() {
    this.imgFeed.nextMapIndex();
  }

  prev() {
    this.imgFeed.prevMapIndex();
  }

  ngOnDestroy() {
    // Clean up event listener
    this.darkModeQuery.removeEventListener('change', () => {});
    this.map?.remove();
  }
}
