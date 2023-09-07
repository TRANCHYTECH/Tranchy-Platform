import { Component, effect, inject, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, UserService } from './core/services/user.service';
import { CommonModule } from '@angular/common';
import { HorizontalComponent } from './layout/horizontal/horizontal.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HorizontalComponent],
  selector: 'tranchy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userService = inject(UserService);
  title = 'agencyportal';
  user: User = { isLoggedIn: false, name: '' };
  constructor() {
    effect(() => {
      const req = this.userService.user();
      untracked(() => {
        this.user = req;
      });
    });
  }

  logout() {
    this.userService.logout();
  }

  login() {
    this.userService.login();
  }
}
