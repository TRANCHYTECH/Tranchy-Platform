/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { QuestionCategory } from "./questionCategory"
import type { QuestionPriority } from "./questionPriority"

export interface GetQuestionConfigurationsResponse {
  questionCategories?: QuestionCategory[] | null
  questionPriorities?: QuestionPriority[] | null
}
