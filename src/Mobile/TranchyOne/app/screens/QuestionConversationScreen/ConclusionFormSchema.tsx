import { translate } from "app/i18n"
import z from "zod"

export const ConclusionFormSchema = z.object({
  conclusion: z.string().min(10, { message: translate("error.questionTooShort", { min: 10 }) }),
  communityShareAgreement: z.boolean().nullish(),
})

export type ConclusionFormModel = z.infer<typeof ConclusionFormSchema>
