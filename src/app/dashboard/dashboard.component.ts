import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { from, map, mergeMap, switchMap, toArray } from 'rxjs';
import { UserData, UserStats, removeObj } from 'src/core/models/requestModel';
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

  objectiveArowData: any[] = [];
  objectiveBrowData: any[] = [];

  objectiveAColumns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'html_url', headerName: 'Link', cellRenderer: (params: { value: any; }) => `<a href="${params.value}" target="_blank">${params.value}</a>` },
    { field: 'slug', headerName: 'Slug' },
    { field: 'included', headerName: 'Included', checkboxSelection: true }
  ];
  objectiveBColumns = [
    { headerName: 'UserID', field: 'userId' },
    { headerName: 'User', field: 'userLogin' },
    { headerName: 'Total Commits', field: 'totalCommits' },
    { headerName: 'Total Pull Requests', field: 'totalPullRequests' },
    { headerName: 'Total Issues', field: 'totalIssues' }
  ];
  
  defaultColDef: ColDef = {
    flex: 1,
  };
  token: string;
  rowSelection:any = "multiple";
  selectedRepo: any;

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
          this.objectiveArowData = [...this.objectiveArowData, ...repos];
        });
      });
    });
  }
  onRepoSelect(event: any) {
     this.selectedRepo =  event.api.getSelectedRows();;
   

    
  }
  listContributions(){
    const repoRequests:any = from(this.selectedRepo).pipe(
      mergeMap((selectedRepo: any) => 
        this.OauthService.getRepoData(selectedRepo.owner.login, selectedRepo.name, this.token).pipe(
          map((userStats: any) => {
            // Extract commits, pulls, issues for each repository
            const commits = userStats.commits;
            const pulls = userStats.pulls;
            const issues = userStats.issues;
            return { commits, pulls, issues }; // Return the extracted data
          })
        )
      ),
      toArray() 
    );
    repoRequests.subscribe((repoStatsArray: any[]) => {
      const userStatsMap: { [userId: string]: UserStats } = {};
  
      repoStatsArray.forEach(({ commits, pulls, issues }) => {
        this.processUserContributions(commits, userStatsMap, 'commit');
        this.processUserContributions(pulls, userStatsMap, 'pullRequest');
        this.processUserContributions(issues, userStatsMap, 'issue');
      });
      this.objectiveBrowData =  Object.values(userStatsMap);
   
  })
}
  
  processUserContributions(
    contributions: any[],
    userStatsMap: Record<string, any>,
    type: 'commit' | 'pullRequest' | 'issue'
  ) {
    contributions.forEach((contribution: any) => {
      const userId = contribution.author?.id || contribution.user?.id; 
      const userLogin = contribution.author?.login || contribution.user?.login;
  
      if (userId) {
        if (!userStatsMap[userId]) {
          userStatsMap[userId] = {
            userId,
            userLogin,
            totalCommits: 0,
            totalPullRequests: 0,
            totalIssues: 0,
          };
        }
  
        // Update based on contribution type
        if (type === 'commit') {
          userStatsMap[userId].totalCommits += 1;
        } else if (type === 'pullRequest') {
          userStatsMap[userId].totalPullRequests += 1;
        } else if (type === 'issue') {
          userStatsMap[userId].totalIssues += 1;
        }
      }
    });
  }
}
