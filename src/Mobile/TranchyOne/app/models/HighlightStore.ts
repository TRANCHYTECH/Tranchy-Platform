import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { HighlightSectionModel } from "./HighlightSection"
import { ApiResponse } from "apisauce"
import { HighlightSectionsResponse } from "app/services/ask-api/models"
import { highlightSections } from "app/services/ask-api/askApi"

/**
 * Model description here for TypeScript hints.
 */
export const HighlightStoreModel = types
  .model("HighlightStore")
  .props({
    highlightSections: types.maybe(types.frozen(HighlightSectionModel)),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    fetchHighlights: flow(function* fetchHighlights() {
      try {
        const response: ApiResponse<HighlightSectionsResponse> = yield highlightSections()
        if (response.ok) {
          self.highlightSections = cast(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch public questions", error)
      } finally {
        // self.isLoading = false
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface HighlightStore extends Instance<typeof HighlightStoreModel> {}
export interface HighlightStoreSnapshotOut extends SnapshotOut<typeof HighlightStoreModel> {}
export interface HighlightStoreSnapshotIn extends SnapshotIn<typeof HighlightStoreModel> {}
export const createHighlightStoreDefaultModel = () => types.optional(HighlightStoreModel, {})
