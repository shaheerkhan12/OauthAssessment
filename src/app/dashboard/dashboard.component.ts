import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { switchMap } from 'rxjs';
import { UserData, removeObj } from 'src/core/models/requestModel';
import { OauthApiService } from 'src/core/services/oauth-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  panelState: boolean = false;
  userData: UserData = {
    _id: '',
    githubId: '',
    username: '',
    email: '',
    avatarUrl: '',
    accessToken: '',
    loginTime: new Date(),
    syncType: 'full',
    lastSyncTime: new Date()
  };
  localDate: Date;

  rowData: any[] = [];
  columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'html_url', headerName: 'Link', cellRenderer: (params: { value: any; }) => `<a href="${params.value}" target="_blank">${params.value}</a>` },
    { field: 'slug', headerName: 'Slug' },
    { field: 'included', headerName: 'Included', checkboxSelection: true }
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  token: string;
  constructor(private OauthService: OauthApiService, private router: Router) {
    let data = this.OauthService.getData('Account-information');
    this.userData = data
    this.localDate = new Date(this.userData.lastSyncTime);
    this.token = this.userData.accessToken ? this.userData.accessToken : '';
    this.getUserOrganization()
  }
  panelOpenState(state: boolean) {
    this.panelState = state;
  }
  disconnect() {
    let data: removeObj = {
      accessToken: this.userData.accessToken ? this.userData.accessToken : '',
      githubId: this.userData.githubId,
    };
    this.removeAuthorization(data);
  }
  updateToken($event:any) {
    let token = this.userData.accessToken ? this.userData.accessToken : '';
    this.OauthService.userDetails(token).subscribe((userDetails:any) => {
      console.log('Final response:', userDetails);
      this.OauthService.setData('Account-information', userDetails);
      this.userData= userDetails;
      this.localDate = new Date(this.userData.lastSyncTime);
    });
  }

  removeAuthorization(data: removeObj) {
    this.OauthService.removeAuthorization(data).subscribe({
      next: (response: any) => {
        if (response.status == '200') {
          this.router.navigate(['/login']);
          this.OauthService.clearData();
        } else {
          console.log(response.message);
        }
      },
      error: (error) => {
        console.error('disconnection error:', error);
      },
      complete: () => {
        console.log('disconnection completed.');
      },
    });
  }
  getUserOrganization(){
    this.OauthService.getOrganizations(this.token).subscribe((orgs: any) => {
      orgs.forEach((org: any) => {
        this.OauthService.getRepos(org.login,this.token).subscribe((repos: any) => {
          this.rowData = [...this.rowData, ...repos];
        });
      });
    });
  }
  onRepoSelect(event: any) {
    const selectedRepo = event.data;
    if (selectedRepo.included) {
      this.OauthService.getCommits(selectedRepo.owner.login, selectedRepo.name,this.token).subscribe(commits => {
        console.log('Commits for the selected repo:', commits);
      });
    }
  }
}
