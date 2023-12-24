/**
 * Generated by orval v6.22.1 🍺
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
  Cancelled: "Cancelled",
  Payment: "Payment",
  InProgress: "InProgress",
  Rejected: "Rejected",
  Resolved: "Resolved",
  Closed: "Closed",
  Reported: "Reported",
} as const