import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupportLevels } from "./Constants"
import { QuestionConsultantModel } from "./QuestionConsultant"
import { QuestionPermissionsModel } from "./QuestionPermissions"
import { ApiResponse } from "apisauce"
import {
  MobileQuestionEventMessageSent,
  Question as BackendQuestion,
  User,
} from "app/services/ask-api/models"
import { listMobileQuestionEvents, pickQuestion } from "app/services/ask-api/askApi"
import { backendTypes } from "./helpers/backendTypes"

export const QuestionEventUserModel = types.model("QuestionEventUser").props({
  _id: backendTypes.simpleType(types.string),
})

export const QuestionEventModel = types.model("QuestionEvent").props({
  $type: types.string,
  _id: backendTypes.simpleType(types.identifier),
  text: backendTypes.simpleType(types.string),
  createdAt: backendTypes.isoDateType(),
  user: types.union(types.undefined, types.null, types.frozen<User>()),
})

export const QuestionModel = types
  .model("Question")
  .props({
    id: backendTypes.simpleType(types.identifier),
    title: backendTypes.simpleType(types.string),
    questionCategoryIds: backendTypes.arrayType(types.string),
    supportLevel: backendTypes.enumerationType(SupportLevels),
    status: backendTypes.simpleType(types.string),
    priorityId: backendTypes.simpleType(types.string),
    communityShareAgreement: backendTypes.simpleType(types.boolean),
    createdOn: backendTypes.isoDateType(),
    createdByUserId: backendTypes.simpleType(types.string),
    consultant: types.maybeNull(QuestionConsultantModel),
    permissions: types.maybe(QuestionPermissionsModel),
    events: backendTypes.arrayType(QuestionEventModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getNotifiedUserId: (userId: string) =>
    self.events[0].user?._id
      self.consultant?.userId?.trim() === userId.trim() ? self.createdByUserId : userId,
  }))
  .actions((self) => ({
    loadQuestionEvents: flow(function* loadQuestionEvents() {
      const response: ApiResponse<MobileQuestionEventMessageSent[]> =
        yield listMobileQuestionEvents(self.id)
      if (response.ok && response.data !== undefined && response.data !== null) {
        self.events = cast(response.data)
      }
    }),
    takeConsultation: flow(function* takeConsultation() {
      const response: ApiResponse<BackendQuestion> = yield pickQuestion(self.id)
      if (response.ok) {
        self = Object.assign(self, response.data)
      }
    }),
  }))

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
// export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
