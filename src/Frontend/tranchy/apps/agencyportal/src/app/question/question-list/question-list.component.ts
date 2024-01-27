import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
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
import { GetUserResponse, Question } from '../../_state/askapi/models';
import { PortalConfig } from '../../app.config';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbItem, BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { QuestionDetailComponent } from './question-detail.component';
import { ApprovalCommentComponent } from './approval-comment.component';

enum Decision {
  Approved,
  Rejected
}

@Component({
  selector: 'tranchy-question-list',
  standalone: true,
  imports: [SharedModule, ConfirmDialogModule, TableModule, DialogModule, InputTextModule, ReactiveFormsModule, BreadcrumbsComponent, QuestionDetailComponent, ApprovalCommentComponent],
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

  selectedQuestion: Question | undefined = undefined;

  questions = signal<Question[]>([]);
  @ViewChild("questionDetailDialog") questionDetailDialog!: QuestionDetailComponent;
  @ViewChild("approvalCommentDialog") approvalCommentDialog!: ApprovalCommentComponent;

  decision: Decision | undefined = undefined;
  user: Partial<GetUserResponse> = {};
  breadCrumbItems: Array<BreadcrumbItem> = [];
  /**
   *
   */
  constructor() {
  }

  async ngOnInit(): Promise<void> {
    await this.reloadQuestions();
  }

  viewDetail(question: Question) {
    this.selectedQuestion = question;
    this.questionDetailDialog.show(this.selectedQuestion);
  }

  hideDetail() {
    this.questionDetailDialog.hide();
  }

  onApproved() {
    this.decision = Decision.Approved;
    this.approvalCommentDialog.show();
  }

  onRejected() {
    this.decision = Decision.Rejected;
    this.approvalCommentDialog.show();
  }

 cancelApproval() {
    this.approvalCommentDialog.hide();
  }

  async confirmApproval(comment: string) {
    this.spinner.show();
    switch (this.decision) {
      case Decision.Approved:
        await firstValueFrom(this.askAPIService.acceptQuestion(this.selectedQuestion!.id!, {
          comment: comment
        }));
        break;
      case Decision.Rejected:
        await firstValueFrom(this.askAPIService.rejectQuestion(this.selectedQuestion!.id!, {
          comment: comment
        }));
        break;
    }

    this.approvalCommentDialog.hide();
    this.questionDetailDialog.hide();
    await this.reloadQuestions();
    this.spinner.hide();
  }

  private async reloadQuestions() {
    const questions = await firstValueFrom(this.askAPIService.listAllQuestions());
    this.questions.set(questions);
  }
}
