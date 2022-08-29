import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<boolean> {
  const options: KeycloakOptions = {
    config: environment.keycloak,
    initOptions: {
      onLoad: 'check-sso',
      // silentCheckSsoRedirectUri:
      //   window.location.origin + '/assets/silent-check-sso.html',
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
    environment.auth === 'SSO' ? keycloak.init(options) : Promise.resolve(true);
}
