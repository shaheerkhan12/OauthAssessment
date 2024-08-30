import { environment } from 'src/environments/environment';

export class EndPointsConfig {
  public static get ApiUrl() {
    return {
      Url: `${environment.apiUrl}`,
    };
  }

  public static get Oauth() {
    return {
      Controller: '/Oauth/',
      EndPoints: {
        handShake: 'HandShake',
        TokenCallback: 'Token-Callback',
        detachSession: 'detach-session',
        userDetails: 'userDetails',


      },
    };
  }
  
}
