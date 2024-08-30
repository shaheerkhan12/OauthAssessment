import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RedirectComponent } from './redirect/redirect.component';
import { OauthApiService } from 'src/core/services/oauth-api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    RedirectComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,MatExpansionModule,MatButtonModule,MatIconModule,HttpClientModule

  ],
  providers: [OauthApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
