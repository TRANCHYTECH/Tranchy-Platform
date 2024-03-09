import { Instance, SnapshotIn, SnapshotOut, types, flow, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  GetQuestionConfigurationsResponse,
  GetUserResponse,
  QuestionCategoryResponse,
  QuestionPriorityResponse,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { getCurrentUser, getQuestionConfigurations } from "app/services/ask-api/askApi"
import { isNil } from "lodash-es"

/**
 * Model description here for TypeScript hints.
 */
export const MetadataStoreModel = types
  .model("MetadataStore")
  .props({
    questionCategories: types.optional(types.array(types.frozen<QuestionCategoryResponse>()), []),
    questionPriorities: types.optional(types.array(types.frozen<QuestionPriorityResponse>()), []),
    email: types.maybeNull(types.string),
    userProfile: types.maybeNull(types.frozen<GetUserResponse>()),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    questionCategory(key: string) {
      return self.questionCategories.find((p) => p.key === key)
    },
    questionPriority(key: string) {
      return self.questionPriorities.find((p) => p.key === key)
    },
    get ready() {
      return !isNil(self.userProfile)
    },
  }))
  .actions((self) => ({
    reset() {
      self.userProfile = null
      console.log("reset user profile", self.userProfile)
    },
    getConfigurations: flow(function* getConfigurations(force: boolean) {
      try {
        if (force) {
          const response: ApiResponse<GetQuestionConfigurationsResponse> =
            yield getQuestionConfigurations()
          if (__DEV__) {
            console.log("getConfigurations - response", response.data)
          }
          if (response.ok && response.data) {
            self.questionCategories = cast(response.data.questionCategories)
            self.questionPriorities = cast(response.data.questionPriorities)
            self.email = response.data.email
          }
        }
      } catch (error) {
        // todo (tau): log insights.
        console.error("Failed to get configurations", error)
      }
    }),
    ensureUserProfile: flow(function* func() {
      try {
        if (!isNil(self.userProfile)) {
          if (__DEV__) {
            console.log("ensureUserProfile - existing:", self.userProfile)
          }
          return
        }

        const response: ApiResponse<GetUserResponse> = yield getCurrentUser()

        if (response.ok && response.data) {
          if (__DEV__) {
            console.log("ensureUserProfile - response:", response.data)
          }
          self.userProfile = cast(response.data)
        }
      } catch (error) {
        // todo (tau): log insights.
        console.error("Failed to get user profile", error)
      }
    }),
  }))

export interface MetadataStore extends Instance<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotOut extends SnapshotOut<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotIn extends SnapshotIn<typeof MetadataStoreModel> {}
