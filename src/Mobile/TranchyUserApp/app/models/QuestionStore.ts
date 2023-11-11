import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel } from "./Question"
import { listPublicQuestions } from "app/services/ask-api/askApi"
import { Question } from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.array(QuestionModel),
    isLoading: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get allQuestions() {
      return self.questions
    },
  }))
  .actions((self) => ({
    listPublicQuestions: flow(function* fetchPublicQuestions() {
      try {
        self.isLoading = true
        const response: ApiResponse<Question[]> = yield listPublicQuestions()
        if (response.ok) {
          self.questions = cast(response.data)
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch public questions", error)
      } finally {
        self.isLoading = false
      }
    }),
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
