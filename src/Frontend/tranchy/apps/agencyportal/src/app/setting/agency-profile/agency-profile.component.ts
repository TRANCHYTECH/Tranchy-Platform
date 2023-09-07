import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tranchy-agency-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencyProfileComponent {}
