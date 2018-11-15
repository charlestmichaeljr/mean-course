import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        // Set the Authorization header with the token we got from the AuthService.
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
        });

        return next.handle(authRequest);
    }

}
