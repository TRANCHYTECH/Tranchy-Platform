/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { SupportLevel } from "./supportLevel"

export interface CreateQuestionRequest {
  categoryIds?: string[] | null
  communityShareAgreement?: boolean | null
  priorityId?: string | null
  priorityRank?: number
  supportLevel?: SupportLevel
  title?: string | null
}
