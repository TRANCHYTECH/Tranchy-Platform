import { Component } from '@angular/core';

@Component({
  selector: 'tranchy-app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
