import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { QuestionEventStoreModel } from "./QuestionEventStore"
import { MetadataStoreModel } from "./MetadataStore"
import { QuestionStoreModel } from "./QuestionStore"
import { AuthenticationStoreModel } from "./AuthenticationStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  questionEventStore: types.optional(QuestionEventStoreModel, {} as any),
  metadataStore: types.optional(MetadataStoreModel, {} as any),
  questionStore: types.optional(QuestionStoreModel, {} as any),
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
