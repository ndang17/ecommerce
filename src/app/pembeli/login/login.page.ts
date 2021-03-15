import { Component, OnInit } from '@angular/core';

import { Platform, ActionSheetController, NavController } from '@ionic/angular';

import { DatabaseService } from 'src/app/_service/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  listUser = [];

  constructor(
    private db: DatabaseService,
    public NavController: NavController
  ) { }

  ngOnInit() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getCustomer().subscribe(data => {
          this.listUser = data;
          console.log(this.listUser);
        })
      }
    });

  }

  loginAs(item: any) {

    localStorage.setItem('userLogin', JSON.stringify(item));

    // panel
    this.NavController.navigateRoot(['/pembeli/panel'], { replaceUrl: true });

  }

  goBack() {
    this.NavController.navigateBack([''], { replaceUrl: true });
  }
}
