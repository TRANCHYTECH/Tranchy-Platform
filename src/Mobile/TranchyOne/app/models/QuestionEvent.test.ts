import { QuestionEventModel } from "./QuestionEvent"

test("can be created", () => {
  const instance = QuestionEventModel.create({})

  expect(instance).toBeTruthy()
})
