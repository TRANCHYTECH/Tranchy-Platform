import { Component, OnInit, effect, inject, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, UserService } from './core/services/user.service';
import { CommonModule } from '@angular/common';
import { HorizontalComponent } from './layout/horizontal/horizontal.component';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../assets/i18n/vi.json';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HorizontalComponent],
  selector: 'tranchy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userService = inject(UserService);
  primengConfig = inject(PrimeNGConfig);
  translate = inject(TranslateService);
  
  title = 'agencyportal';
  user: User = { isLoggedIn: false, name: '' };
  constructor() {
    this.translate.setTranslation('vi', defaultLanguage);
    this.translate.setDefaultLang('vi');

    effect(() => {
      const req = this.userService.user();
      untracked(() => {
        this.user = req;
      });
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
}

  logout() {
    this.userService.logout();
  }

  login() {
    this.userService.login();
  }
}
