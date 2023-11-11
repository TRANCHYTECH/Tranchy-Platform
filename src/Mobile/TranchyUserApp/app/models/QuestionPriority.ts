import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { LocalizedAttribute } from "./LocalizedAttribute"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionPriorityModel = types
  .model("QuestionPriority")
  .props({
    key: types.string,
    title: types.frozen<LocalizedAttribute>(),
    description: types.frozen<LocalizedAttribute>(),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getDescription(locale: string) {
      return self.description[locale]
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionPriority extends Instance<typeof QuestionPriorityModel> {}
export interface QuestionPrioritySnapshotOut extends SnapshotOut<typeof QuestionPriorityModel> {}
export interface QuestionPrioritySnapshotIn extends SnapshotIn<typeof QuestionPriorityModel> {}
export const createQuestionPriorityDefaultModel = () => types.optional(QuestionPriorityModel, {})
