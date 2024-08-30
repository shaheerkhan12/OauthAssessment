import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../models/requestModel';
import { OauthApiService } from '../services/oauth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router,private Oauth:OauthApiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUserAuthentication();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUserAuthentication();
  }
  private checkUserAuthentication(): boolean | UrlTree {
    const userData = this.Oauth.getData('Account-information'); 
    const user:UserData = userData;
    
    if (user && user.accessToken) {
      return true; 
    }

    return this.router.createUrlTree(['/login']);
  }
}
