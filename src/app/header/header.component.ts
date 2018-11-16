import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    private userIsAuthenticated = false;

    private authListenerSubscription: Subscription;

    constructor(private authService: AuthService) {

    }

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.authListenerSubscription = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
        });
    }

    ngOnDestroy(): void {
        this.authListenerSubscription.unsubscribe();
    }

    onLogout() {
        this.authService.logout();
    }

}
