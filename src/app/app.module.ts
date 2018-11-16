import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HeaderComponent} from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import {AngularMaterialModule} from './angular-material.module';
import {PostsModule} from './posts/posts.module';
import {AuthModule} from './auth/auth.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,

        ErrorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PostsModule,
        AuthModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularMaterialModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }],
    bootstrap: [AppComponent],
    entryComponents: [ErrorComponent]
})
export class AppModule {
}
