/**
 * Generated by orval v6.22.1 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */
import type { MobileQuestionEvent } from "./mobileQuestionEvent"
import type { MobileQuestionEventMessageSentType } from "./mobileQuestionEventMessageSentType"

export type MobileQuestionEventMessageSent = MobileQuestionEvent & {
  $type: MobileQuestionEventMessageSentType
  text?: string | null
}
