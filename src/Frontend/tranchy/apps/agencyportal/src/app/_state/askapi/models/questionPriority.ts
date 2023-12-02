/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { QuestionPriorityDescription } from './questionPriorityDescription';
import type { TimeSpan } from './timeSpan';
import type { QuestionPriorityPriorityMetaData } from './questionPriorityPriorityMetaData';
import type { QuestionPriorityTitle } from './questionPriorityTitle';

export interface QuestionPriority {
  createdOn?: string;
  description?: QuestionPriorityDescription;
  duration?: TimeSpan;
  id?: string | null;
  key?: string | null;
  modifiedOn?: string;
  priorityMetaData?: QuestionPriorityPriorityMetaData;
  rank?: number;
  title?: QuestionPriorityTitle;
}
