import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { TabsPage } from './tabs-page';

import { PembeliPage } from './pembeli.page';
import { LoginPage } from './login/login.page';
import { RegistrasiPage } from './registrasi/registrasi.page';
import { PanelPage } from './panel/panel.page';
import { CartPage } from './cart/cart.page';
import { MyorderPage } from './myorder/myorder.page';

const routes: Routes = [

  {
    path: '',
    component: LoginPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'registrasi',
    component: RegistrasiPage
  },
  {
    path: 'panel',
    component: PanelPage
  },
  {
    path: 'cart',
    component: CartPage
  },
  {
    path: 'myorder',
    component: MyorderPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PembeliPageRoutingModule { }
