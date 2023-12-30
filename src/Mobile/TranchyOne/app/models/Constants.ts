import { SupportLevel as SupportLevelBackend } from "app/services/ask-api/models"

export const SupportLevels = [
  SupportLevelBackend.Community,
  SupportLevelBackend.Expert,
  SupportLevelBackend.Agency,
] as const

export type SupportLevel = (typeof SupportLevels)[number]
