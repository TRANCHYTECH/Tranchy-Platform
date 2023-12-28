import { HighlightStoreModel } from "./HighlightStore"

test("can be created", () => {
  const instance = HighlightStoreModel.create({})

  expect(instance).toBeTruthy()
})
