import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionPermissionsModel = types
  .model("QuestionPermissions")
  .props({
    role: types.maybeNull(types.string),
    actions: types.maybeNull(types.array(types.string)),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionPermissions extends Instance<typeof QuestionPermissionsModel> {}
export interface QuestionPermissionsSnapshotOut
  extends SnapshotOut<typeof QuestionPermissionsModel> {}
export interface QuestionPermissionsSnapshotIn
  extends SnapshotIn<typeof QuestionPermissionsModel> {}
export const createQuestionPermissionsDefaultModel = () =>
  types.optional(QuestionPermissionsModel, {})
