import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
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
            id: response.data.id,
            content: question.title,
            categories: question.questionCategoryIds,
            supportLevel: question.supportLevel,
          },
        ])
        console.tron.log("Created question", response.data)
      } else {
        console.tron.error(`Error adding question: ${JSON.stringify(response)}`, [])
      }
    },
  }))
  .views((self) => ({
    get allQuestions() {
      return self.questions
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    fetchPublicQuestions: flow(function* fetchPublicQuestions() {
      try {
        // ... yield can be used in async/await style
        const response = yield api.getPublicQuestions()
        if (response.kind === "ok") self.questions = response.data
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch public questions", error)
      }
    }),
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
