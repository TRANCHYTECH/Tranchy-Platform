import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tranchy-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>Welcome</div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
