import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupportLevels } from "./Constants"

const
/**
 * Model description here for TypeScript hints.
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier,
    title: types.string,
    questionCategoryIds: types.array(types.string),
    supportLevel: types.enumeration(SupportLevels),
    priorityId: types.maybeNull(types.string),
    communityShareAgreement: types.maybeNull(types.boolean),
    createdOn: types.string,
    // events: types.array()
    // question events reference?
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
