import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private token: string;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getToken() {
      return this.token;
  }

  getUserId() {
      return this.userId;
  }

  getIsAuthenticated() {
      return this.isAuthenticated;
  }

  getAuthStatusListener() {
        return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    console.log('Auth Data is: email: ' + authData.email + ' password: '  + authData.password);
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(() => {
            this.router.navigate(['/']);
        }, error => {
            this.authStatusListener.next(false);
        });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.httpClient.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
            console.log(expirationDate);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.saveAuthData(token, expirationDate, this.userId);
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
        }
      }, error => {
          this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
      const authInformation = this.getAuthData();
      if (!authInformation) {
          return;
      }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
         this.token = authInformation.token;
         this.isAuthenticated = true;
         this.userId = authInformation.userId;
         this.setAuthTimer(expiresIn / 1000);
         this.authStatusListener.next(true); // broadcast that user is authenticated
      }
  }

  logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.userId = null;
      this.authStatusListener.next(false);
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
      console.log('Setting timer for ' + duration);
      this.tokenTimer = setTimeout(() => {
          this.logout();
      }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
      console.log ('setting auth data ' + token + ' ' + expirationDate.toISOString());
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
      console.log('clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');
  }

  private getAuthData() {
      if (localStorage.getItem('token') &&
          localStorage.getItem('expirationDate')) {
          return ({
              token: localStorage.getItem('token'),
              expirationDate: new Date(localStorage.getItem('expirationDate')),
              userId: localStorage.getItem('userId')
          });
      } else {
          return;
      }
  }
}
