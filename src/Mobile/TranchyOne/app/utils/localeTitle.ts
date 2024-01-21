import { QuestionCategoryResponse } from "app/services/ask-api/models"

export const getTitle = (categories: QuestionCategoryResponse[], key: string, locale: string) =>
  categories.find((c) => c.key === key)?.title[locale] ?? key
