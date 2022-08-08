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
    // bearerExcludedUrls: [],
  };

  return () => keycloak.init(options);
}
