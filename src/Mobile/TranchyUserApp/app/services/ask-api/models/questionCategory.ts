/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { QuestionCategoryDescription } from "./questionCategoryDescription"
import type { QuestionCategoryTitle } from "./questionCategoryTitle"

export interface QuestionCategory {
  createdOn?: Date
  description?: QuestionCategoryDescription
  id?: string | null
  key?: string | null
  modifiedOn?: Date
  title?: QuestionCategoryTitle
}
