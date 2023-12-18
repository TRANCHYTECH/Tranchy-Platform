import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { injectPortalConfig } from '@tranchy/core';
import { SharedModule } from '@tranchy/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TranchyAskApiDocumentationService } from '../../_state/askapi/askapi.service';
import { QuestionOutput } from '../../_state/askapi/models';
import { PortalConfig } from '../../app.config';
import { BreadcrumbItem, BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'tranchy-home',
  standalone: true,
  imports: [SharedModule, ConfirmDialogModule, BreadcrumbsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  breadCrumbItems!: Array<BreadcrumbItem>;

  askAPIService = inject(TranchyAskApiDocumentationService);
  httpClient = inject(HttpClient);
  appConfig = injectPortalConfig<PortalConfig>();

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  question = signal<Partial<QuestionOutput>>({});
  user = signal<Partial<Object>>({});

  async ngOnInit(): Promise<void> {
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Home', active: true }
    ];

    this.askAPIService
      .getQuestionById('1245')
      .subscribe((q) => this.question.set(q));
    this.httpClient.get('/ask:/bff/user').subscribe((u) => this.user.set(u));
  }

  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
