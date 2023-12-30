import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CategoryBriefSection, QuestionBriefSection } from "app/services/ask-api/models"

/**
 * Model description here for TypeScript hints.
 */
export const HighlightSectionModel = types
  .model("HighlightSection")
  .props({
    expertExclusive: types.maybe(types.frozen<QuestionBriefSection>()),
    recent: types.maybe(types.frozen<QuestionBriefSection>()),
    popularCategories: types.maybe(types.frozen<CategoryBriefSection>()),
    matchProfile: types.maybe(types.frozen<QuestionBriefSection>()),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface HighlightSection extends Instance<typeof HighlightSectionModel> {}
export interface HighlightSectionSnapshotOut extends SnapshotOut<typeof HighlightSectionModel> {}
export interface HighlightSectionSnapshotIn extends SnapshotIn<typeof HighlightSectionModel> {}
export const createHighlightSectionDefaultModel = () => types.optional(HighlightSectionModel, {})
