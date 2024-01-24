import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel } from "./Question"
import {
  getRecentQuestions,
  getSavedQuestions,
  getUserHighlights,
  listCommunityQuestions,
  unsavedQuestion,
  userSaveQuestion,
} from "app/services/ask-api/askApi"
import {
  Question as BackendQuestion,
  GetSavedQuestionsResponse,
  GetUserHighlightsResponse,
  QuestionBrief,
  QuestionBriefPaginationResponse,
  SaveQuestionResponse,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { backendTypes } from "./helpers/backendTypes"
import { parseNumber } from "app/utils/methodHelper"

// setLivelinessChecking("error")
function createDefaultUserHighlights(): GetUserHighlightsResponse {
  return {
    expertExclusive: {
      data: [],
    },
    popularCategories: {
      data: [],
    },
    matchProfile: {
      data: [],
    },
    recent: {
      data: [],
    },
  }
}

export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: backendTypes.arrayType(QuestionModel),
    isLoading: types.optional(types.boolean, false),
    recentQuestions: types.optional(types.array(types.frozen<QuestionBrief>()), []),
    nextQueryIndex: types.maybe(types.number),
    savedQuestions: types.optional(types.array(types.string), []),
    userHighlights: types.frozen<GetUserHighlightsResponse>(createDefaultUserHighlights()),
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
    getUserHighlights: flow(function* highlights() {
      try {
        const response: ApiResponse<GetUserHighlightsResponse> = yield getUserHighlights()
        if (response.ok) {
          self.userHighlights = cast(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch user highlights", error)
      } finally {
        // self.isLoading = false
      }
    }),
    getRecentQuestions: flow(function* func(firstCall: boolean) {
      try {
        if (__DEV__) {
          console.tron.debug("queryIndex: " + self.nextQueryIndex)
        }
        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield getRecentQuestions({
          PageSize: 12,
          QueryIndex: firstCall ? undefined : self.nextQueryIndex,
        })
        // todo(tau): check wrong logic of nextQueryIndex. case: has data but not next query.
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
    getSavedQuestions: flow(function* func() {
      const response: ApiResponse<GetSavedQuestionsResponse> = yield getSavedQuestions()
      if (response.ok && response.data && response.data.questions) {
        self.savedQuestions = cast(response.data.questions)
        if (__DEV__) {
          console.tron.debug("loaded saved questions: " + self.savedQuestions)
        }
      }
    }),
    toggleSavingQuestion: flow(function* func(questionId: string) {
      if (self.savedQuestions.includes(questionId)) {
        const response: ApiResponse<void> = yield unsavedQuestion(questionId)
        if (response.ok) {
          self.savedQuestions.remove(questionId)
          return -1
        }
      } else {
        const response: ApiResponse<SaveQuestionResponse> = yield userSaveQuestion({ questionId })
        if (response.ok && response.data && response.data.questions) {
          self.savedQuestions = cast(response.data.questions)
          return 1
        }
      }

      return 0
    }),
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
