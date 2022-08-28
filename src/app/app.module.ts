import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AppComponent, LogoutComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, AuthModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
