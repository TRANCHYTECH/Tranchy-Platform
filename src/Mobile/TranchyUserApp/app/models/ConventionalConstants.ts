export const SupportLevels = ["community", "coffee", "expert", "agency"] as const
export type SupportLevel = (typeof SupportLevels)[number]
