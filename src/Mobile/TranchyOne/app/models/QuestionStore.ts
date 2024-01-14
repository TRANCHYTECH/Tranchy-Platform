import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel } from "./Question"
import { getRecentQuestions, listCommunityQuestions } from "app/services/ask-api/askApi"
import {
  Question as BackendQuestion,
  QuestionBrief,
  QuestionBriefPaginationResponse,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { backendTypes } from "./helpers/backendTypes"
import { parseNumber } from "app/utils/methodHelper"

// setLivelinessChecking("error")

export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: backendTypes.arrayType(QuestionModel),
    isLoading: types.optional(types.boolean, false),
    recentQuestions: types.optional(types.array(types.frozen<QuestionBrief>()), []),
    nextQueryIndex: types.maybe(types.number),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getQuestions() {
      return self.questions
    },
    getQuestion(id: string) {
      return self.questions?.find((q) => q.id === id)
    },
  }))
  .actions((self) => ({
    listPublicQuestions: flow(function* func() {
      try {
        self.isLoading = true
        const response: ApiResponse<BackendQuestion[]> = yield listCommunityQuestions()
        if (response.ok) {
          self.questions = cast(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch public questions", error)
      } finally {
        self.isLoading = false
      }
    }),
    getRecentQuestions: flow(function* func(firstCall = true) {
      try {
        if (__DEV__) {
          console.tron.debug("queryIndex: " + self.nextQueryIndex)
        }
        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield getRecentQuestions({
          PageSize: 6,
          QueryIndex: firstCall ? undefined : self.nextQueryIndex,
        })
        if (response.ok && response.data && response.data.data.length > 0) {
          firstCall
            ? (self.recentQuestions = cast(response.data.data))
            : self.recentQuestions.push(...response.data.data)
          self.nextQueryIndex = parseNumber(response.data.nextQueryIndex)
        }
      } catch (error) {
        if (__DEV__) {
          console.tron.error("Failed to get current questions", error)
        }
      } finally {
        self.isLoading = false
      }
    }),
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
