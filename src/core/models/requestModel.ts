export interface removeObj{
    accessToken:string,
    githubId:string
  }
export  interface UserData {
    _id:string,
    githubId: string;
    username: string;
    email: string;
    avatarUrl: string;
    accessToken: string;
    loginTime: Date;
    syncType: 'full' | 'incremental';
    lastSyncTime: Date;
  }
export  interface UserStats {
    userId: string;
    userLogin: string;
    totalCommits: number;
    totalPullRequests: number;
    totalIssues: number;
  }