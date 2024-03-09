import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Question } from '../../_state/askapi/models';
import { SharedModule } from '@tranchy/shared';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'tranchy-question-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, DialogModule],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionDetailComponent {
  @Output() approved: EventEmitter<string> = new EventEmitter<string>();
  @Output() rejected: EventEmitter<string> = new EventEmitter<string>();

  questionForm: FormGroup;
  visible = signal(false);
  question = signal<Question>({});
  approvalEnabled = computed(() => {
    console.log(this.question());
    return (
      this.question().status === 'New' ||
      this.question().status == 'BeingReviewed'
    );
  });

  private _fb = inject(FormBuilder);

  constructor() {
    this.questionForm = this._fb.group({
      title: null,
      status: null,
      priority: null,
      categories: null,
      comment: null,
    });
  }

  show(question: Question) {
    const formData = (({
      priorityId,
      categoryIds,
      status,
      supportLevel,
      title,
      comment,
    }) => ({ priorityId, categoryIds, status, supportLevel, title, comment }))(
      question
    );

    this.questionForm.setValue({
      title: formData.title,
      status: formData.status,
      priority: formData.priorityId,
      categories: formData.categoryIds?.join(', '),
      comment: formData.comment,
    });

    this.visible.set(true);
    this.question.set(question);
  }

  hide() {
    this.visible.set(false);
  }

  approve() {
    this.approved.emit();
  }

  reject() {
    this.rejected.emit();
  }
}
