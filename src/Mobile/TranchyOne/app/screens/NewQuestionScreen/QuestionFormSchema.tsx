import { translate } from "app/i18n"
import { SupportLevels } from "app/models"
import z from "zod"

export const QuestionFormSchema = z.object({
  title: z.string().min(10, { message: translate("error.questionTooShort", { min: 10 }) }),
  questionCategoryIds: z.array(z.string(), { required_error: "error.required" }).nonempty({
    message: translate("error.noQuestionCategorySelected", { max: 3 }),
  }),
  supportLevel: z.enum(SupportLevels),
  priority: z.string().nullish(),
  communityShareAgreement: z.boolean().nullish(),
  files: z.array(
    z
      .object({
        name: z.string(),
        uri: z.string(),
        size: z.number(),
      })
      .nullable(),
  ),
})

export type QuestionFormModel = z.infer<typeof QuestionFormSchema>
