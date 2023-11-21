import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupportLevels } from "./Constants"
import { QuestionResponderModel } from "./QuestionResponder"
import { QuestionPermissionsModel } from "./QuestionPermissions"
import { ApiResponse } from "apisauce"
import { MobileQuestionEventMessageSent } from "app/services/ask-api/models"
import { listMobileQuestionEvents } from "app/services/ask-api/askApi"

export const QuestionEventUserModel = types
  .model("QuestionEventUser")
  .props({
    _id: types.identifier,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .views((self) => ({}))

export const QuestionEventModel = types
  .model("QuestionEvent")
  .props({
    $type: types.string,
    _id: types.identifier,
    text: types.string,
    user: types.frozen(QuestionEventUserModel),
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .views((self) => ({}))

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
  .actions((self) => ({
    loadQuestionEvents: flow(function* loadQuestionEvents() {
      const response: ApiResponse<MobileQuestionEventMessageSent[]> =
        yield listMobileQuestionEvents(self.id)
      if (response.ok) {
        self.events = cast(response.data)
      }
    }),
  }))

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
