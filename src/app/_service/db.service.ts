import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  private storage: SQLiteObject;
  // songsList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  productTable: string = `CREATE TABLE IF NOT EXISTS  products (
                                    id INTEGER PRIMARY KEY,
                                    sku TEXT,
                                    barcode TEXT,
                                    title TEXT NOT NULL,
                                    description TEXT,
                                    quantity REAL,
                                    unit VARCHAR,
                                    unitPrice REAL,
                                    minQuantity INTEGER,
                                    familly_id INTEGER,
                                    location_id INTEGER,
                                    FOREIGN KEY(familly_id) REFERENCES famillies(id),
                                    FOREIGN KEY(location_id) REFERENCES locations(id)
                                    );`;

  familyTable: string = `CREATE TABLE IF NOT EXISTS famillies (
                                    id INTEGER PRIMARY KEY,
                                    reference VARCHAR(32) NOT NULL,
                                    name TEXT NOT NULL,
                                    unit VARCHAR);`;

  locationTable: string = `CREATE TABLE IF NOT EXISTS locations (
                                        id INTEGER PRIMARY KEY,
                                        name TEXT NOT NULL);`;

  transactionTable: string = `CREATE TABLE IF NOT EXISTS transactions (
                                        id INTEGER PRIMARY KEY,
                                        date TEXT,
                                        quantity REAL,
                                        unitCost REAL,
                                        reason VARCHAR,
                                        upc TEXT,
                                        comment TEXT,
                                        product_id INTEGER,
                                        FOREIGN KEY(product_id) REFERENCES products(id));`;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {

    // alert('sini');

    // this.sqlite.create({ name: "data.db", location: "default" }).then((db: SQLiteObject) => {
    //   this.storage = db;
    //   this.createTables();
    // }, (error) => {
    //   console.log("ERROR: ", error);
    // });

    // this.platform.ready().then(() => {
    //   this.sqlite.create({
    //     name: 'ecommerce.db',
    //     location: 'default'
    //   })
    //     .then((db: SQLiteObject) => {
    //       this.storage = db;
    //       this.getBasicData();
    //     });
    // });

  }

  async createTables() {
    try {
      await this.storage.executeSql(this.familyTable, []);
      await this.storage.executeSql(this.locationTable, []);
      await this.storage.executeSql(this.productTable, []);
      await this.storage.executeSql(this.transactionTable, []);
    } catch (e) {
      console.log("Error !");
    }
  }

  getBasicData() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getProduct();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  // Get list
  getProduct() {
    return this.storage.executeSql('SELECT * FROM product', []).then(res => {

      console.log(res);
      // let items: Song[] = [];
      // if (res.rows.length > 0) {
      //   for (var i = 0; i < res.rows.length; i++) {
      //     items.push({
      //       id: res.rows.item(i).id,
      //       artist_name: res.rows.item(i).artist_name,
      //       song_name: res.rows.item(i).song_name
      //     });
      //   }
      // }
      // this.songsList.next(items);
    });
  }

}
