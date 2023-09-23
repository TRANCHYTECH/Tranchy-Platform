import { Component } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SharedModule } from '@tranchy/shared';

@Component({
  selector: 'tranchy-app-horizontal',
  standalone: true,
  imports: [SharedModule, TopbarComponent, FooterComponent],
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})

export class HorizontalComponent { }
