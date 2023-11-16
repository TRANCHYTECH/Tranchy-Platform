import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionEventModel, QuestionEventSnapshotIn } from "./QuestionEvent"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionEventStoreModel = types
  .model("QuestionEventStore")
  .props({
    events: types.array(QuestionEventModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get sortedEvents() {
      console.log("events", self.events)
      return self.events
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setEvent(input: QuestionEventSnapshotIn) {
      console.log("Received event", input)
      self.events.push(input)
    },
  }))

export interface QuestionEventStore extends Instance<typeof QuestionEventStoreModel> {}
export interface QuestionEventStoreSnapshotOut
  extends SnapshotOut<typeof QuestionEventStoreModel> {}
export interface QuestionEventStoreSnapshotIn extends SnapshotIn<typeof QuestionEventStoreModel> {}
export const createQuestionEventStoreDefaultModel = () =>
  types.optional(QuestionEventStoreModel, {})
