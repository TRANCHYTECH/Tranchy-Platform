import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { IsoDate } from "./helpers/isoDateType"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionConsultantModel = types
  .model("QuestionConsultant")
  .props({
    userId: types.string,
    createdAt: IsoDate,
    conclusion: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionConsultant extends Instance<typeof QuestionConsultantModel> {}
export interface QuestionConsultantSnapshotOut
  extends SnapshotOut<typeof QuestionConsultantModel> {}
export interface QuestionConsultantSnapshotIn extends SnapshotIn<typeof QuestionConsultantModel> {}
export const createQuestionConsultantDefaultModel = () =>
  types.optional(QuestionConsultantModel, {})
