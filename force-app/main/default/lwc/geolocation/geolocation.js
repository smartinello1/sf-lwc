import { LightningElement, track } from 'lwc';

export default class Geolocation extends LightningElement {
  @track _locationService;
  @track coordinates;
  @track mapMarkers = [];

  connectedCallback() {
    this.getLocationService();
  }

  getLocationService() {
    // watchPosition
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.success(pos);
      },
      (err) => {
        this.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  success(pos) {
    this.coordinates = pos.coords;
    this.generateMapMarkers();
  }

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  generateMapMarkers() {
    let markers = [
      {
        title: 'My Position',
        location: {
          Latitude: this.coordinates.latitude,
          Longitude: this.coordinates.longitude
        }
      }
    ];
    this.mapMarkers = markers;
  }
}