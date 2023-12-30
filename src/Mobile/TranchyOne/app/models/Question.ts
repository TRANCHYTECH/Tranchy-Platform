import { ApiResponse } from "apisauce"
import { listMobileQuestionEvents, pickQuestion } from "app/services/ask-api/askApi"
import {
  Question as BackendQuestion,
  MobileQuestionEventMessageSent,
} from "app/services/ask-api/models"
import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { SupportLevels } from "./Constants"
import { QuestionConsultantModel } from "./QuestionConsultant"
import { QuestionPermissionsModel } from "./QuestionPermissions"
import { backendTypes } from "./helpers/backendTypes"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const QuestionEventUserModel = types.model("QuestionEventUser").props({
  _id: backendTypes.simpleType(types.string),
})

export const QuestionEventModel = types.model("QuestionEvent").props({
  $type: types.string,
  _id: backendTypes.simpleType(types.identifier),
  text: backendTypes.simpleType(types.string),
  createdAt: backendTypes.isoDateType(),
  user: backendTypes.frozenSubType(QuestionEventUserModel),
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
    consultant: backendTypes.simpleType(QuestionConsultantModel),
    permissions: backendTypes.simpleType(QuestionPermissionsModel),
    events: backendTypes.arrayType(QuestionEventModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getNotifiedUserId: (userId: string) =>
      self.consultant?.userId?.trim() === userId.trim() ? self.createdByUserId : userId,
    questionId: self.id || "",
  }))
  .actions((self) => ({
    loadQuestionEvents: flow(function* loadQuestionEvents() {
      const response: ApiResponse<MobileQuestionEventMessageSent[]> =
        yield listMobileQuestionEvents(self.questionId)
      if (response.ok) {
        self.events = cast(response.data)
      }
    }),
    takeConsultation: flow(function* takeConsultation() {
      const response: ApiResponse<BackendQuestion> = yield pickQuestion(self.questionId)
      if (response.ok) {
        self = Object.assign(self, response.data)
      }
    }),
  }))

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
