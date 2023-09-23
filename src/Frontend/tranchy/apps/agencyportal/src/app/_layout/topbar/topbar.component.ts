import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy, effect, untracked, inject } from '@angular/core';
import { User, UserService } from '@tranchy/core';
import { SharedModule } from '@tranchy/shared';

@Component({
  selector: 'tranchy-app-topbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  userService = inject(UserService);

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
