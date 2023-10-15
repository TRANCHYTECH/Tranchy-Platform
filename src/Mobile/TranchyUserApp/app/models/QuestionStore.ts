import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel, QuestionSnapshotOut } from "./Question"
import { api } from "app/services/api"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.array(QuestionModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async addQuestion(question: QuestionSnapshotOut) {
      const response = await api.addQuestion(question)
      if (response.kind === "ok") {
        store.setProp("questions", [
          {
            id: "3344" + Date.now,
            content: question.content,
            categories: question.categories,
            supportLevel: question.supportLevel,
          },
        ])
      } else {
        console.tron.error(`Error adding question: ${JSON.stringify(response)}`, [])
      }
    },
  }))
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
