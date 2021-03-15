import { Component } from '@angular/core';

// import { DbService } from 'src/app/_service/db.service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  databaseObj: SQLiteObject;
  readonly database_name: string = "ecommerce.db";
  readonly table_name: string = "ecommerce";

  name_model: string = "";
  row_data: any = [];

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  constructor(
    // private db: DbService,
    private platform: Platform,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter
  ) {

    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }


  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        // alert('ecommerce Database Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
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

  async createTable() {

    try {

      // ======= STOCK =========

      let table_name_07 = `stock`;
      let table_07 = `pcode varchar(200) NOT NULL, jumlah int(11) DEFAULT 0`;

      let data07 = `insert into ${table_name_07} (pcode,jumlah) values ('010001',200)`;
      let rows_07 = await this.dummyCreate(table_name_07, table_07, true, data07);
      alert(rows_07);

      // ======= CUSTOMER =========

      let table_name_01 = `customer`;
      let table_01 = `customer_id int(11) PRIMARY KEY, customer_name varchar(200) DEFAULT NULL,
                    address text DEFAULT NULL, latitude varchar(100) DEFAULT NULL, longitude varchar(100) DEFAULT NULL `;
      let data01 = `insert  into ${table_name_01} (customer_id, customer_name, address, latitude, longitude) values
          (1, 'paijo', 'jl. Kutilang berkicau 12, jakarta barat', '-6.213280', '106.776860');`;
      let rows_01 = await this.dummyCreate(table_name_01, table_01, true, data01);
      alert(rows_01);

      // ======= PRODUCT =========

      let table_name_05 = `product`;
      let table_05 = `pcode varchar(200) DEFAULT NULL, product_name text DEFAULT NULL,
      photo text DEFAULT NULL, price decimal(65, 2) DEFAULT NULL `;

      let data05 = `insert  into ${table_name_05}(pcode,product_name,'photo',price) 
      values ('010001','MIRANDA H.C N.BLACK 30.MC1','',10000.00)`;
      let rows_05 = await this.dummyCreate(table_name_05, table_05, true, data05);
      alert(rows_05);

      // ======= PROMO =========

      let table_name_06 = `promo`;
      let table_06 = `promo_code varchar(200) NOT NULL, promo_name text DEFAULT NULL`;

      let data06 = `insert  into ${table_name_06} (promo_code,promo_name) values 
      ('pmo-001','Setiap pembelian MIRANDA H.C N.BLACK 30.MC1, mendapat porongan Rp. 1.000,-')`;
      let rows_06 = await this.dummyCreate(table_name_06, table_06, true, data06);
      alert(rows_06);



      // ======= MUTASI =========

      let table_name_02 = `mutasi_stock`;
      let table_02 = `id bigint(20) PRIMARY KEY NOT NULL, tgl_mutasi date DEFAULT NULL, 
      pcode varchar(200) NOT NULL, order_id varchar(200) DEFAULT NULL, 
      type_mutasi varchar(1) DEFAULT NULL, jumlah int(11) DEFAULT NULL`;
      let rows_02 = await this.dummyCreate(table_name_02, table_02, false, data01);
      alert(rows_02);

      // ======= ORDER DETAIL =========

      let table_name_03 = `order_detail`;
      let table_03 = `order_detail_id bigint(20) PRIMARY KEY NOT NULL, order_id varchar(200) NOT NULL,
                        pcode varchar(200) DEFAULT NULL, qty int(11) DEFAULT NULL,
                        price decimal(65,2) DEFAULT NULL, subtotal decimal(65,2) DEFAULT NULL`;
      let rows_03 = await this.dummyCreate(table_name_03, table_03, false, data01);
      alert(rows_03);

      // ======= ORDER HEADER =========

      let table_name_04 = `order_header`;
      let table_04 = `order_id varchar(200) PRIMARY KEY NOT NULL, order_date date DEFAULT NULL, 
      customer_id int(11) NOT NULL, promo_code varchar(200) DEFAULT NULL,
      amount_discount decimal(65,2) DEFAULT NULL, net decimal(65,2) DEFAULT NULL,
      ppn decimal(65,2) DEFAULT NULL, total decimal(65,2) DEFAULT NULL`;
      let rows_04 = await this.dummyCreate(table_name_04, table_04, false, data01);
      alert(rows_04);







    } catch (e) {

      alert('Error ' + e);

    }

  }


  insertRow() {
    // Value should not be empty
    if (!this.name_model.length) {
      alert("Enter Name");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (Name) VALUES ('${this.name_model}')
    `, [])
      .then(() => {
        alert('Row Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
    `
      , [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Delete single row 
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.table_name} WHERE pid = ${item.pid}
    `
      , [])
      .then((res) => {
        alert("Row Deleted!");
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // Enable update mode and keep row data in a variable
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.name_model = item.Name;
  }

  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.table_name}
      SET Name = '${this.name_model}'
      WHERE pid = ${this.to_update_item.pid}
    `, [])
      .then(() => {
        alert('Row Updated!');
        this.updateActive = false;
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

}
