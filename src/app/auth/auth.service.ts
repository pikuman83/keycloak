import { Injectable } from '@angular/core';
import {
  KeycloakEvent,
  KeycloakEventType,
  KeycloakService,
} from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private keycloakService: KeycloakService) {
    this.keycloakService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnTokenExpired) {
          console.log({ e });
          keycloakService.updateToken(20);
        }
        if (e.type == KeycloakEventType.OnAuthLogout) {
          console.log('logged out');
        }
        if (e.type == KeycloakEventType.OnActionUpdate) {
          console.log({ e });
        }
        if (e.type == KeycloakEventType.OnReady) {
          console.log('keycloak on ready', { e });
        }
      },
    });
  }

  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      const userDetails: KeycloakTokenParsed | undefined =
        this.keycloakService.getKeycloakInstance().idTokenParsed;
      return userDetails;
    } catch (e) {
      console.error('Exception', e);
      return undefined;
    }
  }

  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  decodePayload(): Promise<any> {
    return this.keycloakService.getToken().then((token: string) => {
      const base64Url = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payload = decodeURIComponent(
        window
          .atob(base64Url)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(payload);
    });
  }

  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  public login(): void {
    this.keycloakService.login();
  }

  public async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  public logout(): void {
    this.keycloakService.logout();
  }

  public redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}
