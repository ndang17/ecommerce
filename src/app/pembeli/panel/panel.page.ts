import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_service/database.service';

import { ModalItemComponent } from 'src/app/pembeli/modal-item/modal-item.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit {

  currentUser: any;

  listProduct = [];

  customer_name = '';
  address = '';

  cartCount = 0;

  subscribe: any;



  constructor(
    private platform: Platform,
    private db: DatabaseService,
    public NavController: NavController,
    public alertController: AlertController,
    public modalController: ModalController
  ) {

    this.platform.ready().then(() => {
      let userLogin = localStorage.getItem('userLogin');
      if (userLogin != '' && userLogin != null) {

        this.currentUser = JSON.parse(userLogin);
        this.customer_name = this.currentUser.customer_name;
        this.address = this.currentUser.address;

      } else {

        localStorage.removeItem('userLogin');
        this.NavController.navigateRoot([''], { replaceUrl: true });

      }
    }).catch(error => {
      console.log(error);
    });



  }

  ngOnInit() {

  }

  async presentAlert(header) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header, //'Alert',
      mode: 'ios',
      message: 'Maaf, stok barang telah habis',
      buttons: ['Tutup']
    });

    await alert.present();
  }

  ionViewDidEnter() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.db.getProducts().subscribe(data => {
          this.listProduct = data;
          console.log(this.listProduct);
        });

        this.db.loadCart();
        this.db.getCart().subscribe(data => {
          this.cartCount = 0;
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              this.cartCount = this.cartCount + parseInt(element.qty);
            }
          }

        });

      }
    });




  }


  async presentAlertProfil() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Hai, ' + this.customer_name,
      subHeader: 'Logout akan membersihkan data keranjang!',
      mode: 'ios',
      // message: this.address,
      buttons: [
        {
          text: 'Tutup',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Logout',
          handler: () => {

            let userLogin = localStorage.getItem('userLogin');
            if (userLogin != '' && userLogin != null) {

              let d_userLogin = JSON.parse(userLogin);
              let customer_id = d_userLogin.customer_id;

              localStorage.removeItem('order_' + customer_id);

              localStorage.removeItem('userLogin');
              this.NavController.navigateRoot([''], { replaceUrl: true });

            }


          }
        }
      ]
    });

    await alert.present();
  }

  formatRupiah(angka, prefix) {

    var number_string = parseFloat(angka).toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
  }

  async openModal(item: any) {

    if (parseInt(item.jumlah) > 0) {

      item.customer_id = this.currentUser.customer_id;

      const modal = await this.modalController.create({
        component: ModalItemComponent,
        cssClass: 'my-custom-modal-css',
        componentProps: item
      });
      return await modal.present();

    } else {
      this.presentAlert(item.product_name);
    }



  }

}
