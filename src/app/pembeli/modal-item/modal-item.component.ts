import { Component, Input, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

@Component({
  selector: 'app-modal-item',
  templateUrl: './modal-item.component.html',
  styleUrls: ['./modal-item.component.scss'],
})

export class ModalItemComponent implements OnInit {

  @Input() value: any;
  jumlah;
  pcode;
  photo;
  price;
  product_name;
  customer_id;

  qty = 1;
  subtotal = 0;

  constructor(
    private db: DatabaseService,
    public modalController: ModalController
  ) {
    // console.log(this.value);
  }

  ngOnInit() {
    console.log(this.customer_id);
    this.subtotal = this.price;
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

  dismissModal() {
    this.modalController.dismiss();
  }

  removeQty() {
    let newQty = this.qty - 1;
    if (newQty > 1) {
      this.qty = newQty;
    } else {
      this.qty = 1;
    }
    this.subtotal = this.price * this.qty;
  }
  addQty() {
    let newQty = this.qty + 1;
    if (newQty <= parseInt(this.jumlah)) {
      this.qty = newQty;
      this.subtotal = this.price * this.qty;
    }
  }

  addToCart() {

    let tempOrder = localStorage.getItem('order_' + this.customer_id);
    let newDataTemp = [];
    if (tempOrder != '' && tempOrder != null) {
      let dataTemp = JSON.parse(tempOrder);
      if (dataTemp.length > 0) {
        let array = dataTemp;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.pcode != this.pcode) {
            newDataTemp.push(element);
          }

        }
      }
    }

    // jumlah;
    // pcode;
    // photo;
    // price;
    // product_name;
    // customer_id;

    let toCart = {
      customer_id: this.customer_id,
      jumlah: this.jumlah,
      photo: this.photo,
      pcode: this.pcode,
      product_name: this.product_name,
      qty: this.qty,
      price: this.price,
      subtotal: this.subtotal
    };

    newDataTemp.push(toCart);
    localStorage.setItem('order_' + this.customer_id, JSON.stringify(newDataTemp));

    this.db.loadCart();

    this.dismissModal();



  }

}
