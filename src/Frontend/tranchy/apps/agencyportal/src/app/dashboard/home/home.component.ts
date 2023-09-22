import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranchyAskAPIService } from '../../state/askapi/askapi.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tranchy-home',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  askAPIService = inject(TranchyAskAPIService);
  httpClient = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    const a = await this.askAPIService.getQuestionById('1245').toPromise();
    console.log(a);

    const b = await this.httpClient.get('/ask:/bff/user').toPromise();
    console.log(b);
  }
}
