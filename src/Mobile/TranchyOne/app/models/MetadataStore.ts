import { Instance, SnapshotIn, SnapshotOut, types, flow, cast } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  GetQuestionConfigurationsResponse,
  QuestionCategoryResponse,
  QuestionPriorityResponse,
} from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { getQuestionConfigurations } from "app/services/ask-api/askApi"

/**
 * Model description here for TypeScript hints.
 */
export const MetadataStoreModel = types
  .model("MetadataStore")
  .props({
    questionCategories: types.optional(types.array(types.frozen<QuestionCategoryResponse>()), []),
    questionPriorities: types.optional(types.array(types.frozen<QuestionPriorityResponse>()), []),
    userId: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    questionCategory(key: string) {
      return self.questionCategories.find((p) => p.key === key)
    },
    questionPriority(key: string) {
      return self.questionPriorities.find((p) => p.key === key)
    },
  }))
  .actions((self) => ({
    getConfigurations: flow(function* getConfigurations(force: boolean) {
      try {
        if (force) {
          const response: ApiResponse<GetQuestionConfigurationsResponse> =
            yield getQuestionConfigurations()
          if (response.ok && response.data) {
            self.questionCategories = cast(response.data.questionCategories)
            self.questionPriorities = cast(response.data.questionPriorities)
            self.userId = response.data.userId
            self.email = response.data.email
          }
        }
      } catch (error) {
        // todo (tau): log insights.
        console.error("Failed to get configurations", error)
      }
    }),
  }))

export interface MetadataStore extends Instance<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotOut extends SnapshotOut<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotIn extends SnapshotIn<typeof MetadataStoreModel> {}
