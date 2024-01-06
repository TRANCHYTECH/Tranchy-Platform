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
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { TranchyAskApiDocumentationService } from '../../_state/askapi/askapi.service';
import { GetUserResponse, Question, QuestionOutput } from '../../_state/askapi/models';
import { PortalConfig } from '../../app.config';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbItem, BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'tranchy-question-list',
  standalone: true,
  imports: [SharedModule, ConfirmDialogModule, TableModule, DialogModule, InputTextModule, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionListComponent implements OnInit {
  askAPIService = inject(TranchyAskApiDocumentationService);
  httpClient = inject(HttpClient);
  appConfig = injectPortalConfig<PortalConfig>();

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  question = signal<Partial<QuestionOutput>>({});

  questions = signal<Question[]>([]);
  showQuestionDialog = false;
  user: Partial<GetUserResponse> = {};

  fb = inject(FormBuilder);
  questionForm: FormGroup;

  breadCrumbItems: Array<BreadcrumbItem> = [];
  /**
   *
   */
  constructor() {
    this.questionForm = this.fb.group({
      title: null,
      status: null,
      priority: null,
      categories: null
    });
  }

  async ngOnInit(): Promise<void> {
    const questions = await firstValueFrom(this.askAPIService.listAllQuestions());
    this.questions.set(questions);
  }

  viewDetail(question: Question) {
    this.showQuestionDialog = true;

    const formData = (({ priorityId, questionCategoryIds, status, supportLevel, title }) => ({ priorityId, questionCategoryIds, status, supportLevel, title }))(question);

    this.questionForm.setValue({
      title: formData.title,
      status: formData.status,
      priority: formData.priorityId,
      categories: formData.questionCategoryIds?.join(', ')
    });
  }

  hideDetail() {
    this.showQuestionDialog = false;
  }
}
