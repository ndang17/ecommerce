import { Injectable } from '@angular/core';

import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { BehaviorSubject, Observable } from 'rxjs';
// import { rejects } from 'node:assert';
// import { rejects } from 'node:assert';

import 'moment/locale/id';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  databaseObj: SQLiteObject;
  readonly database_name: string = "ecommerce.db";
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  customers = new BehaviorSubject([]);
  products = new BehaviorSubject([]);
  cart = new BehaviorSubject([]);
  myorder = new BehaviorSubject([]);
  mutasi = new BehaviorSubject([]);
  statusAddProduct: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {

    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    });

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Inisialisasi SQLite...',
      mode: 'ios',
      duration: 4000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
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

  createDB() {
    this.presentLoading();
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then(async (db: SQLiteObject) => {
        this.databaseObj = db;

        try {

          // localStorage.removeItem('userLogin');

          let status = await this.createTable();
          // alert('sukses ' + JSON.stringify(status));
          this.presentToast('success', status);
          this.dbReady.next(true);
          this.loadProducts();
          this.loadCustomers();

        } catch (e) {
          this.presentToast('danger', 'Inisialisasi database gagal');
          // alert('error : ' + JSON.stringify(e));
        }


        // alert('ecommerce Database Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  getCustomer(): Observable<any[]> {
    return this.customers.asObservable();
  }

  getCart(): Observable<any[]> {
    return this.cart.asObservable();
  }

  getMyOrder(): Observable<any[]> {
    return this.myorder.asObservable();
  }

  getMutasi(): Observable<any[]> {
    return this.mutasi.asObservable();
  }

  dummyCreate(table_name, column, useDummy, data01): Promise<any> {

    return new Promise((resolve, reject) => {

      let createTb = `CREATE TABLE IF NOT EXISTS ${table_name} (${column})`;

      this.databaseObj.executeSql(`DROP TABLE IF EXISTS ${table_name}`, [])
        .then(() => {

          // create table
          this.databaseObj.executeSql(createTb, [])
            .then(() => {

              // insert dummy
              if (useDummy) {

                this.databaseObj.executeSql(data01, [])
                  .then(() => {

                    this.databaseObj.executeSql(`SELECT * FROM ${table_name}`, [])
                      .then((res) => {

                        let rows = [];
                        if (res.rows.length > 0) {
                          for (var i = 0; i < res.rows.length; i++) {
                            rows.push(res.rows.item(i));
                          }
                        }

                        resolve(JSON.stringify(rows));

                      })
                      .catch(e => {
                        reject(table_name + "error select" + JSON.stringify(e));
                        // alert("error select" + JSON.stringify(e))
                      });

                  })
                  .catch(e => {
                    reject(table_name + "error insert" + JSON.stringify(e));
                  });

              } else {
                resolve(table_name + ' created success');
              }


            })
            .catch(e => {
              reject(table_name + " error create" + JSON.stringify(e));
            });

        })
        .catch(e => {
          reject(table_name + "error truncate" + JSON.stringify(e));
          // alert()
        });


    });

  }

  createTable(): Promise<any> {

    return new Promise(async (resolve, rejects) => {

      try {

        // ======= STOCK =========

        let table_name_07 = `stock`;
        let table_07 = `pcode varchar(200) NOT NULL, jumlah int(11) DEFAULT 0`;

        let data07 = `insert into ${table_name_07} (pcode,jumlah) values ('010001',200)`;
        let rows_07 = await this.dummyCreate(table_name_07, table_07, true, data07);
        // alert(rows_07);

        // ======= CUSTOMER =========

        let table_name_01 = `customer`;
        let table_01 = `customer_id int(11) PRIMARY KEY, customer_name varchar(200) DEFAULT NULL,
        address text DEFAULT NULL, latitude varchar(100) DEFAULT NULL, longitude varchar(100) DEFAULT NULL `;

        let data01 = `insert  into ${table_name_01} (customer_id, customer_name, address, latitude, longitude) values
        (1, 'paijo', 'jl. Kutilang berkicau 12, jakarta barat', '-6.213280', '106.776860');`;
        let rows_01 = await this.dummyCreate(table_name_01, table_01, true, data01);
        // alert(rows_01);

        // ======= PRODUCT =========

        let table_name_05 = `product`;
        let table_05 = `pcode varchar(200) DEFAULT NULL, product_name text DEFAULT NULL,
        photo text DEFAULT NULL, price decimal(65, 2) DEFAULT NULL `;

        let data05 = `insert  into ${table_name_05}(pcode,product_name,'photo',price) 
        values ('010001','MIRANDA H.C N.BLACK 30.MC1','',10000.00)`;
        let rows_05 = await this.dummyCreate(table_name_05, table_05, true, data05);
        // alert(rows_05);

        // ======= PROMO =========

        let table_name_06 = `promo`;
        let table_06 = `promo_code varchar(200) NOT NULL, promo_name text DEFAULT NULL`;

        let data06 = `insert  into ${table_name_06} (promo_code,promo_name) values 
        ('pmo-001','Setiap pembelian MIRANDA H.C N.BLACK 30.MC1, mendapat potongan Rp. 1.000,-')`;
        let rows_06 = await this.dummyCreate(table_name_06, table_06, true, data06);
        // alert(rows_06);

        // ======= MUTASI =========

        let table_name_02 = `mutasi_stock`;
        let table_02 = `id INTEGER PRIMARY KEY NOT NULL, tgl_mutasi date DEFAULT NULL,
        pcode varchar(200) NOT NULL, order_id varchar(200) DEFAULT NULL, 
        type_mutasi varchar(1) DEFAULT NULL, jumlah int(11) DEFAULT NULL`;
        let data02 = `insert  into ${table_name_02} (tgl_mutasi,pcode,order_id,type_mutasi,jumlah) values
        ('${moment().format('YYYY-MM-DD')}','010001','','I',200)`;
        let rows_02 = await this.dummyCreate(table_name_02, table_02, true, data02);
        // alert(rows_02);

        // ======= ORDER DETAIL =========

        let table_name_03 = `order_detail`;
        let table_03 = `moment_unix bigint(20) NOT NULL, order_detail_id bigint(20) NOT NULL, order_id varchar(200) NOT NULL,
        pcode varchar(200) DEFAULT NULL, qty int(11) DEFAULT NULL,
        price decimal(65,2) DEFAULT NULL, subtotal decimal(65,2) DEFAULT NULL`;
        let rows_03 = await this.dummyCreate(table_name_03, table_03, false, data01);
        // alert(rows_03);

        // ======= ORDER HEADER =========

        let table_name_04 = `order_header`;
        let table_04 = `moment_unix bigint(20) NOT NULL, order_id varchar(200) NOT NULL, order_date date DEFAULT NULL,
        customer_id int(11) NOT NULL, promo_code varchar(200) DEFAULT NULL,
        amount_discount decimal(65,2) DEFAULT NULL, net decimal(65,2) DEFAULT NULL,
        ppn decimal(65,2) DEFAULT NULL, total decimal(65,2) DEFAULT NULL`;
        let rows_04 = await this.dummyCreate(table_name_04, table_04, false, data01);
        // alert(rows_04);

        resolve('Inisialisasi database berhasil');

      } catch (e) {

        alert('Error ' + e);
        rejects(e);

      }

    });



  }

  async addProduct(pcode, product_name, jumlah, price, photo) {

    try {

      let checkpCode = await this.checkPcode(pcode);

      if (parseFloat(checkpCode) > 0) {
        return 0;
      } else {
        let ckAdd = await this.addingNewProduct(pcode, product_name, jumlah, price, photo);
        this.loadProducts();
        return ckAdd;
      }
    } catch (e) {
      return 0;
    }

  }

  async addCustomer(customer_name, address, latitude, longitude) {

    let data = [customer_name, address, latitude, longitude];
    let data01 = `insert  into customer (customer_name, address, latitude, longitude) values (?,?,?,?);`;

    return this.databaseObj.executeSql(data01, data).then(data => {
      this.loadCustomers();
    });

  }

  checkPcode(pcode: string): Promise<any> {

    return new Promise((resolve, reject) => {

      let query = 'SELECT p.* FROM product p WHERE p.pcode = ' + pcode;

      this.databaseObj.executeSql(query, []).then(data => {
        // console.log(data);
        if (data.rows.length > 0) {
          resolve(1);
        } else {
          resolve(0);
        }
      }).catch(e => {
        reject('Gagal mendapatkan produk');
      });

    });




  }

  addingNewProduct(pcode, product_name, jumlah, price, photo): Promise<any> {
    let data = [pcode, product_name, photo, price];

    return new Promise((resolve, reject) => {

      let data01 = `insert into product (pcode,product_name,photo,price) values (?,?,?,?);`;

      this.databaseObj.executeSql(data01, data).then(data => {
        let dataStock = [pcode, jumlah];
        let data02 = `insert into stock (pcode,jumlah) values (?,?);`;

        this.databaseObj.executeSql(data02, dataStock).then(data => {

          // adding mutasi
          let data_mutasi = [moment().format('YYYY-MM-DD'), pcode, '', 'I', jumlah];
          let data01_mutasi = `insert  into mutasi_stock (tgl_mutasi, pcode, order_id, type_mutasi, jumlah) values (?,?,?,?,?);`;

          this.databaseObj.executeSql(data01_mutasi, data_mutasi).then(data => {

            resolve(1);

            // console.log('Mutasi ', data);

          }).catch(e => {
            // console.log('Mutasi Error', e);
            reject(0);
          })

          // resolve(1);

        })
          .catch(e => {
            reject(0);
          });


      })
        .catch(e => {
          reject(0);
        });

    });

  }

  loadProducts() {
    let query = 'SELECT p.*, s.jumlah FROM product p LEFT JOIN stock s ON (s.pcode = p.pcode)';
    return this.databaseObj.executeSql(query, []).then(data => {

      let products = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push(data.rows.item(i));
        }
      }

      this.products.next(products);
    });
  }

  loadCustomers() {

    let query = 'SELECT * FROM customer';
    return this.databaseObj.executeSql(query, []).then(data => {
      // console.log(data);
      let customers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          customers.push(data.rows.item(i));
        }
      }

      this.customers.next(customers);
    });

  }

  addToCart() {
    this.loadCart();
    let status = 1;
    return status;
  }

  loadCart() {

    let userLogin = localStorage.getItem('userLogin');

    let dataCart = [];

    if (userLogin != '' && userLogin != null) {

      let datauserLogin = JSON.parse(userLogin);
      let customer_id = datauserLogin.customer_id;
      let tempOrder = localStorage.getItem('order_' + customer_id);

      if (tempOrder != '' && tempOrder != null) {
        dataCart = JSON.parse(tempOrder);
      }

    }

    this.cart.next(dataCart);

  }

  async addMyOrder(order_id, order_date, customer_id, promo_code, amount_discount, net, ppn, total, moment_unix) {

    try {

      await this.addingOrderHeader(moment_unix, order_id, order_date, customer_id, promo_code, amount_discount, net, ppn, total);

      let insertDetail = await this.addingOrderDetail(moment_unix, order_id, customer_id, order_date);
      this.loadMyOrder();
      this.loadMutasi();
      return insertDetail;
    } catch (e) {
      return 0;
    }

  }

  addingOrderHeader(moment_unix, order_id, order_date, customer_id, promo_code, amount_discount, net, ppn, total): Promise<any> {
    return new Promise((resolve, reject) => {

      let data = [moment_unix, order_id, order_date, customer_id, promo_code, amount_discount, net, ppn, total];
      let data01 = `insert  into order_header (moment_unix, order_id, order_date, customer_id, promo_code, amount_discount, net, ppn, total)
        values (?,?,?,?,?,?,?,?,?);`;

      this.databaseObj.executeSql(data01, data).then(data => {
        resolve(1);
      }).catch(e => {
        reject(0);
      });

    })
  }

  addingOrderDetail(moment_unix, order_id, customer_id, order_date): Promise<any> {
    return new Promise((resolve, reject) => {

      try {

        let tempOrder = localStorage.getItem('order_' + customer_id);
        if (tempOrder != '' && tempOrder != null) {

          let d_tempOrder = JSON.parse(tempOrder);

          for (let index = 0; index < d_tempOrder.length; index++) {
            const element = d_tempOrder[index];

            let data = [moment_unix, moment_unix, order_id, element.pcode, element.qty, element.price, element.subtotal];

            let data01 = `insert  into order_detail 
            (moment_unix,order_detail_id, order_id, pcode, qty, price, subtotal)
            values (?,?,?,?,?,?,?);`;

            this.databaseObj.executeSql(data01, data).then(data => {

              // // update stok
              let lastStock = parseInt(element.jumlah) - parseInt(element.qty);
              // console.log(lastStock);
              let data_stok = [lastStock]
              this.databaseObj.executeSql(`UPDATE stock SET jumlah = ? WHERE pcode LIKE "${element.pcode}"`, data_stok).then(data => {
                this.loadProducts();
                // console.log('stok ', data);
              }).catch(e => {
                // console.log('stok error ', e);
              });

              // add in mutasi
              let data_mutasi = [order_date, element.pcode, order_id, 'O', element.qty];
              let data01_mutasi = `insert  into mutasi_stock (tgl_mutasi, pcode, order_id, type_mutasi, jumlah) values (?,?,?,?,?);`;

              this.databaseObj.executeSql(data01_mutasi, data_mutasi).then(data => {

                resolve(1);

                // console.log('Mutasi ', data);

              }).catch(e => {
                // console.log('Mutasi Error', e);
                reject(0);
              })


            }).catch(e => {
              reject(0);
            });

          }

          resolve(1);
        } else {
          reject(0);
        }

      } catch (e) {
        reject(0);
      }



    })
  }


  loadMyOrder() {

    let userLogin = localStorage.getItem('userLogin');
    // let dataCart = [];

    if (userLogin != '' && userLogin != null) {

      let datauserLogin = JSON.parse(userLogin);
      let customer_id = datauserLogin.customer_id;

      let query = 'SELECT a.*, b.order_id, CASE WHEN a.pcode = "010001" THEN b.amount_discount ELSE 0 END AS amount_discount, c.product_name, c.photo FROM order_detail a ' +
        'LEFT JOIN order_header b ON (b.moment_unix = a.moment_unix) ' +
        'LEFT JOIN product c ON (c.pcode = a.pcode) WHERE b.customer_id = ' + customer_id;

      return this.databaseObj.executeSql(query, []).then(async data => {

        let myorders = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            myorders.push(data.rows.item(i));
          }
        }

        this.myorder.next(myorders);

      });

    }

  }


  loadMyOrderDetail(moment_unix): Promise<any> {
    return new Promise((resolve, rejects) => {

      let query = 'SELECT o.* FROM order_detail o WHERE o.moment_unix = ' + moment_unix;

      return this.databaseObj.executeSql(query, []).then(data => {

        let myordersDetails = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            myordersDetails.push(data.rows.item(i));
          }
        }

        // console.log(myordersDetails);

        resolve(myordersDetails);
      }).catch(e => {
        rejects(e);
      });

    });
  }

  loadMutasi() {

    let query = 'SELECT a.*, b.product_name, b.photo FROM mutasi_stock a LEFT JOIN product b ON (a.pcode = b.pcode)';
    return this.databaseObj.executeSql(query, []).then(data => {
      // console.log(data);
      let mutasis = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          mutasis.push(data.rows.item(i));
        }
      }

      this.mutasi.next(mutasis);
    });

  }

}
