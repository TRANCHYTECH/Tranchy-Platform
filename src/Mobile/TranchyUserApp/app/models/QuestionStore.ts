import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionModel, QuestionSnapshotOut } from "./Question"
import { api } from "app/services/api"
import { SupportLevels } from "./ConventionalConstants"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.array(QuestionModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    insertDummy() {
      store.questions.clear()
      for (let i = 1; i < 50; i++) {
        const q = QuestionModel.create({
          title:
            "The most important type in MST is types.model, which can be used to describe the shape of an o " +
            i,
          supportLevel: SupportLevels[0],
          description: "",
          id: `question=${i}`,
          priorityId: "urgent",
          communityShareAgreement: false,
          createdAt: "42 phut truoc",
          questionCategoryIds: ["finance", "law", "tax"],
        })
        store.questions.push(q)
      }
    },
    async addQuestion(question: QuestionSnapshotOut) {
      const response = await api.addQuestion(question)
      if (response.kind === "ok") {
        store.setProp("questions", [
          {
            id: response.data.id,
            content: question.title,
            categories: question.questionCategoryIds,
            supportLevel: question.supportLevel,
          },
        ])
        console.tron.log("Created question", response.data)
      } else {
        console.tron.error(`Error adding question: ${JSON.stringify(response)}`, [])
      }
    },
  }))
  .views((self) => ({
    get allQuestions() {
      return self.questions
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuestionStore extends Instance<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotOut extends SnapshotOut<typeof QuestionStoreModel> {}
export interface QuestionStoreSnapshotIn extends SnapshotIn<typeof QuestionStoreModel> {}
export const createQuestionStoreDefaultModel = () => types.optional(QuestionStoreModel, {})
