/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { CreateQuestionEventRequest } from "./createQuestionEventRequest"
import type { CreateQuestionEventStatusChangedRequestType } from "./createQuestionEventStatusChangedRequestType"
import type { QuestionStatus } from "./questionStatus"
import type { CreateQuestionEventStatusChangedRequestStatusMetaData } from "./createQuestionEventStatusChangedRequestStatusMetaData"

export type CreateQuestionEventStatusChangedRequest = CreateQuestionEventRequest & {
  $type: CreateQuestionEventStatusChangedRequestType
  previousStatusChangedEventId?: string | null
  questionStatus?: QuestionStatus
  statusMetaData?: CreateQuestionEventStatusChangedRequestStatusMetaData
}
