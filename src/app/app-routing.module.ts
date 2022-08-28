import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  // { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
