import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionEventModel = types
  .model("QuestionEvent")
  .props({
    message: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionEvent extends Instance<typeof QuestionEventModel> {}
export interface QuestionEventSnapshotOut extends SnapshotOut<typeof QuestionEventModel> {}
export interface QuestionEventSnapshotIn extends SnapshotIn<typeof QuestionEventModel> {}
export const createQuestionEventDefaultModel = () => types.optional(QuestionEventModel, {})
