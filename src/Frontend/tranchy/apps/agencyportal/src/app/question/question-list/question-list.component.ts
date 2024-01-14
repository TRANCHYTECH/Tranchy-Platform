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
import { NgxSpinnerService } from "ngx-spinner";

import { TranchyAskApiDocumentationService } from '../../_state/askapi/askapi.service';
import { GetUserResponse, Question, QuestionOutput } from '../../_state/askapi/models';
import { PortalConfig } from '../../app.config';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbItem, BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';

enum Decision {
  Accepted,
  Rejected
}

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
  fb = inject(FormBuilder);
  spinner = inject(NgxSpinnerService);

  question = signal<Partial<QuestionOutput>>({});
  selectedQuestion: Question | undefined = undefined;

  questions = signal<Question[]>([]);
  showQuestionDialog = false;
  showApprovalDialog = false;
  decision: Decision | undefined = undefined;
  user: Partial<GetUserResponse> = {};

  questionForm: FormGroup;
  approvalForm: FormGroup;

  breadCrumbItems: Array<BreadcrumbItem> = [];
  /**
   *
   */
  constructor() {
    this.questionForm = this.fb.group({
      title: null,
      status: null,
      priority: null,
      categories: null,
      comment: null
    });
    this.approvalForm = this.fb.group({
      comment: null
    });
  }

  async ngOnInit(): Promise<void> {
    await this.reloadQuestions();
  }

  viewDetail(question: Question) {
    this.showQuestionDialog = true;
    this.decision = undefined;
    this.selectedQuestion = question;

    const formData = (({ priorityId, questionCategoryIds, status, supportLevel, title, comment }) => ({ priorityId, questionCategoryIds, status, supportLevel, title, comment }))(question);

    this.questionForm.setValue({
      title: formData.title,
      status: formData.status,
      priority: formData.priorityId,
      categories: formData.questionCategoryIds?.join(', '),
      comment: formData.comment
    });
  }

  hideDetail() {
    this.showQuestionDialog = false;
  }

  accept() {
    this.decision = Decision.Accepted;
    this.ShowApprovalDialog();
  }

  reject() {
    this.decision = Decision.Rejected;
    this.ShowApprovalDialog();
  }

  get canApproval() {
  return this.selectedQuestion?.status === 'New' || this.selectedQuestion?.status == 'BeingReviewed';
  }

  async confirmApproval() {
    this.spinner.show();
    switch (this.decision) {
      case Decision.Accepted:
        await firstValueFrom(this.askAPIService.acceptQuestion(this.selectedQuestion!.id!, {
          comment: this.approvalForm.get('comment')?.value
        }));
        break;
      case Decision.Rejected:
        await firstValueFrom(this.askAPIService.rejectQuestion(this.selectedQuestion!.id!, {
          comment: this.approvalForm.get('comment')?.value
        }));
        break;
    }

    this.showApprovalDialog = false;
    this.showQuestionDialog = false;
    this.reloadQuestions();
    this.spinner.hide();
  }

  cancelApproval() {
    this.showApprovalDialog = false;
  }

  private ShowApprovalDialog() {
    this.approvalForm.setValue({
      comment: ''
    });
    this.showApprovalDialog = true;
  }

  private async reloadQuestions() {
    const questions = await firstValueFrom(this.askAPIService.listAllQuestions());
    this.questions.set(questions);
  }
}
