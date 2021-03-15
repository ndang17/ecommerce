import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'front',
    pathMatch: 'full'
  },
  {
    path: 'front',
    loadChildren: () => import('./front/front.module').then(m => m.FrontPageModule)
  },
  {
    path: 'pembeli',
    loadChildren: () => import('./pembeli/pembeli.module').then( m => m.PembeliPageModule)
  },
  {
    path: 'penjual',
    loadChildren: () => import('./penjual/penjual.module').then( m => m.PenjualPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
