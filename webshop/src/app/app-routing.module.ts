import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthModule } from './auth/auth.module';
import { AuthenticationGuard } from './auth.guard';
import { HomePageModule } from './home-page/home-page.module';
import { CartPageModule } from './cart-page/cart-page.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { FavoritePageModule } from './favorite-page/favorite-page.module';
import { AdminPageModule } from './admin-page/admin-page.module';
import { EditPageModule } from './edit-page/edit-page.module';

const routes: Routes = [
  { path: 'login', loadChildren: () => AuthModule },
  { path: '', loadChildren: () => HomePageModule },
  { path: 'cart', loadChildren: () => CartPageModule },
  { path: 'favorites', loadChildren: () => FavoritePageModule },
  {
    path: 'admin',
    loadChildren: () => AdminPageModule,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'edit',
    loadChildren: () => EditPageModule,
    canActivate: [AuthenticationGuard],
  },

  { path: 'profile/:username', loadChildren: () => UserProfileModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
