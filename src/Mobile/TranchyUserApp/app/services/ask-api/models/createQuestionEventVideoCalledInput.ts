/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { CreateQuestionEventRequest } from "./createQuestionEventRequest"
import type { CreateQuestionEventVideoCalledInputType } from "./createQuestionEventVideoCalledInputType"

export type CreateQuestionEventVideoCalledInput = CreateQuestionEventRequest & {
  $type: CreateQuestionEventVideoCalledInputType
  blobLocation?: string | null
  endedAt?: Date
  startedAt?: Date
}