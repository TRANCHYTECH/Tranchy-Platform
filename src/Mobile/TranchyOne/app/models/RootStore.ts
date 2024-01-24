import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UiStoreModel } from "./UiStore"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { MetadataStoreModel } from "./MetadataStore"
import { QuestionStoreModel } from "./QuestionStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    uiStore: types.optional(UiStoreModel, {} as any),
    metadataStore: types.optional(MetadataStoreModel, {} as any),
    questionStore: types.optional(QuestionStoreModel, {} as any),
    authenticationStore: types.optional(AuthenticationStoreModel, {}),
    episodeStore: types.optional(EpisodeStoreModel, {}),
  })
  .actions((self) => ({
    reset() {
      self.uiStore.reset()
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
