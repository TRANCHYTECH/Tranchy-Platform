import { MetadataStoreModel } from "./MetadataStore"

test("can be created", () => {
  const instance = MetadataStoreModel.create({})

  expect(instance).toBeTruthy()
})
