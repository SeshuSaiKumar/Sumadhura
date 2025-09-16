import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { Http, HttpResponse } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth-token';
  private timeoutKey = 'auth-timeout';
  private timeoutDuration = 30 * 60 * 1000; // 1 hour
    token: any

  constructor( private router: Router , public common: CommonService,) {
    this.token = localStorage.getItem("sessionKey");

    this.setSession(this.token);
  }



//   login(credentials: any) {
//     return this.http.post('YOUR_API_URL/login', credentials).subscribe((response: any) => {
//       this.setSession(response.token);
//     });
//   }

  setSession(token: string) {
    const expiration = Date.now() + this.timeoutDuration;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.timeoutKey, expiration.toString());
    this.startTimeoutCheck();

//      setTimeout(() => {
//     if (confirm('Your session is about to expire. Would you like to extend it?')) {
//       this.refreshToken();
//     }
//   }, this.timeoutDuration - 60000);

  }


//   refreshToken() {
//     const token = this.getToken();
//     if (token) {
//     //   this.http.post('YOUR_API_URL/refresh-token', { token }).subscribe((response: any) => {
//     //     this.setSession(response.token);
//     //   });
//     }
//   }

  logout() {
    localStorage.removeItem("dashboard_new_model");
    localStorage.removeItem("dashboard_model");
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.timeoutKey);
    this.router.navigate(['/generate-mpin']);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const expiration = localStorage.getItem(this.timeoutKey);
    if (!expiration) {
      return false;
    }
    return Date.now() < +expiration;
  }

  startTimeoutCheck() {
    setTimeout(() => {
      if (!this.isLoggedIn()) {
        this.logout();

        this.common.presentAlert("Your session has timed out due to inactivity. To continue, please login again.");
          return false;
        
      }
    }, this.timeoutDuration);
  }
}
