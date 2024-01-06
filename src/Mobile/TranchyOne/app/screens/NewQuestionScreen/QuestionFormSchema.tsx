import { translate } from "app/i18n"
import { SupportLevel } from "app/services/ask-api/models"
import z from "zod"

export const QuestionFormSchema = z.object({
  title: z.string().min(10, { message: translate("error.questionTooShort", { min: 10 }) }),
  questionCategoryIds: z.array(z.string(), { required_error: "error.required" }).nonempty({
    message: translate("error.noQuestionCategorySelected", { max: 3 }),
  }),
  supportLevel: z.nativeEnum(SupportLevel),
  priority: z.string().nullish(),
  communityShareAgreement: z.boolean().nullish(),
  files: z.array(
    z.object({
      name: z.string(),
      uri: z.string(),
      size: z.number(),
    }),
  ),
})

export type QuestionFormModel = z.infer<typeof QuestionFormSchema>
