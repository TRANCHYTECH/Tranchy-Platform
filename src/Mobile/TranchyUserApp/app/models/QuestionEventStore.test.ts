import { QuestionEventStoreModel } from "./QuestionEventStore"

test("can be created", () => {
  const instance = QuestionEventStoreModel.create({})

  expect(instance).toBeTruthy()
})
