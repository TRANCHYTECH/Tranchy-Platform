import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel } from "./Question"
import { listCommunityQuestions } from "app/services/ask-api/askApi"
import { Question } from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"

// setLivelinessChecking("error")

export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.array(QuestionModel),
    isLoading: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getQuestions() {
      return self.questions.filter((_) => true)
    },
    getQuestion(id: string) {
      return self.questions.find((q) => q.id === id)
    },
  }))
  .actions((self) => ({
    listPublicQuestions: flow(function* fetchPublicQuestions() {
      try {
        self.isLoading = true
        const response: ApiResponse<Question[]> = yield listCommunityQuestions()
        if (response.ok) {
          self.questions = cast(response.data)
        }
      } catch (error) {
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
