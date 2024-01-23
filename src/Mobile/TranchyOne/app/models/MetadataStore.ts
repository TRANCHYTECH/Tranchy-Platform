import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { GetQuestionConfigurationsResponse } from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { getQuestionConfigurations } from "app/services/ask-api/askApi"

/**
 * Model description here for TypeScript hints.
 */
export const MetadataStoreModel = types
  .model("MetadataStore")
  .props({
    configurations: types.frozen<GetQuestionConfigurationsResponse>(<
      GetQuestionConfigurationsResponse
    >{ questionCategories: [], questionPriorities: [], userId: "", email: "" }),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get questionCategories() {
      return self.configurations.questionCategories
    },
    get questionPriorities() {
      return self.configurations.questionPriorities
    },
    questionCategory(key: string) {
      return this.questionCategories.find((p) => p.key === key)
    },
    questionPriority(key: string) {
      return this.questionPriorities.find((p) => p.key === key)
    },
  }))
  .actions((self) => ({
    getConfigurations: flow(function* getConfigurations(force: boolean) {
      try {
        if (force) {
          const response: ApiResponse<GetQuestionConfigurationsResponse> =
            yield getQuestionConfigurations()
          if (response.ok && response.data) {
            self.configurations = response.data
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
