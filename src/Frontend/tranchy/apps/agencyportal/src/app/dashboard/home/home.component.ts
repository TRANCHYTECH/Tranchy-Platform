import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
  question?: Observable<QuestionOutput>;
  user?: Observable<Object>;
  async ngOnInit(): Promise<void> {
    this.question = this.askAPIService.getQuestionById('1245');
    this.user = this.httpClient.get('/ask:/bff/user');
  }
}
