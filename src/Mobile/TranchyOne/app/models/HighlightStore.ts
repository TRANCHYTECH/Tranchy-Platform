import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ApiResponse } from "apisauce"
import { GetUserHighlightsResponse } from "app/services/ask-api/models"
import { getUserHighlights } from "app/services/ask-api/askApi"

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

export const HighlightStoreModel = types
  .model("HighlightStore")
  .props({
    userHighlights: types.frozen<GetUserHighlightsResponse>(createDefaultUserHighlights()),
    // communityHighlights
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
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
  }))

export interface HighlightStore extends Instance<typeof HighlightStoreModel> {}
export interface HighlightStoreSnapshotOut extends SnapshotOut<typeof HighlightStoreModel> {}
export interface HighlightStoreSnapshotIn extends SnapshotIn<typeof HighlightStoreModel> {}
