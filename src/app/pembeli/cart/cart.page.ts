import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

import 'moment/locale/id';
import * as moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  listCart = [];

  viewTotal = 0;
  viewVoucer = 0;
  viewTotalBayar = 0;
  viewPPN = 0;

  useVoucher = 0;

  customer_id: any;

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {

    let userLogin = localStorage.getItem('userLogin');
    if (userLogin != '' && userLogin != null) {
      let d_userLogin = JSON.parse(userLogin);
      this.customer_id = d_userLogin.customer_id;
    }

  }

  async presentLoading(message) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message, //'',
      mode: 'ios',
      duration: 1500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  ionViewDidEnter() {
    this.db.loadCart();
    this.db.getCart().subscribe(data => {

      this.listCart = data;
      // console.log(this.listCart);

      this.hitungTotalBayar();

    });
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

  async alertSucessOrder() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Sukses Order',
      message: 'Terima kasih telah order',
      backdropDismiss: false,
      buttons: [{
        text: 'Lihat orderan saya',
        handler: () => {
          this.NavController.navigateForward(['/pembeli/myorder'], {});
        }
      }
      ]
    });

    await alert.present();
  }

  async removeFromCart(item: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: item.product_name,
      message: 'Hapus dari keranjang ?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Ya',
          handler: () => {
            let tempOrder = localStorage.getItem('order_' + item.customer_id);
            let newDataTemp = [];

            if (tempOrder != '' && tempOrder != null) {

              let dataTemp = JSON.parse(tempOrder);
              if (dataTemp.length > 0) {
                let array = dataTemp;
                for (let index = 0; index < array.length; index++) {
                  const element = array[index];
                  if (element.pcode != item.pcode) {
                    newDataTemp.push(element);
                  }
                }
              }
            }

            localStorage.setItem('order_' + item.customer_id, JSON.stringify(newDataTemp));
            this.db.loadCart();
          }
        }
      ]
    });

    await alert.present();
  }

  removeQty(item: any) {

    let newQty = parseInt(item.qty) - 1;
    if (newQty >= 1) {
      this.presentLoading('Update keranjang...');

      let newData = [];

      for (let index = 0; index < this.listCart.length; index++) {
        const element = this.listCart[index];

        if (element.pcode == item.pcode) {
          this.listCart[index]['qty'] = newQty;
          this.listCart[index]['subtotal'] = parseFloat(item.price) * newQty;
        }
        newData.push(this.listCart[index]);
      }

      localStorage.setItem('order_' + item.customer_id, JSON.stringify(newData));
      this.db.loadCart();
      this.hitungTotalBayar();

    }


  }
  addQty(item: any) {

    let newQty = parseInt(item.qty) + 1;
    if (newQty <= parseInt(item.jumlah)) {

      this.presentLoading('Update keranjang...');

      let newData = [];

      for (let index = 0; index < this.listCart.length; index++) {
        const element = this.listCart[index];

        if (element.pcode == item.pcode) {
          this.listCart[index]['qty'] = newQty;
          this.listCart[index]['subtotal'] = parseFloat(item.price) * newQty;
        }
        newData.push(this.listCart[index]);
      }

      localStorage.setItem('order_' + item.customer_id, JSON.stringify(newData));
      this.db.loadCart();
      this.hitungTotalBayar();

    }

  }

  hitungTotalBayar() {

    this.viewTotal = 0;
    this.viewVoucer = (this.useVoucher == 1) ? 1000 : 0;
    this.viewTotalBayar = 0;

    if (this.listCart.length > 0) {
      for (let index = 0; index < this.listCart.length; index++) {
        const element = this.listCart[index];

        this.viewTotal = this.viewTotal + parseFloat(element.subtotal);

      }

      let TotalSblmPPN = this.viewTotal - this.viewVoucer;
      this.viewPPN = TotalSblmPPN * 0.1;
      this.viewTotalBayar = this.viewPPN + TotalSblmPPN;

    }

  }

  actionButtonVoucer() {
    if (this.useVoucher == 0) {
      this.useVoucher = 1;
      this.viewVoucer = 1000;
    } else {
      this.useVoucher = 0;
      this.viewVoucer = 0;
    }

    this.hitungTotalBayar();
  }

  actionCheckOut() {

    this.presentLoading('Memproses order...');

    setTimeout(() => {
      localStorage.removeItem('order_' + this.customer_id);
      this.db.loadCart();
      this.alertSucessOrder();
    }, 2000);

    // genrate order_id
    let order_id_p = 'INV/' + moment().format('MM/YYYY');
    let order_date = moment().format('YYYY-MM-DD');
    let promo_code = (this.viewVoucer != 0) ? 'pmo-001' : '';
    let amount_discount = (this.viewVoucer != 0) ? 1000 : 0;
    let net = this.viewTotal;
    let ppn = this.viewPPN;
    let total = this.viewTotalBayar;
    let moment_unix = moment().unix();
    let order_id = order_id_p + '/' + moment_unix;

    this.db.addMyOrder(order_id, order_date, this.customer_id, promo_code, amount_discount, net, ppn, total, moment_unix);


    // this.db.getMyOrder().subscribe(data => {
    //   console.log('getMyOrder', data);
    // });

  }



  goBack() {
    this.NavController.navigateBack(['/pembeli/panel'], { replaceUrl: true });
  }

}
