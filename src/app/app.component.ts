import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Unblur Keycloak';

  constructor(private auth: AuthService) {}
  async ngOnInit(): Promise<void> {
    if (await this.auth.isLoggedIn())
      console.log(
        'logged in sucessfully, if user role includes "manage-users" syncronize users and load mission, else, load mission'
      );
  }

  logMyInfo() {
    console.log('My info: ', this.auth.getLoggedUser());
    this.auth.logEvents();
  }

  logMyInfo1() {
    this.auth
      .loadUserProfile()
      .then((profile) => console.log('keycloak profile: ', profile));
  }

  logMyInfo2() {
    console.log('Roles: ', this.auth.getRoles());
  }

  logMyInfo3() {
    let token: string;
    this.auth.getToken().then((tk) => (token = tk));
    this.auth
      .decodePayload()
      .then((payload) =>
        console.log('Decoded token payload: ', payload, 'Token: ', token)
      );
  }

  logout() {
    this.auth.logout();
  }
}
