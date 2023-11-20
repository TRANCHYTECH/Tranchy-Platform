import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionResponderModel = types
  .model("QuestionResponder")
  .props({
    userId: types.string,
    createdAt: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionResponder extends Instance<typeof QuestionResponderModel> {}
export interface QuestionResponderSnapshotOut extends SnapshotOut<typeof QuestionResponderModel> {}
export interface QuestionResponderSnapshotIn extends SnapshotIn<typeof QuestionResponderModel> {}
export const createQuestionResponderDefaultModel = () => types.optional(QuestionResponderModel, {})
