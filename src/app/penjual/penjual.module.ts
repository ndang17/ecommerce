import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenjualPageRoutingModule } from './penjual-routing.module';

import { PenjualPage } from './penjual.page';
import { TambahbarangPage } from './tambahbarang/tambahbarang.page';
import { MutasiPage } from './mutasi/mutasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenjualPageRoutingModule
  ],
  declarations: [PenjualPage, TambahbarangPage, MutasiPage]
})
export class PenjualPageModule { }
