import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenjualPage } from './penjual.page';
import { TambahbarangPage } from './tambahbarang/tambahbarang.page';
import { MutasiPage } from './mutasi/mutasi.page';

const routes: Routes = [
  {
    path: '',
    component: PenjualPage
  },
  {
    path: 'tambahbarang',
    component: TambahbarangPage
  },
  {
    path: 'mutasi',
    component: MutasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenjualPageRoutingModule { }
