import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, IonRouterOutlet, NavController, LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_service/database.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tambahbarang',
  templateUrl: './tambahbarang.page.html',
  styleUrls: ['./tambahbarang.page.scss'],
})
export class TambahbarangPage implements OnInit {

  pcode: string;
  product_name: string;
  price: string;
  jumlah: string;
  photo: string;

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
    public toastController: ToastController,
    private camera: Camera,
  ) { }

  ngOnInit() {
  }

  gettingFromCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 720,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,//Camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.photo = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
    });
  }

  gettingFromGalery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 720,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,//Camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.photo = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
    });
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

    if (this.pcode != '' &&
      this.product_name != '' &&
      this.price != '' &&
      this.jumlah != '' &&
      this.pcode != null &&
      this.product_name != null &&
      this.price != null &&
      this.jumlah != null &&
      this.photo != '' && this.photo != null) {

      this.db.addProduct(this.pcode, this.product_name, this.jumlah, this.price, this.photo)
        .then(ck => {
          if (parseInt(ck) > 0) {
            this.presentToast('success', 'Berhasil di tambahkan');
            this.goBack();
          } else {
            this.presentToast('danger', 'Gagal di tambahkan, Pastikan kode Produk uniq');
          }
        });

    } else {
      this.presentToast('secondary', 'Semua form wajib diisi');
    }

  }

  goBack() {
    this.NavController.navigateBack(['/penjual'], { replaceUrl: true });
  }

}
