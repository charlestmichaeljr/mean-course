import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ErrorComponent} from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialogService: MatDialog) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((ex: HttpErrorResponse) => {
                // alert(ex.error.message.message);
                let errorMessage = 'An unknown error occurred';
                console.log(ex);
                if (ex.error.message) {
                    errorMessage = ex.error.message;
                }
                this.dialogService.open(ErrorComponent, { data: {message: errorMessage}});
                return throwError(ex);
            })
        );
    }

}
