import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionAction } from "app/services/ask-api/models"
import { backendTypes } from "./helpers/backendTypes"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionPermissionsModel = types
  .model("QuestionPermissions")
  .props({
    actions: backendTypes.arrayType(types.string),
    directChatTargetUserId: backendTypes.simpleType(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get canTakeConsultation() {
      return self.actions?.includes(QuestionAction.TakeConsultation)
    },
    get canTakeConversation() {
      return self.actions?.includes(QuestionAction.GoToConversation)
    },
  }))
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionPermissions extends Instance<typeof QuestionPermissionsModel> {}
export interface QuestionPermissionsSnapshotOut
  extends SnapshotOut<typeof QuestionPermissionsModel> {}
export interface QuestionPermissionsSnapshotIn
  extends SnapshotIn<typeof QuestionPermissionsModel> {}
export const createQuestionPermissionsDefaultModel = () =>
  types.optional(QuestionPermissionsModel, {})
