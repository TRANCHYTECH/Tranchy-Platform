import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@tranchy/shared';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'tranchy-approval-comment',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, DialogModule],
  templateUrl: './approval-comment.component.html',
  styleUrl: './approval-comment.component.scss',
})
export class ApprovalCommentComponent {
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  approvalForm!: FormGroup;
  fb = inject(FormBuilder);

  visible = false;

  constructor() {
    this.initApprovalForm();
  }

  show() {
    this.initApprovalForm();
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  onConfirmClick() {
    this.confirmed.emit(this.approvalForm?.get('comment')?.value);
  }

  onCancelClick() {
    this.cancelled.emit();
  }

  private initApprovalForm() {
    this.approvalForm = this.fb.group({
      comment: null
    });
  }
}
