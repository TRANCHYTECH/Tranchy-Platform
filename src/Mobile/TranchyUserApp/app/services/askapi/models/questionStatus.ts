/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Tranchy Ask Api Documentation
 * OpenAPI spec version: v1
 */

export type QuestionStatus = (typeof QuestionStatus)[keyof typeof QuestionStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const QuestionStatus = {
  New: "New",
  BeingReviewed: "BeingReviewed",
  Accepted: "Accepted",
  Payment: "Payment",
  InProgress: "InProgress",
  Rejected: "Rejected",
  Done: "Done",
  Reported: "Reported",
} as const