import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EndPointsConfig } from './endPoints.config';
import { removeObj } from '../models/requestModel';


@Injectable({
  providedIn: 'root'
})
export class OauthApiService {

  constructor(private http: HttpClient) { }

  handShake() {
    return this.http.get(
      `${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.handShake}`);
  }
  accessToken(accessCode : string){
    return this.http.get(
      `${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.TokenCallback}?accessCode=${accessCode}`);
  }
  userDetails(token : string){
    return this.http.get(
      `${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.userDetails}?token=${token}`);
  }
  removeAuthorization(data:removeObj){
    return this.http.post(
      `${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.detachSession}`,data
    )
  }
  getOrganizations(yourAuthToken:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${yourAuthToken}`, 
      'Content-Type': 'application/json' 
    });
    return this.http.get(`${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.gitOrgans}`, { headers });
  }

  getRepos(org: string,yourAuthToken:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${yourAuthToken}`,
      'Content-Type': 'application/json' 
    });
    return this.http.get(`${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.gitOrgans}/${org}/repos`, { headers });
  }

  getCommits(owner: string, repo: string,yourAuthToken:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${yourAuthToken}`, 
      'Content-Type': 'application/json' 
    });
    return this.http.get(`${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.gitOrgansRepos}/${owner}/${repo}/commits`, { headers });
  }
  getRepoData(org: string, repo: string,yourAuthToken:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${yourAuthToken}`, 
      'Content-Type': 'application/json' 
    });
    return this.http.get(`${EndPointsConfig.ApiUrl.Url}${EndPointsConfig.Oauth.Controller}${EndPointsConfig.Oauth.EndPoints.gitOrgans}/repo/${org}/${repo}`, { headers });
  }
   setData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getData(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null; 
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  clearData(): void {
    localStorage.clear();
  }
}
