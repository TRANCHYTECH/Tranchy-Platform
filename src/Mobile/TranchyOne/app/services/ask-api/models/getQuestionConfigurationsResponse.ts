/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { QuestionCategoryResponse } from "./questionCategoryResponse"
import type { QuestionPriorityResponse } from "./questionPriorityResponse"

export interface GetQuestionConfigurationsResponse {
  email: string
  questionCategories: QuestionCategoryResponse[]
  questionPriorities: QuestionPriorityResponse[]
}
