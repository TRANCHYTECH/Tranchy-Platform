import { MetadataStoreModel } from "./MetadataStore"

test("can be created", () => {
  const instance = MetadataStoreModel.create({
    configurations: { email: "", userId: "", questionCategories: [], questionPriorities: [] },
  })

  expect(instance).toBeTruthy()
})
