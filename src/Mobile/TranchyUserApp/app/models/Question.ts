import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupportLevels } from "./Constants"
import { QuestionResponderModel } from "./QuestionResponder"
import { QuestionPermissionsModel } from "./QuestionPermissions"

export const QuestionEventModel = types
  .model("QuestionEvent")
  .props({
    $type: types.string,
    id: types.identifier,
    data: types.string,
  })
  .views((self) => ({
    get chatMessage() {
      // parse to IChatMessage
      return JSON.parse(self.data)
    },
  }))

/**
 * Model description here for TypeScript hints.
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier,
    title: types.string,
    questionCategoryIds: types.array(types.string),
    supportLevel: types.enumeration(SupportLevels),
    status: types.string,
    priorityId: types.maybeNull(types.string),
    communityShareAgreement: types.maybeNull(types.boolean),
    createdOn: types.string,
    createdByUserId: types.string,
    responder: types.maybeNull(QuestionResponderModel),
    permissions: types.maybeNull(QuestionPermissionsModel),
    events: types.array(types.frozen(QuestionEventModel)),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
