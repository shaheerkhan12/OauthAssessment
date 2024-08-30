import { Component } from '@angular/core';
import { OauthApiService } from 'src/core/services/oauth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  panelState: boolean = true;

  constructor(private OauthService:OauthApiService){}

  panelOpenState(state: boolean) {
    this.panelState = state
  }

  redirect() {
    this.OauthService.handShake().subscribe({
      next: (response:any) => {
        window.location.href = response.authUrl;   
         },
      error: (error) => {
        console.error('Handshake error:', error);
      },
      complete: () => {
        console.log('Handshake observable completed.');
      }
    })
  }

}
