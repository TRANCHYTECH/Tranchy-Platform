/**
 * Generated by orval v6.22.1 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { CreateQuestionEventRequest } from "./createQuestionEventRequest"
import type { CreateQuestionEventFileAttachedInputType } from "./createQuestionEventFileAttachedInputType"

export type CreateQuestionEventFileAttachedInput = CreateQuestionEventRequest & {
  $type: CreateQuestionEventFileAttachedInputType
  blobLocation?: string | null
  fileName?: string | null
  fileType?: string | null
}