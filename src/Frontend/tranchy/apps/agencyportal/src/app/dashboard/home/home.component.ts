import { ChangeDetectionStrategy, Component, OnInit, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranchyAskAPIService } from '../../_state/askapi/askapi.service';
import { SharedModule } from '@tranchy/shared';
import { PortalConfig } from '../../app.config';
import { injectPortalConfig } from '@tranchy/core';
import { QuestionOutput } from '../../_state/askapi/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'tranchy-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  askAPIService = inject(TranchyAskAPIService);
  httpClient = inject(HttpClient);
  appConfig = injectPortalConfig<PortalConfig>();
  question = signal<Partial<QuestionOutput>>({});
  user = signal<Partial<Object>>({});
  async ngOnInit(): Promise<void> {
    this.askAPIService.getQuestionById('1245').subscribe(q => this.question.set(q));
    this.httpClient.get('/ask:/bff/user').subscribe(u => this.user.set(u));
  }
}
