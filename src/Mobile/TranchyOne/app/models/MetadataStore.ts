import { Instance, SnapshotIn, SnapshotOut, types, cast, flow, getSnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionCategoryModel } from "./QuestionCategory"
import { QuestionPriorityModel } from "./QuestionPriority"
import { getQuestionConfigurations } from "app/services/ask-api/askApi"
import { GetQuestionConfigurationsResponse } from "app/services/ask-api/models"
import { ApiResponse } from "apisauce"
import { load, save } from "app/utils/storage"
import { backendTypes } from "./helpers/backendTypes"

/**
 * Model description here for TypeScript hints.
 */
export const MetadataStoreModel = types
  .model("MetadataStore")
  .props({
    userId: backendTypes.simpleType(types.string),
    email: backendTypes.frozenSubType(types.string),
    categories: backendTypes.arrayType(QuestionCategoryModel),
    priorities: backendTypes.arrayType(QuestionPriorityModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get questionCategories() {
      return self.categories
    },
    get questionPriorities() {
      return self.priorities
    },
    // get questionCategoryIds() {
    //   return self.categories?.map<string>(function (v) {
    //     return v.key
    //   })
    // },
    questionPriority(key: string) {
      return self.priorities?.find((p) => p.key === key)
    },
  }))
  .actions((self) => ({
    // todo(Tau): no need to save to storage, because store already did
    downloadMetadata: flow(function* downloadMetadataFlow(force: boolean) {
      try {
        const persistedMetadata = load("metadata")
        if (force || persistedMetadata === null) {
          const response: ApiResponse<GetQuestionConfigurationsResponse> =
            yield getQuestionConfigurations()
          if (response.ok && response.data) {
            self.userId = response.data.userId
            self.email = response.data.email
            self.categories = cast(response.data.questionCategories)
            self.priorities = cast(response.data.questionPriorities)

            const snapshot = getSnapshot(self)
            save("metadata", snapshot)
          }
        } else {
          const metadata = MetadataStoreModel.create(persistedMetadata)
          if (__DEV__) {
            console.tron.log(metadata)
          }
          self = metadata
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch metadata", error)
      }
    }),
  }))

export interface MetadataStore extends Instance<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotOut extends SnapshotOut<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotIn extends SnapshotIn<typeof MetadataStoreModel> {}
export const createMetadataStoreDefaultModel = () => types.optional(MetadataStoreModel, {})
