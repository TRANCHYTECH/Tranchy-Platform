import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const UiStoreModel = types
  .model("UiStore")
  .props({
    busyIndicator: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    showBusyIndicator() {
      self.busyIndicator = true
    },
    hideBusyIndicator() {
      self.busyIndicator = false
    },
    reset() {
      self.busyIndicator = false
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface UiStore extends Instance<typeof UiStoreModel> {}
export interface UiStoreSnapshotOut extends SnapshotOut<typeof UiStoreModel> {}
export interface UiStoreSnapshotIn extends SnapshotIn<typeof UiStoreModel> {}
export const createUiStoreDefaultModel = () => types.optional(UiStoreModel, {})
