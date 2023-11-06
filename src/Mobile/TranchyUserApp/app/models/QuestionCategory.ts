import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { LocalizedAttribute } from "./LocalizedAttribute"

export const QuestionCategoryModel = types
  .model("QuestionCategory")
  .props({
    key: types.string,
    title: types.frozen<LocalizedAttribute>(),
    description: types.frozen<LocalizedAttribute>(),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionCategory extends Instance<typeof QuestionCategoryModel> {}
export interface QuestionCategorySnapshotOut extends SnapshotOut<typeof QuestionCategoryModel> {}
export interface QuestionCategorySnapshotIn extends SnapshotIn<typeof QuestionCategoryModel> {}
export const createQuestionCategoryDefaultModel = () => types.optional(QuestionCategoryModel, {})
