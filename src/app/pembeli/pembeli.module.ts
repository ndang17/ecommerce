import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PembeliPageRoutingModule } from './pembeli-routing.module';

import { PembeliPage } from './pembeli.page';
import { LoginPage } from './login/login.page';
import { RegistrasiPage } from './registrasi/registrasi.page';
import { PanelPage } from './panel/panel.page';
import { CartPage } from './cart/cart.page';
import { MyorderPage } from './myorder/myorder.page';
import { ModalItemComponent } from 'src/app/pembeli/modal-item/modal-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PembeliPageRoutingModule
  ],
  declarations: [PembeliPage, LoginPage,
    RegistrasiPage, PanelPage,
    ModalItemComponent, CartPage, MyorderPage]
})
export class PembeliPageModule { }
