import { QuestionCategoryModel } from "./QuestionCategory"

test("can be created", () => {
  const instance = QuestionCategoryModel.create({})

  expect(instance).toBeTruthy()
})
