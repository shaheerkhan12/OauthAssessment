import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, switchMap } from 'rxjs';
import { OauthApiService } from 'src/core/services/oauth-api.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent {
  constructor(
    private active: ActivatedRoute,
    private serv: OauthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.active.queryParams.subscribe((params) => {
      let code = params['code'];
      this.accessToken(code);
    });
  }
  accessToken(code: string) {
    this.serv
      .accessToken(code)
      .pipe(
        switchMap((resp: any) => {
          // sessionStorage.setItem('authToken', resp.accessToken);
          return this.serv.userDetails(resp.accessToken);
        })
      )
      .subscribe((userDetails) => {
        console.log('Final response:', userDetails);
        this.serv.setData('Account-information', userDetails)
        this.router.navigate(['/dashboard']);
      });
  }
}
