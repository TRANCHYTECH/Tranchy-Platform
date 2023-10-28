import { translate } from "app/i18n"
import { SupportLevels } from "app/models"
import z from "zod"

export const QuestionFormSchema = z.object({
  content: z.string().min(20, { message: translate("error.questionTooShort", { min: 50 }) }),
  categories: z.array(z.string(), { required_error: "error.required" }).nonempty({
    message: translate("error.noQuestionCategorySelected", { max: 3 }),
  }),
  supportLevel: z.enum(SupportLevels),
  files: z.array(
    z.object({
      name: z.string(),
      uri: z.string(),
      size: z.number(),
    }),
  ),
})

export type QuestionFormModel = z.infer<typeof QuestionFormSchema>
