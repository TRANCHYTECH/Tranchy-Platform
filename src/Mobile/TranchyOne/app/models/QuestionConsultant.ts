import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { backendTypes } from "./helpers/backendTypes"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionConsultantModel = types
  .model("QuestionConsultant")
  .props({
    userId: backendTypes.simpleType(types.string),
    createdAt: backendTypes.isoDateType(),
    conclusion: backendTypes.simpleType(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionConsultant extends Instance<typeof QuestionConsultantModel> {}
export interface QuestionConsultantSnapshotOut
  extends SnapshotOut<typeof QuestionConsultantModel> {}
export interface QuestionConsultantSnapshotIn extends SnapshotIn<typeof QuestionConsultantModel> {}
// export const createQuestionConsultantDefaultModel = () =>
//   types.optional(QuestionConsultantModel, {})
