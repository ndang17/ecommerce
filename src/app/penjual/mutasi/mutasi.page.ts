import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

import 'moment/locale/id';
import * as moment from 'moment';

@Component({
  selector: 'app-mutasi',
  templateUrl: './mutasi.page.html',
  styleUrls: ['./mutasi.page.scss'],
})
export class MutasiPage implements OnInit {

  listMutasi = [];

  constructor(
    private db: DatabaseService,
    public NavController: NavController,
    public alertController: AlertController,
    public loadingController: LoadingController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.db.loadMutasi();
        this.db.getMutasi().subscribe(data => {

          this.listMutasi = data;
          console.log(this.listMutasi);


        });

      }
    });


  }

  confertDate(date: any) {

    return moment(date).format('dddd, DD MMM YYYY');

  }

  goBack() {
    this.NavController.navigateBack(['/penjual'], { replaceUrl: true });
  }
}
