import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        /*
            return true = route is accessible
            return false = route not accessible
         */
        const isAuth = this.authService.getIsAuthenticated();
        if (!isAuth) {
            this.router.navigate(['/auth/login']);
        } else {
            return isAuth;
        }
    }

}
