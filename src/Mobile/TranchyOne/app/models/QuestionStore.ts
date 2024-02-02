import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  getMyConsultations,
  getQuestion,
  getRecentQuestions,
  getSavedQuestions,
  getUserHighlights,
  listMobileQuestionEvents,
  pickQuestion,
  unsavedQuestion,
  userSaveQuestion,
  getMyQuestions,
} from "app/services/ask-api/askApi"
import {
  GetSavedQuestionsResponse,
  GetUserHighlightsResponse,
  MobileQuestionEvent,
  Question,
  QuestionBrief,
  QuestionBriefPaginationResponse,
  SaveQuestionResponse,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { parseNumber } from "app/utils/methodHelper"

// setLivelinessChecking("error")
const EndOfPage = -1

export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    userHighlights: types.maybeNull(types.frozen<GetUserHighlightsResponse>()),
    recentQuestions: types.optional(types.array(types.frozen<QuestionBrief>()), []),
    myQuestions: types.optional(types.array(types.frozen<QuestionBrief>()), []),
    myConsultations: types.optional(types.array(types.frozen<QuestionBrief>()), []),
    savedQuestions: types.optional(types.array(types.string), []),
    isLoading: types.optional(types.boolean, false),
    nextQueryIndex: types.maybe(types.number),
    currentQuestion: types.maybeNull(types.frozen<Question>()),
    currentQuestionEvents: types.optional(types.array(types.frozen<MobileQuestionEvent>()), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getCurrentQuestion(id: string) {
      return self.currentQuestion?.id === id ? self.currentQuestion : null
    },
  }))
  .actions((self) => ({
    getUserHighlights: flow(function* func() {
      try {
        const response: ApiResponse<GetUserHighlightsResponse> = yield getUserHighlights()
        if (response.ok) {
          self.userHighlights = cast(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch user highlights", error)
      } finally {
        self.isLoading = false
      }
    }),
    getMyQuestions: flow(function* func(resetQueryIndex: boolean) {
      try {
        if (!resetQueryIndex && self.nextQueryIndex === EndOfPage) {
          return
        }

        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield getMyQuestions({
          PageSize: 12,
          QueryIndex: resetQueryIndex ? undefined : self.nextQueryIndex,
        })

        if (response.ok && response.data && response.data.data.length > 0) {
          resetQueryIndex
            ? (self.myQuestions = cast(response.data.data))
            : self.myQuestions.push(...response.data.data)

          self.nextQueryIndex = parseNumber(response.data.nextQueryIndex) ?? EndOfPage
        }
      } catch (error) {
        if (__DEV__) {
          console.tron.error("Failed to get my questions" + JSON.stringify(error), error)
        }
      } finally {
        self.isLoading = false
      }
    }),
    getRecentQuestions: flow(function* func(resetQueryIndex: boolean) {
      try {
        if (__DEV__) {
          console.tron.debug("queryIndex: " + self.nextQueryIndex)
        }

        if (!resetQueryIndex && self.nextQueryIndex === EndOfPage) {
          return
        }

        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield getRecentQuestions({
          PageSize: 12,
          QueryIndex: resetQueryIndex ? undefined : self.nextQueryIndex,
        })

        if (response.ok && response.data && response.data.data.length > 0) {
          resetQueryIndex
            ? (self.recentQuestions = cast(response.data.data))
            : self.recentQuestions.push(...response.data.data)

          self.nextQueryIndex = parseNumber(response.data.nextQueryIndex) ?? EndOfPage
        }
      } catch (error) {
        if (__DEV__) {
          console.tron.error("Failed to get current questions", error)
        }
      } finally {
        self.isLoading = false
      }
    }),
    getMyConsultations: flow(function* func(resetQueryIndex: boolean) {
      try {
        if (!resetQueryIndex && self.nextQueryIndex === EndOfPage) {
          return
        }

        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield getMyConsultations({
          PageSize: 12,
          QueryIndex: resetQueryIndex ? undefined : self.nextQueryIndex,
        })

        if (response.ok && response.data && response.data.data.length > 0) {
          resetQueryIndex
            ? (self.myConsultations = cast(response.data.data))
            : self.myConsultations.push(...response.data.data)

          self.nextQueryIndex = parseNumber(response.data.nextQueryIndex) ?? EndOfPage
        }
      } catch (error) {
        if (__DEV__) {
          console.tron.error("Failed to get my consultations", error)
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
          return "Saved"
        }
      } else {
        const response: ApiResponse<SaveQuestionResponse> = yield userSaveQuestion({ questionId })
        if (response.ok && response.data && response.data.questions) {
          self.savedQuestions = cast(response.data.questions)
          return "Unsaved"
        }
      }

      return "NotMatch"
    }),
    getQuestion: flow(function* func(questionId: string) {
      self.currentQuestion = null
      const response: ApiResponse<Question> = yield getQuestion(questionId)
      if (response.ok) {
        self.currentQuestion = cast(response.data)
      }
    }),
    pickQuestion: flow(function* func(questionId: string) {
      const response: ApiResponse<Question> = yield pickQuestion(questionId)
      if (response.ok) {
        self.currentQuestion = cast(response.data)
      }
    }),
    loadEvents: flow(function* func(questionId: string) {
      const response: ApiResponse<MobileQuestionEvent[]> = yield listMobileQuestionEvents(
        questionId,
      )
      if (response.ok) {
        self.currentQuestionEvents = cast(response.data)
      }
    }),
  }))

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
