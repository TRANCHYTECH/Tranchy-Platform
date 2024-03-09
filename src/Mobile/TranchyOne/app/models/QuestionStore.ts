import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  getQuestion,
  getSavedQuestions,
  getUserHighlights,
  listMobileQuestionEvents,
  pickQuestion,
  unsavedQuestion,
  userSaveQuestion,
  queryQuestions,
} from "app/services/ask-api/askApi"
import {
  GetSavedQuestionsResponse,
  GetUserHighlightsResponse,
  MobileQuestionEvent,
  QueryQuestionsRequest,
  Question,
  QuestionBriefPaginationResponse,
  QuestionStatus,
  SaveQuestionResponse,
  SortingType,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { parseNumber } from "app/utils/methodHelper"

// setLivelinessChecking("error")

// todo: update conditions for each query
const QueryParams: { [id in QuerySection]: QueryQuestionsRequest } = {
  mine: {
    mine: true,
    limit: 8,
    applyPagination: true,
  },
  consultations: {
    other: true,
    myConsultation: true,
    limit: 5,
    applyPagination: true,
  },
  recent: {
    other: true,
    status: QuestionStatus.Accepted,
    createdAtSortingType: SortingType.Ascending,
    limit: 5,
    applyPagination: true,
  },
}
export type QuerySection = keyof Pick<QuestionStoreSnapshotIn, "mine" | "consultations" | "recent">
export type HighlightSection = keyof Pick<QuestionStoreSnapshotIn, "highlights">

export type QuestionSection = QuerySection | HighlightSection

export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    savedQuestions: types.optional(types.array(types.string), []),
    isLoading: types.optional(types.boolean, false),
    nextQueryIndex: types.maybe(types.number),
    currentQuestion: types.maybeNull(types.frozen<Question>()),
    currentQuestionEvents: types.optional(types.array(types.frozen<MobileQuestionEvent>()), []),

    // new implementation
    mine: types.optional(types.frozen<QuestionBriefPaginationResponse>(), { data: [] }),
    consultations: types.optional(types.frozen<QuestionBriefPaginationResponse>(), { data: [] }),
    recent: types.optional(types.frozen<QuestionBriefPaginationResponse>(), { data: [] }),

    highlights: types.maybeNull(types.frozen<GetUserHighlightsResponse>()),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getCurrentQuestion(id: string) {
      return self.currentQuestion?.id === id ? self.currentQuestion : null
    },
  }))
  .actions((self) => ({
    getHighlights: flow(function* func(categories: string[]) {
      try {
        const response: ApiResponse<GetUserHighlightsResponse> = yield getUserHighlights({
          categories,
        })
        if (__DEV__) {
          console.log("get highlights", categories, response.status)
        }
        if (response.ok) {
          self.highlights = cast(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch user highlights", error)
      } finally {
        self.isLoading = false
      }
    }),

    query: flow(function* func(querySection: QuerySection, resetQuery: boolean) {
      try {
        const queryParams = QueryParams[querySection]
        if (!resetQuery) {
          if (!self[querySection].haveNextPage) {
            return
          }
          queryParams.queryIndex = parseNumber(self[querySection].nextQueryIndex)
        }

        self.isLoading = true

        const response: ApiResponse<QuestionBriefPaginationResponse> = yield queryQuestions(
          queryParams,
        )

        if (response.ok && response.data) {
          let data = self[querySection].data ?? []
          data = resetQuery ? response.data.data : [...data, ...response.data.data]
          self.setProp(querySection, {
            data,
            haveNextPage: response.data.haveNextPage,
            nextQueryIndex: response.data.nextQueryIndex,
          })
        }
      } catch (error) {
        if (__DEV__) {
          console.tron.error("Failed to query questions" + JSON.stringify(error), error)
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
          console.debug("getSavedQuestions - response", self.savedQuestions)
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
