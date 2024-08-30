import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { OauthApiService } from 'src/core/services/oauth-api.service';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,DashboardRoutingModule,MatExpansionModule,MatButtonModule,MatIconModule,HttpClientModule

  ],
  providers:[OauthApiService]

})
export class DashboardModule { }
