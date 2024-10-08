/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { QuestionConsultant } from "./questionConsultant"
import type { QuestionPermissions } from "./questionPermissions"
import type { QuestionStatus } from "./questionStatus"
import type { SupportLevel } from "./supportLevel"

export interface Question {
  categoryIds?: string[] | null
  comment?: string | null
  communityShareAgreement?: boolean | null
  consultant?: QuestionConsultant
  createdBy?: string | null
  createdOn?: string
  id?: string | null
  modifiedOn?: string
  permissions?: QuestionPermissions
  priorityId?: string | null
  priorityRank?: number
  queryIndex?: number
  status?: QuestionStatus
  supportLevel?: SupportLevel
  title?: string | null
}
