import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, IonRouterOutlet, NavController, LoadingController, AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_service/database.service';


@Component({
  selector: 'app-penjual',
  templateUrl: './penjual.page.html',
  styleUrls: ['./penjual.page.scss'],
})
export class PenjualPage implements OnInit {

  listProduct = [];

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
  ) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getProducts().subscribe(data => {
          this.listProduct = data;
        })
      }
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


  goBack() {
    this.NavController.navigateBack([''], { replaceUrl: true });
  }

}
