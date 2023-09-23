import { Component, OnInit, effect, inject, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HorizontalComponent } from './_layout/horizontal/horizontal.component';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../assets/i18n/vi.json';
import { SharedModule } from '@tranchy/shared';

@Component({
  standalone: true,
  imports: [SharedModule, RouterModule, HorizontalComponent],
  selector: 'tranchy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  primengConfig = inject(PrimeNGConfig);
  translate = inject(TranslateService);

  title = 'agencyportal';
  constructor() {
    this.translate.setTranslation('vi', defaultLanguage);
    this.translate.setDefaultLang('vi');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
