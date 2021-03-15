import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
})
export class RegistrasiPage implements OnInit {

  customer_name: string;
  address: string;
  latitude: string;
  longitude: string;

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
    private platform: Platform,
    public toastController: ToastController,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy) {

    this.platform.ready().then(() => {
      this.checkGPSPermission();
    }).catch(error => {
      console.log(error);
    });

  }

  ngOnInit() {
  }

  async presentToast(color, message) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      position: 'bottom',
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }

  simpanBarang() {

    if (this.customer_name != '' && this.customer_name != null &&
      this.address != '' && this.address != null &&
      this.latitude != '' && this.latitude != null &&
      this.longitude != '' && this.longitude != null) {

      this.db.addCustomer(this.customer_name, this.address, this.latitude, this.longitude)
        .then(_ => {
          this.presentToast('success', 'Berhasil di tambahkan');
          this.goBack();
        });

    } else {
      this.presentToast('secondary', 'Semua form wajib diisi');
    }

  }

  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {

        let locationCoords = localStorage.getItem('locationCoords');
        if (locationCoords != '' && locationCoords != null) {

          this.latitude = JSON.parse(locationCoords).latitude;
          this.longitude = JSON.parse(locationCoords).longitude;

        } else {

          if (result.hasPermission) {

            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {

            //If not having permission ask for permission
            this.requestGPSPermission();
          }

        }


      },
      err => {
        alert('checkGPSPermission ' + err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = '' + resp.coords.latitude;
      this.longitude = '' + resp.coords.longitude

    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }

  goBack() {
    this.NavController.navigateBack(['/pembeli/login'], { replaceUrl: true });
  }

}
