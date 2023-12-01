import { Instance, SnapshotIn, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupportLevels } from "./Constants"
import { QuestionConsultantModel } from "./QuestionConsultant"
import { QuestionPermissionsModel } from "./QuestionPermissions"
import { ApiResponse } from "apisauce"
import { MobileQuestionEventMessageSent, Question } from "app/services/ask-api/models"
import { listMobileQuestionEvents, pickQuestion } from "app/services/ask-api/askApi"
import { IsoDate } from "./helpers/isoDateType"

export const QuestionEventUserModel = types.model("QuestionEventUser").props({
  _id: types.identifier,
})

export const QuestionEventModel = types.model("QuestionEvent").props({
  $type: types.string,
  _id: types.identifier,
  text: types.string,
  createdAt: IsoDate,
  user: types.frozen(QuestionEventUserModel),
})

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
    createdOn: IsoDate,
    createdByUserId: types.string,
    consultant: types.maybeNull(QuestionConsultantModel),
    permissions: types.maybe(QuestionPermissionsModel),
    events: types.array(QuestionEventModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getNotifiedUserId: (userId: string) =>
      self.consultant?.userId.trim() === userId.trim() ? self.createdByUserId : userId,
  }))
  .actions((self) => ({
    loadQuestionEvents: flow(function* loadQuestionEvents() {
      const response: ApiResponse<MobileQuestionEventMessageSent[]> =
        yield listMobileQuestionEvents(self.id)
      if (response.ok) {
        self.events = cast(response.data)
      }
    }),
    takeConsultation: flow(function* takeConsultation() {
      const response: ApiResponse<Question> = yield pickQuestion(self.id)
      if (response.ok) {
        self = Object.assign(self, response.data)
      }
    }),
  }))

export interface QuestionInstance extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
