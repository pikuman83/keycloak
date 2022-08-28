import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  KeycloakEventType,
  KeycloakOptions,
  KeycloakService,
} from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  url = 'http://localhost/irisws/get/skill';

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {
    this.keycloakService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnTokenExpired) {
          console.log({ e });
          keycloakService.updateToken(20);
        }
        if (e.type == KeycloakEventType.OnAuthLogout) {
          alert('Logged out, Token revoked');
          console.log('logged out, token revoked');
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

  getSkills(token: string): Observable<any> {
    if (token) {
      this.httpOptions.headers.append('Authorization', `Bearer ${token}`);
      return this.http.get<any>(this.url, this.httpOptions);
    }
    return of();
  }

  restartKC(): () => Promise<boolean> {
    const options: KeycloakOptions = {
      config: environment.keycloak,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        enableLogging: true,
      },
      // If the app is doing continous BE requests, we can disable auto token update (with this following behaviour)
      // so that it expires if the user has not logedout, further logout behaviour should be extended manualy.
      shouldUpdateToken: (request) => {
        return !(request.headers.get('token-update') === 'false');
      },
      // bearerExcludedUrls: [],
    };

    return () =>
      environment.auth === 'SSO'
        ? this.keycloakService.init(options)
        : Promise.resolve(true);
  }
}
