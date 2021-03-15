import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.page.html',
  styleUrls: ['./myorder.page.scss'],
})
export class MyorderPage implements OnInit {

  listOrder = [];

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    // let test = localStorage.getItem('test');

    // this.listOrder = JSON.parse(test);

    // console.log(this.listOrder);

    this.db.getMyOrder().subscribe(data => {

      this.listOrder = data;
      // localStorage.setItem('test', JSON.stringify(data));

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
    this.NavController.navigateBack(['/pembeli/panel'], { replaceUrl: true });
  }

}
