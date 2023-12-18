import { QuestionPriorityModel } from "./QuestionPriority"

test("can be created", () => {
  const instance = QuestionPriorityModel.create({})

  expect(instance).toBeTruthy()
})
